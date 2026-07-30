# 安全策略 · Security Policy

[中文](#中文) · [English](#english)

---

## 中文

### 怎么报告

**请不要开公开 issue。** 发邮件到 **`aicrazy@agent.qq.com`**，标题里带上 `[security]`。

本项目由一个人业余维护，没有赏金计划。但我会认真对待每一封 ——
一般 **72 小时内**给你回音，说明我怎么判断、准备怎么修。不承诺修复时限，
修好之后如果你愿意署名，我会在 commit 或 release note 里注明。

邮件里能带上这些的话会快很多：

- 受影响的地址（`https://signal0.net/#/...`）或文件路径
- 复现步骤，越具体越好
- 你认为的影响面 —— 尤其是**是否涉及其他用户的数据**

### 哪些算、哪些不算

**在范围内：**

- `signal0.net` 站点本身，以及本仓库的前端代码
- Supabase 的行级安全策略与授权（`supabase/schema.sql`）—— 特别是任何能让一个账号
  读到或改到**别人那一行**的路径
- 账号删除的 Edge Function（`supabase/functions/delete-account/`）—— 特别是能删掉别人账号的路径
- 进度导入导出：能通过构造 JSON 把内容注入页面的路径

**不在范围内：**

- Supabase / Vercel / Resend 这些第三方服务自身的漏洞 —— 请直接报给它们
- 需要用户先被完全攻陷（恶意浏览器扩展、设备被控）才能成立的问题
- 自动化扫描器的原始输出，没有可复现的实际影响
- 题目内容有错、翻译不准 —— 这些**欢迎直接开 issue**，不算安全问题

### 这些是有意为之，不是漏洞

**`assets/data/config.js` 里的那把 key 是公开的，这是设计如此。**
它是 Supabase 的 publishable key（旧称 anon key），本来就会出现在每一个浏览器的网络请求里，
官方明确说明可安全用于前端。安全边界不在这把 key，而在数据库：

- 未登录 = `anon` 角色 = 对数据表**零权限**（`revoke all`，且没有任何策略授予它）
- 登录 = 只能读写 `user_id` 等于自己的那一行，由 RLS 在数据库层强制，不依赖前端代码

策略配置是公开的，你可以自己在 [`supabase/schema.sql`](supabase/schema.sql) 里核对。
**如果你能证明这个边界被绕过了 —— 那是真漏洞，我很想知道。**

### 支持的版本

这是一个滚动发布的静态站点，只有一个版本：`main` 分支的最新提交，也就是 `signal0.net` 上跑着的那份。
旧的 commit 不做安全维护。

---

## English

### How to report

**Please do not open a public issue.** Email **`aicrazy@agent.qq.com`** with `[security]` in the subject.

This is a side project maintained by one person, and there is no bounty programme. Every report is
still read properly: expect a reply **within 72 hours** explaining how I read the issue and what I
plan to do. No fix deadline is promised. If you would like credit once it is fixed, I will name you
in the commit or release note.

Including these makes it much faster:

- The affected URL (`https://signal0.net/#/...`) or file path
- Steps to reproduce, as concrete as you can make them
- Your view of the impact — above all, **whether any other user's data is involved**

### Scope

**In scope:**

- The `signal0.net` site and the front-end code in this repository
- Supabase row-level security and grants (`supabase/schema.sql`) — especially any path that lets one
  account read or write **someone else's row**
- The account-deletion Edge Function (`supabase/functions/delete-account/`) — especially any path
  that deletes an account other than the caller's
- Progress import/export: any crafted JSON that injects content into the page

**Out of scope:**

- Vulnerabilities in Supabase, Vercel or Resend themselves — please report those to them directly
- Issues that require the user to already be fully compromised (malicious browser extension,
  compromised device)
- Raw scanner output with no reproducible real-world impact
- Wrong answers or inaccurate translations — those are **very welcome as public issues**, but they
  are not security reports

### Working as intended, not a vulnerability

**The key in `assets/data/config.js` is public by design.**
It is a Supabase publishable key (formerly the anon key). It appears in every browser's network
requests by definition, and Supabase documents it as safe for front-end use. The security boundary
is not that key — it is the database:

- Signed out = the `anon` role = **zero privileges** on the table (`revoke all`, and no policy grants it anything)
- Signed in = read and write only the row whose `user_id` is your own, enforced by RLS inside the
  database rather than trusted to front-end code

The policy configuration is public; check it yourself in [`supabase/schema.sql`](supabase/schema.sql).
**If you can demonstrate that this boundary is bypassed, that is a real vulnerability and I want to hear about it.**

### Supported versions

This is a rolling static site with exactly one version: the latest commit on `main`, which is what
runs on `signal0.net`. Older commits receive no security maintenance.
