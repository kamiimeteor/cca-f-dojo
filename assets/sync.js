/* ===== 云同步（可选）=====
 *
 * 设计原则，按重要性排序：
 *
 * 1. **未登录用户的体验一个字节都不变。** supabase-js 是**按需动态加载**的 ——
 *    没登录过就永远不发请求、不加载 SDK，站点仍然是纯静态、可离线、无追踪。
 *    只有点了「发送验证码」，或本地存在登录标记时，才会去加载 SDK ——
 *    而且 SDK 是自托管的，不走任何第三方 CDN。
 *
 * 2. **合并而非覆盖。** 复用 app.js 里的 mergeState()：两台设备各刷各的，
 *    谁的进度都不会被对方洗掉。
 *
 * 3. **失败不能卡住界面。** 断网、限流、链接过期，一律降级为「继续用本地」。
 *
 * 4. 登录用**邮件里的一次性验证码**，不用魔法链接。原因见 cloudSendCode()。
 */
'use strict';

const CLOUD = {
  sb: null,          // supabase client，懒加载
  sdkPromise: null,  // SDK 的加载中 promise，避免并发重复插 <script>
  user: null,        // 当前登录用户
  status: 'off',     // off | loading | signedout | signedin | syncing | conflict | error
  error: '',
  // 邮件链接回跳失败的原因。存 {key, arg} 而不是翻译好的字符串 ——
  // 否则用户切换语言后这条提示会卡在旧语言里。
  linkError: null,
  conflictRemote: null,  // 云端那份的 JSON，冲突未解决时留着，供用户随时重开对比
  pendingEmail: '',  // 已发出验证码、等待用户输入的那个邮箱
  pushTimer: null,
  lastPushed: '',    // 上次推上去的快照，用于跳过无变化的推送
};

/** 本地登录标记：决定"这次打开要不要加载 SDK" */
const CLOUD_FLAG = 'ccae.cloud';
const hadSession = () => localStorage.getItem(CLOUD_FLAG) === '1';
const setSessionFlag = (v) => v ? localStorage.setItem(CLOUD_FLAG, '1') : localStorage.removeItem(CLOUD_FLAG);

/* supabase-js 自托管在仓库里，**不走 CDN**。原先用的是
 *   import('https://esm.sh/@supabase/supabase-js@2')
 * 换掉的原因见 assets/vendor/README.md，简单说是三条：中国大陆访问 esm.sh
 * 不稳定（本站主要面向中文用户，登录会直接挂）、那是隐私政策里没披露的
 * 第三方请求、以及多一个运行时外部依赖就多一类线上故障。
 *
 * 换成 UMD 构建 + 动态插 <script>，而不是 ESM 动态 import：官方那个
 * es 模块产物不是自包含的，会再去拉一串子包；UMD 是单文件。 */
const SDK_PATH = 'assets/vendor/supabase-js-2.111.0.umd.js';

/** 把 SDK 塞进页面。重复调用只会加载一次。 */
function loadSdk() {
  if (window.supabase?.createClient) return Promise.resolve();
  if (CLOUD.sdkPromise) return CLOUD.sdkPromise;

  CLOUD.sdkPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SDK_PATH;
    s.onload = () => window.supabase?.createClient
      ? resolve()
      : reject(new Error('supabase-js loaded but exposed no createClient'));
    s.onerror = () => { CLOUD.sdkPromise = null; reject(new Error('sdk_load_failed')); };
    document.head.appendChild(s);
  });
  return CLOUD.sdkPromise;
}

/** 拿到 client。只在真正需要时才加载 SDK。 */
async function loadSupabase() {
  if (CLOUD.sb) return CLOUD.sb;
  await loadSdk();
  const { createClient } = window.supabase;
  CLOUD.sb = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key, {
    auth: {
      flowType: 'pkce',          // 回调走 ?code=，不占用 hash
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'ccae.auth',
    },
  });
  return CLOUD.sb;
}

/** 供 UI 判断当前状态 */
const cloudState = () => ({
  enabled: CLOUD_ENABLED,
  status: CLOUD.status,
  email: CLOUD.user?.email || '',
  error: CLOUD.error,
  linkError: CLOUD.linkError,
  pendingEmail: CLOUD.pendingEmail,
  hasConflict: !!CLOUD.conflictRemote,
});

/* ---------------- 拉取 / 推送 ---------------- */

/** 从云端取这个用户的进度；没有就返回 null */
async function cloudPull() {
  const sb = await loadSupabase();
  const { data, error } = await sb
    .from('progress').select('data, updated_at')
    .eq('user_id', CLOUD.user.id).maybeSingle();
  if (error) throw error;
  return data ? { state: sanitizeState(data.data), updatedAt: data.updated_at } : null;
}

