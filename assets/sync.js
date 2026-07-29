/* ===== 云同步（可选）=====
 *
 * 设计原则，按重要性排序：
 *
 * 1. **未登录用户的体验一个字节都不变。** supabase-js 是**按需动态加载**的 ——
 *    没登录过就永远不发请求、不加载 SDK，站点仍然是纯静态、可离线、无追踪。
 *    只有点了「发送登录链接」，或本地存在登录标记时，才会去 CDN 取 SDK。
 *
 * 2. **合并而非覆盖。** 复用 app.js 里的 mergeState()：两台设备各刷各的，
 *    谁的进度都不会被对方洗掉。
 *
 * 3. **失败不能卡住界面。** 断网、限流、链接过期，一律降级为「继续用本地」。
 *
 * 4. 用 PKCE 流程（回调走 ?code= 查询参数），避免和本站的 hash 路由打架 ——
 *    默认的 implicit 流程会把 token 塞进 #fragment，正好和 #/practice 冲突。
 */
'use strict';

const CLOUD = {
  sb: null,          // supabase client，懒加载
  user: null,        // 当前登录用户
  status: 'off',     // off | loading | signedout | signedin | syncing | error
  error: '',
  // 邮件链接回跳失败的原因。存 {key, arg} 而不是翻译好的字符串 ——
  // 否则用户切换语言后这条提示会卡在旧语言里。
  linkError: null,
  pushTimer: null,
  lastPushed: '',    // 上次推上去的快照，用于跳过无变化的推送
};

/** 本地登录标记：决定"这次打开要不要加载 SDK" */
const CLOUD_FLAG = 'ccae.cloud';
const hadSession = () => localStorage.getItem(CLOUD_FLAG) === '1';
const setSessionFlag = (v) => v ? localStorage.setItem(CLOUD_FLAG, '1') : localStorage.removeItem(CLOUD_FLAG);

/** 动态加载 supabase-js。只在真正需要时才发生。 */
async function loadSupabase() {
  if (CLOUD.sb) return CLOUD.sb;
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
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

/** 把本地进度写上去（整行 upsert） */
async function cloudPush() {
  const sb = await loadSupabase();
  const snapshot = JSON.stringify(S);
  if (snapshot === CLOUD.lastPushed) return;       // 没变就不推
  const { error } = await sb.from('progress')
    .upsert({ user_id: CLOUD.user.id, data: JSON.parse(snapshot) }, { onConflict: 'user_id' });
  if (error) throw error;
  CLOUD.lastPushed = snapshot;
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

/** 发魔法链接。成功返回 true。 */
async function cloudSendLink(email) {
  const sb = await loadSupabase();
  const { error } = await sb.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: location.origin + location.pathname },
  });
  if (error) throw error;
  return true;
}

async function cloudSignOut() {
  try {
    const sb = await loadSupabase();
    await sb.auth.signOut();
  } catch { /* 网络问题也要能登出本地 */ }
  CLOUD.user = null;
  CLOUD.lastPushed = '';
  setSessionFlag(false);
  setCloudStatus('signedout');
}

/**
 * 登录成功后的首次对账。
 * 云端有数据且和本地不一致 → 交给用户决定（复用导入那套三列对比），
 * 不自作主张覆盖任何一边。
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
      CLOUD.lastPushed = JSON.stringify(S);
      applyTheme(); paintChrome(); updateWrongPill(); router();
    } else if (JSON.stringify(remote.state) !== JSON.stringify(S)) {
      // 两边都有且不同 → 让用户选，不自动合并
      setCloudStatus('signedin');
      if (opts.silent) {                       // 页面刚加载时不打断，先合并保平安
        S = mergeState(S, remote.state); save();
        await cloudPush();
        updateWrongPill(); router();
      } else {
        stageImport(JSON.stringify(remote.state), { fromCloud: true });
        return;
      }
    } else {
      CLOUD.lastPushed = JSON.stringify(S);
    }
    setCloudStatus('signedin');
  } catch (e) {
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

/** 顶栏的同步小圆点 */
function paintCloudBadge() {
  const el = $('#cloudBadge');
  if (!el) return;
  const map = {
    off: ['', ''], signedout: ['', ''], loading: ['·', 'sync'],
    signedin: ['●', 'ok'], syncing: ['◐', 'sync'], error: ['▲', 'bad'],
  };
  const [ch, cls] = map[CLOUD.status] || ['', ''];
  el.textContent = ch;
  el.className = 'cloud-badge ' + cls;
  el.hidden = !ch;
  el.title = CLOUD.status === 'error' ? t('cloud_err_title', CLOUD.error)
           : CLOUD.status === 'signedin' ? t('cloud_synced', CLOUD.user?.email || '')
           : CLOUD.status === 'syncing' ? t('cloud_syncing') : '';
}
