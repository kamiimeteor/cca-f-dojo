/* 云同步配置
 *
 * 这两个值**本来就是公开的**，进公开仓库没问题：
 *   - url  是项目地址，本来就会出现在网络请求里
 *   - key  是 publishable key（旧称 anon key），Supabase 明确说明可安全用于浏览器
 * 安全边界不在密钥，而在数据库的 RLS 策略（见 supabase/schema.sql）：
 *   未登录 = anon 角色 = 零权限；登录 = 只能读写 user_id 等于自己的那一行。
 *
 * ⚠️ Fork 之后请务必改这里。这两个值指向的是本站作者的 Supabase 项目 ——
 *    直接部署 fork 出去的站点，你的用户会把邮箱和进度注册进**作者的**数据库，
 *    而不是你的。要么换成你自己项目的值，要么两个都留空：
 *    留空时 CLOUD_ENABLED 为 false，整块云同步自动隐藏，站点退化成纯本地模式。
 */
const SUPABASE_CONFIG = {
  url: 'https://zoeflwuzpuwpokfwkigp.supabase.co',
  key: 'sb_publishable_PpdJ_1roQQmytsiRJhqA6w_oQygNNW6',
};

/** 没配就整个功能隐藏 */
const CLOUD_ENABLED = !!(SUPABASE_CONFIG.url && SUPABASE_CONFIG.key);
