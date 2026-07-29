/* 隐私政策正文（中 / 英）
 *
 * ⚠️ 这是按 UK GDPR 常见要求拟的文本，**不构成法律意见**。
 *    对外正式运营前建议对照 ICO 官网模板核一遍，或请懂英国数据保护的人过目。
 *
 * 事实性内容必须与实现保持一致 —— 改了同步逻辑就要回来改这里。
 */
const PRIVACY_UPDATED = '2026-07-28';
const PRIVACY_CONTACT = 'privacy@signal0.net';

const PRIVACY = {
  zh: [
    { t: 'p', v: '**一句话版本：不登录就什么都不收集。** 登录只是为了把你的做题进度存起来，方便换设备继续 —— 除此之外没有任何用途。没有广告、没有分析脚本、没有第三方追踪、不卖数据。' },

    { t: 'h', v: '一、谁在处理你的数据' },
    { t: 'p', v: `本站（cca-f-dojo，域名 signal0.net）由个人开发者运营，是一个免费开源的备考工具。就英国 GDPR 而言，运营者是**数据控制者**。` },
    { t: 'p', v: `数据保护相关事宜联系：\`${PRIVACY_CONTACT}\`` },

    { t: 'h', v: '二、不登录的情况' },
    { t: 'p', v: '**不收集任何个人数据。** 你的做题记录、错题、模考成绩、笔记进度，全部存在你自己浏览器的 localStorage 里，从不离开你的设备。本站没有服务端日志留存你的行为，也没有 cookie 横幅要点 —— 因为压根没设 cookie。' },
    { t: 'p', v: '这也是默认状态。整站不登录就能完整使用。' },

    { t: 'h', v: '三、登录后收集什么' },
    { t: 'table', head: ['数据', '用途', '来源'], rows: [
      ['邮箱地址', '识别你的账号、发送一次性登录链接', '你主动填写'],
      ['学习进度（做题记录、错题、模考成绩、笔记标记、界面偏好）', '跨设备同步', '你使用本站时产生'],
      ['账号创建与最后登录时间', '账号管理、清理长期不活跃账号', '系统自动记录'],
    ]},
    { t: 'p', v: '**不收集**：姓名、地址、电话、支付信息、IP 画像、设备指纹、浏览行为分析。也不做任何形式的用户画像或自动化决策。' },

    { t: 'h', v: '四、法律依据' },
    { t: 'p', v: '处理上述数据的依据是**履行合同**（UK GDPR 第 6(1)(b) 条）—— 你要求本站为你同步进度，为此必须存储你的邮箱和进度数据。不依赖「同意」，因为这些处理是提供该功能所必需的，没有它功能就不存在。' },
    { t: 'p', v: '你随时可以停止：登出即可，删除账号则彻底清除。' },

    { t: 'h', v: '五、数据存在哪里' },
    { t: 'p', v: '存储在 **Supabase**（数据处理者），基础设施位于 **AWS 伦敦区域（eu-west-2）**。' },
    { t: 'p', v: '**数据不出英国境内。** 选择伦敦区域正是为了避免跨境传输。' },
    { t: 'p', v: '邮件发送由第三方邮件服务商代为投递，仅用于发送登录链接，内容不含你的学习数据。' },

    { t: 'h', v: '六、保留多久' },
    { t: 'list', v: [
      '账号存续期间：进度持续保留，方便你随时继续',
      '你删除账号：**立即永久删除**，包括所有云端进度，不可恢复',
      '长期不活跃：**连续 24 个月未登录**的账号及其数据将被清理',
      '本机数据：由你自己控制，可随时在「管理进度」里清空',
    ]},

    { t: 'h', v: '七、你的权利' },
    { t: 'p', v: '在英国 GDPR 下你享有以下权利，本站提供的行使方式如下：' },
    { t: 'table', head: ['权利', '怎么行使'], rows: [
      ['访问 —— 知道本站存了你什么', '「管理进度」里可查看全部数据；邮箱即你登录用的那个'],
      ['更正 —— 改正不准确的数据', '进度数据由你使用产生，可直接在站内修改或清空'],
      ['删除 —— 抹掉全部', '「管理进度 → 删除账号」，即时生效'],
      ['可携 —— 拿走你的数据', '「管理进度 → 下载文件」，导出标准 JSON'],
      ['限制 / 反对处理', `发邮件到 \`${PRIVACY_CONTACT}\``],
    ]},
    { t: 'p', v: `**投诉权**：如果你认为本站处理你的数据的方式不当，有权向英国信息专员办公室（ICO）投诉 —— <https://ico.org.uk/make-a-complaint/>。也欢迎先联系 \`${PRIVACY_CONTACT}\`，多数问题可以直接解决。` },

    { t: 'h', v: '八、本地存储说明' },
    { t: 'p', v: '本站**不使用 cookie**。使用的是浏览器 localStorage，存放两类内容：' },
    { t: 'list', v: [
      '`ccae.v2` —— 你的学习进度与界面偏好（不登录也有，纯本地）',
      '`ccae.auth` —— 登录后的会话令牌，用于保持登录状态',
    ]},
    { t: 'p', v: '两者都属于**提供你主动要求的功能所必需**的存储，按 PECR 属于豁免情形，因此没有同意横幅。你随时可以在浏览器设置里清除。' },

    { t: 'h', v: '九、安全' },
    { t: 'p', v: '数据库启用了行级安全策略（RLS）：**每个账号只能读写自己那一行**，在数据库层面强制，不依赖前端代码。未登录角色对数据表零权限。传输全程 HTTPS。' },
    { t: 'p', v: '策略配置是公开的，可在仓库的 `supabase/schema.sql` 中查看并自行验证。' },

    { t: 'h', v: '十、变更' },
    { t: 'p', v: '本政策如有实质性变更，会更新页首日期；涉及处理方式的重大变化会在站内提示。' },
  ],

  en: [
    { t: 'p', v: '**The short version: if you do not sign in, nothing is collected.** Signing in exists only so your practice progress can follow you between devices. No ads, no analytics, no third-party tracking, nothing sold.' },

    { t: 'h', v: '1. Who processes your data' },
    { t: 'p', v: 'This site (cca-f-dojo, at signal0.net) is a free, open-source study tool run by an individual developer. For the purposes of the UK GDPR, the operator is the **data controller**.' },
    { t: 'p', v: `Data protection contact: \`${PRIVACY_CONTACT}\`` },

    { t: 'h', v: '2. If you do not sign in' },
    { t: 'p', v: '**No personal data is collected at all.** Your answers, missed questions, mock exam scores and reading progress live in your own browser\'s localStorage and never leave your device. There are no server-side logs of your activity and no cookie banner — because no cookies are set.' },
    { t: 'p', v: 'This is the default. The entire site works without an account.' },

    { t: 'h', v: '3. What is collected if you do sign in' },
    { t: 'table', head: ['Data', 'Purpose', 'Source'], rows: [
      ['Email address', 'Identify your account, send one-time sign-in links', 'You provide it'],
      ['Study progress (answers, missed questions, mock scores, notes read, UI preferences)', 'Sync across devices', 'Generated as you use the site'],
      ['Account creation and last sign-in timestamps', 'Account management, clearing dormant accounts', 'Recorded automatically'],
    ]},
    { t: 'p', v: '**Not collected**: name, address, phone number, payment details, IP-based profiling, device fingerprints, behavioural analytics. No profiling and no automated decision-making of any kind.' },

    { t: 'h', v: '4. Lawful basis' },
    { t: 'p', v: 'Processing rests on **performance of a contract** (UK GDPR Article 6(1)(b)) — you ask the site to sync your progress, which requires storing your email and that progress. It is not based on consent, because the processing is what the feature *is*; without it there is no feature.' },
    { t: 'p', v: 'You can stop at any time: sign out to pause, delete your account to erase.' },

    { t: 'h', v: '5. Where the data lives' },
    { t: 'p', v: 'Stored with **Supabase** (acting as data processor) on infrastructure in the **AWS London region (eu-west-2)**.' },
    { t: 'p', v: '**Data does not leave the UK.** The London region was chosen specifically to avoid international transfers.' },
    { t: 'p', v: 'Sign-in emails are delivered by a third-party email provider. Those messages contain a sign-in link only — never your study data.' },

    { t: 'h', v: '6. How long it is kept' },
    { t: 'list', v: [
      'While your account exists: progress is retained so you can pick up where you left off',
      'If you delete your account: **erased immediately and permanently**, including all cloud progress',
      'Dormancy: accounts with **no sign-in for 24 consecutive months** are cleared along with their data',
      'Local data: entirely under your control — clear it any time from "Manage progress"',
    ]},

    { t: 'h', v: '7. Your rights' },
    { t: 'p', v: 'Under the UK GDPR you have the following rights. Here is how to exercise each one:' },
    { t: 'table', head: ['Right', 'How'], rows: [
      ['Access — see what is held about you', 'Everything is visible under "Manage progress"; the email is the one you signed in with'],
      ['Rectification — correct inaccurate data', 'Progress data is generated by your own use; change or clear it in the app'],
      ['Erasure — delete everything', '"Manage progress → Delete my account", effective immediately'],
      ['Portability — take your data with you', '"Manage progress → Download file" exports standard JSON'],
      ['Restriction / objection', `Email \`${PRIVACY_CONTACT}\``],
    ]},
    { t: 'p', v: `**Right to complain**: if you believe your data has been handled improperly, you may complain to the UK Information Commissioner's Office — <https://ico.org.uk/make-a-complaint/>. You are also welcome to contact \`${PRIVACY_CONTACT}\` first; most issues can be resolved directly.` },

    { t: 'h', v: '8. Local storage' },
    { t: 'p', v: 'This site sets **no cookies**. It uses browser localStorage for two things:' },
    { t: 'list', v: [
      '`ccae.v2` — your study progress and UI preferences (present even without an account; purely local)',
      '`ccae.auth` — your session token after signing in, so you stay signed in',
    ]},
    { t: 'p', v: 'Both are **strictly necessary to provide a service you explicitly requested**, which is exempt under PECR — hence no consent banner. You can clear them from your browser settings at any time.' },

    { t: 'h', v: '9. Security' },
    { t: 'p', v: 'The database enforces row-level security: **each account can only read and write its own row**, enforced in the database rather than trusted to front-end code. The unauthenticated role has zero privileges on the data table. All traffic is over HTTPS.' },
    { t: 'p', v: 'The policy configuration is public — read and verify it yourself in `supabase/schema.sql` in the repository.' },

    { t: 'h', v: '10. Changes' },
    { t: 'p', v: 'Material changes update the date at the top of this page. Significant changes to how data is handled will also be flagged in the app.' },
  ],
};
