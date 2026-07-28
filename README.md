# CCA-F 备考道场 · cca-f-dojo

> 面向中文考生的 **Claude Certified Architect – Foundations（CCA-F / CCAR-F）** 交互式练习站。
> 刷题 · 错题集 · 官方规格模考 · 笔记直跳 —— 纯静态，离线可用，中英双语。
>
> *A bilingual (中文 / EN) practice app for Anthropic's Claude Certified Architect – Foundations.
> Practice, a missed-question queue, an official-spec mock exam, and notes you can jump straight into.
> Zero dependencies, works offline.*

**[▶ 在线试用 / Try it live](https://kamiimeteor.github.io/cca-f-dojo/)**

---

### ⚠️ 免责声明 · Disclaimer

本项目**与 Anthropic 无任何隶属或背书关系**。Claude、Anthropic、CCA-F / CCAR-F
均为 Anthropic PBC 的商标。这是一个社区自制的学习工具。

站内 163 道题目**全部为自编**，依据官方 Exam Guide 公布的考点蓝图撰写，
**不是官方真题，也不是任何形式的真题回忆或泄露**。模考分数只是估算 —— 官方采用
等值换算计分（scaled scoring），本站用线性折算近似，仅供判断掌握程度。

*Not affiliated with or endorsed by Anthropic. Claude, Anthropic and CCA-F / CCAR-F are
trademarks of Anthropic PBC. This is a community study tool. All 163 questions are original,
written from the blueprint published in the official Exam Guide — they are **not** real exam
items, recalled items, or leaked content. Practice scores are estimates only.*

---

## 这是什么

自建的离线备考网站，把个人备考笔记按官方的
**5 个 Domain / 30 个 Task Statement** 全量结构化，并补齐了原笔记漏掉的部分。

> 起因：公司还没接入官方 Claude Certified Architect 认证，先把知识点吃透，
> 等企业开通官方考试时可以直接上考场。

## 启动

```bash
python3 -m http.server 4321
```

然后打开 <http://localhost:4321>。

（也可以直接双击 `index.html`，但部分浏览器对 `file://` 的限制会影响体验，建议用上面的方式。）

## 四个功能

| 模块 | 说明 |
| --- | --- |
| **复习笔记** | 33 节正文（覆盖官方 30 个 Task Statement）+ 4 节速查附录，左侧 TOC 可全文搜索（含表格、决策树内容）。可标记「已读完」，每节底部直通该节练习题。标 `＋` 的是笔记里注明「官方新增」的考点。 |
| **刷题** | 即时反馈：选完立刻出解析 + 每个错误选项「为什么错」+ 一键跳回对应笔记小节。可按 Domain / 按小节 / 只做没做过的 / 薄弱题优先 / 收藏 来筛。 |
| **错题集** | 答错自动收录，按 Domain 分组。**连续答对 2 次自动毕业**，避免只是背下了某一次的答案。 |
| **模拟考试** | 规格**锁定为官方值、不可自定义**：60 题 / 120 分钟，按权重（27/18/20/20/15）抽题，6 个场景随机抽 4 个。全程无反馈、带倒计时，交卷后换算 1000 分制，**720 及格**，给出各 Domain 得分和逐题回顾。 |
| **进阶训练（可选）** | 刷题页底部单独一块，**不影响常规刷题路径**。「先答后看」先只给题干，逼你写下判断依据、猜考点，写完才展开选项；「程度判断」只留正确项和一个强干扰项二选一。默认路径的人可以完全无视。 |
| **中英双语** | 顶栏右侧一键切换。界面、37 节笔记、163 道题（含题干/选项/解析/错误项说明）全部双语。真考是英文，用英文模式练可以顺带熟悉官方术语。语言偏好随进度一起保存。 |

## 数据来源

考试规格**全部来自 Anthropic 官方 Exam Guide**，原始 PDF 公开可下载：
[Anthropic Academy 认证页](https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification)。

> 本仓库**不附带**该 PDF 及其全文，也不附带撰写笔记时参考的第三方中文手册 ——
> 两者版权都不属于本项目。请自行从上面的官方链接获取。

| 项 | 官方值 |
| --- | --- |
| 考试代码 | CCAR-F |
| 题数 | 60 |
| 时长 | 120 分钟 |
| 题型 | **单选 + 多选混合**，每题写明要选几项 |
| 结构 | 6 个场景抽 4 个 |
| 及格线 | 720（换算分 100–1000）|
| 费用 / 有效期 | $125 USD / 12 个月 |
| Task Statement | **30 条**（5 个 Domain）|

**仍属本站自设**（无官方依据）：

- 163 道题本身 —— 依笔记与官方 Exam Guide 自编，**不是官方真题**
- 错题「连对 2 次毕业」的阈值
- 模考的换算分用 `正确数 / 总数 × 1000` 线性折算；官方是 scaled scoring，非线性，本站只能近似
- 英文版内容为本站撰写，一切以官方 Exam Guide 原文为准

> ⚠️ 那份 27 页中文突击手册有两处与官方不符，站内已按官方修正：
> 1. 手册称「全是单选」→ 官方含 multiple-response 多选题
> 2. 手册称 29 个 Task Statement → 官方 30 条，且**整节漏掉了 Task Statement 5.4**
>    （大型代码库探索的上下文管理：scratchpad、`/compact`、上下文退化、崩溃恢复 manifest）

## 题库

163 题，场景式单选 + 多选，分布与考试权重一致：

「权重」= 官方考试出题比例，模考按它抽题。「Task Statement」是官方考点数（合计 30），
「小节」是笔记的实际编号数（合计 33）—— 差额来自笔记作者把部分考点拆成了独立编号。

| Domain | 权重 | Task Statement | 小节 | 题数 |
| --- | --- | --- | --- | --- |
| D1 Agentic Architecture & Orchestration | 27% | 7 | 7 | 39 |
| D2 Tool Design & MCP Integration | 18% | 5 | 6 | 28 |
| D3 Claude Code Configuration & Workflows | 20% | 6 | 8 | 33 |
| D4 Prompt Engineering & Structured Output | 20% | 6 | 6 | 33 |
| D5 Context Management & Reliability | 15% | 6 | 6 | 30 |
| **合计** | **100%** | **30** | **33** | **163** |

其中 6 道为多选题（`multi: true`），对齐官方 multiple-response 题型。

每题都带 `s` 字段指向笔记小节，所以任何一道题都能一键跳回原文复习。

## 数据

进度全部存在浏览器 `localStorage`（key: `ccae.v2`），不联网、不上传。
页脚可以**导出 / 导入 / 清空**进度 —— 换设备或换浏览器时用导出的 JSON 迁移。

导入时会走 `sanitizeState()`：只保留已知字段、题目 id 与小节 id 一律走白名单，
所有数值强制 `Number`，防止手改过的 JSON 注入内容到页面。

## 文件结构

```
index.html                  页面骨架
assets/styles.css           样式（含深色模式）
assets/app.js               路由 + 刷题/考试/错题引擎 + 存档
assets/data/notes.js        笔记结构化数据（EXAM_META / NOTES / SECTION_INDEX）
assets/data/questions.js    题库（SCENARIOS / QUESTIONS）
assets/data/i18n.js         界面文案 zh/en（I18N / SCENARIOS_EN / EXAM_META_EN）
assets/data/content.en.js   英文内容层：domains + 37 节笔记
assets/data/content.en.q1.js  英文题库 D1+D2
assets/data/content.en.q2.js  英文题库 D3+D4+D5
source/                     参考底本（已 gitignore，不随仓库分发）
```

## 扩题

在 `assets/data/questions.js` 的 `QUESTIONS` 数组里追加即可：

```js
{ id:'q151', d:'d1', s:'1.1', sc:'cs', diff:2,
  q:'题干…',
  o:['选项A','选项B','选项C','选项D'],
  a:1,                       // 正确项下标；多选题写成数组 a:[0,2] 并加 multi:true
  e:'解析…',
  w:{ 0:'A 为什么错', 2:'C 为什么错' } }   // 可选
}
```

多选题额外要求：`multi: true`、`a` 为索引数组，且**题干必须写明「（选择 N 项）」**
—— 官方原文 "each item states how many responses to select"。判分为完全匹配，少选或多选均算错。

```js
{ id:'q164', d:'d1', s:'1.1', sc:'gen', diff:2, multi:true,
  q:'以下哪些是反模式？（选择 2 项）', o:[...], a:[0,2], e:'…' }
```

`s` 必须是 `SECTION_INDEX` 里已有的小节号，`sc` 必须是 `SCENARIOS` 的键
（`cs` 客服 / `cc` 代码生成 / `ma` 多 Agent / `dt` 开发者工具 / `ci` CI-CD / `se` 结构化提取 / `gen` 通用）。

## 双语机制

界面文案走 `t('key')`，取自 `i18n.js`。笔记与题目走 `secView()` / `qView()`：
按 id 到 `CONTENT_EN` 找英文，**找不到就回退中文并在界面打一个虚线标签**，
所以补翻译可以增量做，不会因为漏一条就整页崩。

新增题目时若要支持英文，在 `content.en.q2.js` 里按同 id 补一条：

```js
q164:{q:'…', o:['…','…','…','…'], e:'…', w:{0:'…'}}
```

笔记同理，在 `content.en.js` 的 `sections` 下按 id 补，**blocks 数组顺序必须与中文侧一一对应**
（渲染时按下标合并 `v` / `title` / `head` / `rows`）。校验脚本会检查数量是否对齐。

## 定位

面向**中文考生**的 CCA-F 交互式练习站。GitHub 上同类仓库 190+，中文的有两个
（[cca-f-complete-guide-cn](https://github.com/cyrus-tt/cca-f-complete-guide-cn)、
[cca-f-study-zh](https://github.com/tigerbojo/cca-f-study-zh)），但**都是 Markdown/HTML 备考读物**
—— 没有刷题引擎、错题集，也没有按官方规格的模考。

本站的位置是这三者的交集：**中文 · 可交互 · 对着官方 Exam Guide 逐条校准**。

英文侧保持全量对齐（真考是英文，练英文可顺带熟悉官方术语），但**中文是第一语言**。

### 和同类项目的差异

考试模拟做得最完整的是 [Jeffd789/cca-f-exam-console](https://github.com/Jeffd789/cca-f-exam-console)，
它的场景分组模拟、按场景诊断、干扰项套路简报都比本站强；
[abiodedeyi/cca-f-exam-prep](https://github.com/abiodedeyi/cca-f-exam-prep) 则有间隔重复和 19 类干扰项库
（形态是 Claude Code skill，不是网站）。本站不在这两条线上比拼，差异在：

1. **中文 + 可交互** —— 中文那两个是读物，交互式的那些不支持中文
2. **题 ↔ 笔记细粒度绑定** —— 每题跳回它考的那一节，而不是只回到 Domain 概述
3. **官方校准可追溯** —— 逐条对照官方 Exam Guide 公布的考点蓝图校准，
   并明确记录了原始笔记与官方不符的两处（详见「数据来源」）

### 已知局限

「程度判断」目前从**任意带解析的错误项**里随机挑对手，而这些错误项的"接近程度"参差不齐 ——
有些确实是需要权衡的近似项（prompt 优化 vs 上 hook），有些一眼就错。
要真正练"程度"，需要给每题标注哪个是**真正的近似项**（可加 `near` 字段），这是一次人工判断的活。