/**
 * 稳定序列化：递归按 key 排序后再 stringify。
 *
 * 不能直接用 JSON.stringify 比较本地和云端 —— Postgres 的 jsonb **会重排
 * key**，而本地对象的 key 顺序是按答题先后插入的。两边内容完全一样，
 * 字符串却不同，于是「有没有变化」永远判成「有」：每次打开页面都会白推
 * 一次，非静默路径下还会弹出「云端 vs 本地」的三列对比，吓用户一跳。
 */
function stableStr(v) {
  if (Array.isArray(v)) return '[' + v.map(stableStr).join(',') + ']';
  if (v && typeof v === 'object')
    return '{' + Object.keys(v).sort().map((k) => JSON.stringify(k) + ':' + stableStr(v[k])).join(',') + '}';
  return JSON.stringify(v);
}

/** 把本地进度写上去（整行 upsert） */
async function cloudPush() {
  const sb = await loadSupabase();
  const snapshot = stableStr(S);
  if (snapshot === CLOUD.lastPushed) return;       // 没变就不推
  const { error } = await sb.from('progress')
    .upsert({ user_id: CLOUD.user.id, data: S }, { onConflict: 'user_id' });
  if (error) throw error;
  CLOUD.lastPushed = snapshot;
}

/**
 * 这个会话背后的账号已经不存在了吗？
 *
 * 在别的设备上删了账号之后，本机手里的 JWT 还没过期，界面会一直显示
 * 「已登录 · 进度已同步」，而每次推送都以外键错误失败 —— 用户看到的是
 * 一句 Postgres 原文，还会无限重试。识别出来直接本地登出，说清楚原因。
 */
function isDeadSession(e) {
  if (!e) return false;
  if (e.code === '23503') return true;                       // progress_user_id_fkey：用户行没了
  if (e.status === 401) return true;
  return e.status === 403 && /sub claim|does not exist|user_not_found/i.test(e.message || '');
}

/** 账号已不存在 → 本地登出，但**保留本机进度**（登出从不删本地数据） */
async function handleDeadSession() {
  await cloudSignOut();
  CLOUD.linkError = { key: 'cloud_account_gone', h: 'cloud_account_gone_h' };
  if (!$('#progModal').hidden && typeof renderProgressBody === 'function') renderProgressBody();
}

/** 本地有变更 → 防抖后推送。任何失败都只记录，不打断做题。 */
function schedulePush() {
  if (CLOUD.status !== 'signedin') return;
  clearTimeout(CLOUD.pushTimer);
  CLOUD.pushTimer = setTimeout(async () => {
    try {
      setCloudStatus('syncing');
      await cloudPush();
      setCloudStatus('signedin');
    } catch (e) {
      if (isDeadSession(e)) return handleDeadSession();
      CLOUD.error = e.message || String(e);
      setCloudStatus('error');
    }
  }, 2500);
}

function setCloudStatus(s) {
  CLOUD.status = s;
  if (s !== 'error') CLOUD.error = '';
  paintCloudBadge();
  // 进度面板开着的话同步刷新它
  if (!$('#progModal').hidden && typeof renderProgressBody === 'function') renderProgressBody();
}

/* ---------------- 登录 / 登出 ---------------- */

/**
 * 发 6 位登录码。成功返回 true。
 *
 * 这里**刻意不用魔法链接**，两个实测到的原因：
 *
 *   1. 一次性链接会被邮箱的安全扫描器提前访问掉。实测两条链接都在用户
 *      本人点击之前就变成了 otp_expired，用户根本登不进来。
 *   2. PKCE 的 code_verifier 存在「点发送的那个浏览器」的 localStorage 里。
 *      在电脑上点发送、在手机邮箱 App 里打开链接 —— 必然失败。
 *
 * 手输验证码两个问题都没有：没有 URL 可供预取，也不依赖本地 verifier。
 * 注意链接和验证码是**同一个一次性 token**，用掉一个另一个就废了，
 * 所以邮件模板里必须只留 {{ .Token }}、不能保留 {{ .ConfirmationURL }}。
 */
async function cloudSendCode(email) {
  const sb = await loadSupabase();
  const { error } = await sb.auth.signInWithOtp({ email });
  if (error) throw error;
  CLOUD.pendingEmail = email;
  return true;
}

/** 用邮件里的 6 位码换 session */
async function cloudVerifyCode(email, code) {
  const sb = await loadSupabase();
  const { data, error } = await sb.auth.verifyOtp({
    email, token: String(code).trim(), type: 'email',
  });
  if (error) throw error;
  if (!data?.user) throw new Error('verifyOtp returned no user');
  CLOUD.pendingEmail = '';
  // 把「是否已挂出对比界面」原样透传给调用方，别让它重绘盖掉
  return { staged: (await cloudOnSignedIn(data.user)) === true };
}

