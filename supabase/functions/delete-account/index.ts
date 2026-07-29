/* 账号删除 — Supabase Edge Function
 *
 * 为什么必须放服务端：浏览器侧拿到的是 publishable key，权限只到 authenticated 角色，
 * 而删除 auth.users 里的行需要 service_role。所以这一步不可能在前端完成。
 *
 * 安全要点：
 *   1. service_role key 只存在于函数的环境变量里，永远不进浏览器、不进仓库
 *   2. 只删「调用者自己」——用户 id 从他自己的 JWT 里取，不接受请求体传入 id，
 *      否则任何登录用户都能删别人的账号
 *   3. progress 表有 on delete cascade，删用户时进度自动清除
 *
 * 部署：
 *   supabase functions deploy delete-account --project-ref zoeflwuzpuwpokfwkigp
 */
import { createClient } from 'jsr:@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const auth = req.headers.get('Authorization') ?? '';
  if (!auth.startsWith('Bearer ')) return json({ error: 'Missing bearer token' }, 401);

  const url = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  // ① 用调用者自己的 token 验明身份 —— id 只能从这里来
  const asCaller = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: auth } },
  });
  const { data: { user }, error: whoErr } = await asCaller.auth.getUser();
  if (whoErr || !user) return json({ error: 'Invalid or expired session' }, 401);

  // ② 用 service_role 执行删除。progress 会随 on delete cascade 一并清掉。
  const admin = createClient(url, serviceKey);
  const { error: delErr } = await admin.auth.admin.deleteUser(user.id);
  if (delErr) return json({ error: delErr.message }, 500);

  return json({ ok: true, deleted: user.id });
});
