/* 登录回调 hash 判定回归测试 —— 跑 `node scripts/test-auth-hash.js`
 *
 * 守的是一条曾经踩过的坑：识别回调参数的 readAuthCallback() 用 URLSearchParams
 * （会解码 %65 → e），而清理 URL 的 hashIsAuthJunk() 用裸正则（不解码）。
 * 两者判定标准不一致时，`#%65rror=expired` 这类编码形式会被识别成错误、弹出
 * 「链接失效」提示，但 hash 清不掉 —— 残留的 hash 被路由当成未知路由，底下
 * 渲染「页面不存在」，刷新还会重复触发。
 *
 * 所以核心断言是：**凡 readAuthCallback() 认为要动作的 hash，hashIsAuthJunk()
 * 都必须认为要清理**。外加一条反向保护：正常的 `#/route` 绝不能被当成残留清掉。
 */
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const SRC = 'cca-f/assets/sync.js';
const source = fs.readFileSync(SRC, 'utf8');

/* 把三段目标代码从浏览器端源码里抠出来，喂给一个能注入 location 的沙箱。 */
const authParams = source.match(/^const AUTH_PARAMS = \[[\s\S]*?\];/m);
assert(authParams, `${SRC} 缺少 AUTH_PARAMS`);

const readCb = source.match(/^function readAuthCallback\(\)[\s\S]*?^}/m);
assert(readCb, `${SRC} 缺少 readAuthCallback()`);

/* 箭头函数体可能是单行表达式，也可能是多行块，两种都要能抠出来 */
const isJunk = source.match(/^const hashIsAuthJunk = \(\) => \{[\s\S]*?^\};$/m)
  || source.match(/^const hashIsAuthJunk = \(\) =>[\s\S]*?;$/m);
assert(isJunk, `${SRC} 缺少 hashIsAuthJunk()`);

const context = vm.createContext({ URLSearchParams, location: { search: '', hash: '' } });
vm.runInContext(
  `${authParams[0]}\n${readCb[0]}\n${isJunk[0]}\n`,
  context,
);

/** 换一个 hash，返回两个函数各自的判断 */
function probe(hash, search = '') {
  context.location.hash = hash;
  context.location.search = search;
  const cb = vm.runInContext('readAuthCallback()', context);
  const junk = vm.runInContext('hashIsAuthJunk()', context);
  // cloudInit() 只在拿到 code / error / errorCode 时才动作
  const acts = Boolean(cb.code || cb.error || cb.errorCode);
  return { acts, junk };
}

/* ---------- 1. 回调残留：必须被清掉 ---------- */
const JUNK = [
  '#error=expired',
  '#%65rror=expired',
  '#error_code=otp_expired',
  '#%65rror_code=otp_expired',
  '#access_token=x&refresh_token=y&token_type=bearer&expires_in=3600',
  '#error=x&error_description=Email+link+is+invalid',
  '#sb=1',
];
for (const hash of JUNK) {
  assert(probe(hash).junk, `回调残留应被清理，但 hashIsAuthJunk 放过了：${hash}`);
}

/* ---------- 2. 正常路由：绝不能被清掉 ---------- */
const ROUTES = [
  '#/',
  '#/practice',
  '#/notes/1.1',
  '#/exam/run',
  '#/wrong',
  '#/privacy',
  '',              // 空 hash
  '#nonexistent',  // 既不是路由也不是回调
];
for (const hash of ROUTES) {
  assert(!probe(hash).junk, `正常 hash 被误判成回调残留，会清掉用户当前页面：${hash}`);
}

/* ---------- 3. 核心：两个函数判定必须一致 ---------- */
/* 凡 cloudInit 会动作的 hash，stripAuthParams 就必须能清掉它，
   否则会留下一个「弹提示 + 页面不存在」的死状态。 */
const ALL = [...JUNK, ...ROUTES];
for (const hash of ALL) {
  const { acts, junk } = probe(hash);
  assert(
    !acts || junk,
    `readAuthCallback 会动作但 hashIsAuthJunk 不清理，hash 会残留成「页面不存在」：${hash}`,
  );
}

/* ---------- 4. query 侧的错误不应连累 hash ---------- */
/* Supabase 失败时会把同一份错误同时塞进 query 和 hash；只有 query 带错误、
   hash 是正常路由时，路由必须留着。 */
{
  const { acts, junk } = probe('#/practice', '?error=access_denied&error_code=otp_expired');
  assert(acts, 'query 里的错误应被 readAuthCallback 读到');
  assert(!junk, 'query 带错误时不该把正常的 #/route 也清掉');
}