async function cloudSignOut() {
  try {
    const sb = await loadSupabase();
    await sb.auth.signOut();
  } catch { /* 网络问题也要能登出本地 */ }
  CLOUD.user = null;
  CLOUD.lastPushed = '';
  CLOUD.pendingEmail = '';
  CLOUD.conflictRemote = null;
  setSessionFlag(false);
  setCloudStatus('signedout');
}

/**
 * 登录成功后的首次对账。
 * 云端有数据且和本地不一致 → 交给用户决定（复用导入那套三列对比），
 * 不自作主张覆盖任何一边。
 *
 * **返回 true 表示已经把对比界面挂进了进度面板**，此时调用方绝对不能再
 * 重绘面板 —— 否则会把它盖掉，用户根本看不到，`PENDING` 也就永远没人
 * 确认，两边各留各的，界面却显示「进度已同步」。这是实测踩到的坑。
 */
async function cloudOnSignedIn(user, opts = {}) {
  CLOUD.user = user;
  CLOUD.linkError = null;        // 登上了，之前那条链接的报错就没意义了
  setSessionFlag(true);
  setCloudStatus('syncing');
  try {
    const remote = await cloudPull();
    const localHasData = digest(S).seen > 0 || S.read.length > 0 || S.exams.length > 0;

    if (!remote) {
      await cloudPush();                       // 云端空 → 直接把本地传上去
    } else if (!localHasData) {
      S = remote.state; save();                // 本地空 → 直接用云端的
      CLOUD.lastPushed = stableStr(S);
      applyTheme(); paintChrome(); updateWrongPill(); router();
    } else if (stableStr(remote.state) !== stableStr(S)) {
      // 两边都有且不同 → 让用户选，不自动合并
      if (opts.silent) {                       // 页面刚加载时不打断，先合并保平安
        S = mergeState(S, remote.state); save();
        await cloudPush();
        updateWrongPill(); router();
      } else {
        // 挂起冲突：既不能说「已同步」（没同步），也不能放任后续改动把云端
        // 覆盖掉（schedulePush 只在 signedin 时推，conflict 状态天然挡住了）
        CLOUD.conflictRemote = JSON.stringify(remote.state);
        setCloudStatus('conflict');
        return stageImport(CLOUD.conflictRemote, { fromCloud: true });
      }
    } else {
      CLOUD.lastPushed = stableStr(S);
    }
    setCloudStatus('signedin');
  } catch (e) {
    if (isDeadSession(e)) { await handleDeadSession(); return false; }
    CLOUD.error = e.message || String(e);
    setCloudStatus('error');
  }
}

/* ---------------- 启动 ---------------- */

/** 回调里可能出现的参数名，清理 URL 时按这张表来 */
const AUTH_PARAMS = ['code', 'error', 'error_code', 'error_description',
                     'access_token', 'refresh_token', 'token_type', 'expires_in', 'sb'];

/**
 * 读邮件链接回跳带的参数。
 *
 * 成功时 PKCE 只往 ?code= 放东西；**失败时 Supabase 会把同一份错误同时塞进
 * query 和 hash**（`?error=...#error=...`）。hash 那份会顶掉本站的 `#/route`，
 * 所以两边都要读、两边都要清。
 */
function readAuthCallback() {
  const q = new URLSearchParams(location.search);
  const h = new URLSearchParams(location.hash.replace(/^#/, ''));
  const pick = (k) => q.get(k) || h.get(k) || '';
  return {
    code: q.get('code'),
    error: pick('error'),
    errorCode: pick('error_code'),
    desc: pick('error_description').replace(/\+/g, ' '),
  };
}

/** hash 里装的是回调残留（而不是 `#/route`）时为真 */
const hashIsAuthJunk = () =>
  AUTH_PARAMS.some((k) => new RegExp(`(^#|&)${k}=`).test(location.hash));

/** 把回调残留从地址栏抹掉：query 里逐个删，hash 是垃圾就整个丢掉 */
function stripAuthParams() {
  const url = new URL(location.href);
  AUTH_PARAMS.forEach((k) => url.searchParams.delete(k));
  const hash = hashIsAuthJunk() ? '' : url.hash;
  history.replaceState(null, '', url.pathname + url.search + hash);
}

/**
 * 只在这三种情况下动作：
 *   a) URL 里带 ?code=（刚点完邮件链接回来）→ 换 session
 *   b) URL 里带 error（链接过期/已用过）→ 只提示，不联网
 *   c) 本地有登录标记（老用户回访）→ 恢复 session
 * 其余情况完全不碰网络。
 */
async function cloudInit() {
  if (!CLOUD_ENABLED) return;

  const cb = readAuthCallback();

  // 链接没能用上 —— 必须让用户看见，不能静默丢回首页。
  // 这条路径一个网络请求都不发，SDK 也不加载。
  if (cb.error || cb.errorCode) {
    CLOUD.linkError = cb.errorCode === 'otp_expired'
      ? { key: 'cloud_link_expired' }
      : { key: 'cloud_link_failed', arg: cb.desc || cb.error };
    stripAuthParams();
    CLOUD.status = 'signedout';
    paintCloudBadge();
    router();                      // hash 清掉了，重渲染一次让导航高亮回位
    setTimeout(openProgress, 0);   // 直接把云同步面板拉出来，否则用户看不到
    return;
  }

  if (!cb.code && !hadSession()) { CLOUD.status = 'signedout'; return; }

  try {
    CLOUD.status = 'loading'; paintCloudBadge();
    const sb = await loadSupabase();

    // detectSessionInUrl 会自动用 ?code= 换 session；换完把 URL 清干净
    if (cb.code) stripAuthParams();

    const { data: { session } } = await sb.auth.getSession();
    if (session?.user) await cloudOnSignedIn(session.user, { silent: true });
    else { setSessionFlag(false); setCloudStatus('signedout'); }

    // 跨标签页：一处登出，别处跟着变
    sb.auth.onAuthStateChange((event, sess) => {
      if (event === 'SIGNED_OUT') {
        CLOUD.user = null; setSessionFlag(false); setCloudStatus('signedout');
      } else if (sess?.user && CLOUD.user?.id !== sess.user.id) {
        cloudOnSignedIn(sess.user, { silent: true });
      }
    });
  } catch (e) {
    CLOUD.error = e.message || String(e);
    setCloudStatus('error');
  }
}

/** 删除账号。调 Edge Function —— 浏览器侧权限不足以删 auth.users。
 *  云端数据随 on delete cascade 一并清除；本机进度保留不动。 */
async function cloudDeleteAccount() {
  const sb = await loadSupabase();
  const { data: { session } } = await sb.auth.getSession();
  if (!session) throw new Error('not signed in');

  const res = await fetch(`${SUPABASE_CONFIG.url}/functions/v1/delete-account`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      apikey: SUPABASE_CONFIG.key,
      'Content-Type': 'application/json',
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || `HTTP ${res.status}`);

  await sb.auth.signOut().catch(() => {});
  CLOUD.user = null; CLOUD.lastPushed = '';
  setSessionFlag(false);
  setCloudStatus('signedout');
}

/**
 * 顶栏的账号胶囊：圆形头像 + 右下角状态角标。
 *
 * 头像用邮箱首字母，不用 Gravatar —— 那要把邮箱的 hash 发给第三方，
 * 和本站「不向第三方发任何请求」的定位直接冲突。首字母是零成本零外泄的。
 */
function paintCloudBadge() {
  const el = $('#cloudBadge'), ava = $('#cloudAva'), mark = $('#cloudMark'), lbl = $('#cloudLabel');
  if (!el || !ava || !mark || !lbl) return;

  // 这个按钮**永远显示**：未登录时它是「管理进度」的入口（导出/导入/登录都在里面），
  // 登录后才升级成头像胶囊。以前未登录时整个藏起来，导航栏上就没有任何入口了。
  const signed = ['loading', 'signedin', 'syncing', 'conflict', 'error'].includes(CLOUD.status);
  if (!signed) {
    el.className = 'cloud-chip plain';
    lbl.textContent = t('prog_open');
    ava.textContent = '';
    el.title = t('prog_open');
    el.setAttribute('aria-label', t('prog_open'));
    return;
  }
  lbl.textContent = '';

  const email = CLOUD.user?.email || '';
  ava.textContent = (email.trim()[0] || '?').toUpperCase();

  const cls = { loading: 'sync', signedin: 'ok', syncing: 'sync', conflict: 'warn', error: 'bad' }[CLOUD.status];
  el.className = 'cloud-chip ' + cls;

  const label = CLOUD.status === 'conflict' ? t('cloud_conflict_title')
              : CLOUD.status === 'error' ? t('cloud_err_title', CLOUD.error)
              : CLOUD.status === 'syncing' ? t('cloud_syncing')
              : CLOUD.status === 'loading' ? t('cloud_loading')
              : t('cloud_synced', email);
  el.title = label;
  el.setAttribute('aria-label', label);
}
