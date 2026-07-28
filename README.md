<div align="center">

# CCA-F 备考道场 · cca-f-dojo

**面向中文考生的 Claude Certified Architect – Foundations（CCA-F / CCAR-F）交互式练习站**

刷题 · 错题集 · 官方规格模考 · 笔记直跳 —— 纯静态，离线可用，中英双语

**中文** · [English](README.en.md)

[![在线试用](https://img.shields.io/badge/▶_在线试用-signal0.net-c8553d?style=for-the-badge)](https://signal0.net)

[![License](https://img.shields.io/badge/License-MIT-3f7d58)](LICENSE)
![题库](https://img.shields.io/badge/题库-163_题-6b5b95)
![笔记](https://img.shields.io/badge/笔记-37_节-2e7d7b)
![Task Statement](https://img.shields.io/badge/官方考点-30_条全覆盖-4a6fa5)
![依赖](https://img.shields.io/badge/依赖-0-a1662f)

</div>

---

## 为什么是这个

GitHub 上 CCA-F 相关仓库有 190+，但它们基本落在两类里，中间是空的：

- **中文的那些是「读物」** —— Markdown 或静态 HTML 的备考指南，读完就没了。
  不能刷题、没有错题追踪、没有按官方规格计时的模考。
- **能真正练的那些只有英文** —— 中文考生得一边啃英文题干，一边学本来就不熟的考点。

| | 中文读物类 | 英文练习类 | **cca-f-dojo** |
| --- | :---: | :---: | :---: |
| 中文 | ✅ | ❌ | ✅ |
| 交互式刷题 | ❌ | ✅ | ✅ |
| 错题追踪 | ❌ | 部分 | ✅ |
| 官方规格模考 | ❌ | 部分 | ✅ |
| 题 ↔ 笔记跳转 | ❌ | ❌ | ✅ |

**本项目要占的就是这个交集**，而且英文侧是全量对齐的，不是应付。

除此之外还有三点是别处没有的：

**① 每道题都能一键跳回它考的那一节**
别的项目最多把题归到 5 个 Domain 之一；这里 163 道题各自绑定到 37 节笔记中具体的一节，
答错立刻能看到「这题考的是 1.5 Agent SDK Hooks」并直接跳过去，不用自己翻。

**② 对着官方 Exam Guide 逐条校准，并把出入公开记录下来**
参考的那份中文突击手册有**两处与官方不符**，本项目已按官方修正并写在下面「数据来源」里：
手册说「全是单选」（官方有多选题）、手册说 29 个 Task Statement（官方 30 条，
且**整节漏掉了 Task Statement 5.4**）。备考材料的准确性可追溯，比多几十道题重要。

**③ 「先答后看」训练模式**
题库刷久了会练出「认得出答案」的错觉 —— 一看选项就会，自己想就懵。
这个模式先只给题干，逼你写下判断依据再展开选项，作答后把你写的那句话摆在解析旁边对照。
它和「程度判断」都是**可选的**，放在刷题页单独一块，不影响常规路径。

---

## ⚠️ 免责声明

本项目**与 Anthropic 无任何隶属或背书关系**。Claude、Anthropic、CCA-F / CCAR-F
均为 Anthropic PBC 的商标。这是一个社区自制的学习工具。

站内 163 道题**全部为自编**，依据官方 Exam Guide 公布的考点蓝图撰写，
**不是官方真题，也不是任何形式的真题回忆或泄露**。模考分数只是估算 —— 官方采用
等值换算计分（scaled scoring），本站用线性折算近似，仅供判断掌握程度。

---

## 启动

在线直接用：**<https://signal0.net>**

想本地跑（完全离线）：

```bash
git clone https://github.com/kamiimeteor/cca-f-dojo.git
cd cca-f-dojo && python3 -m http.server 4321
```

然后打开 <http://localhost:4321>。零依赖、不需要构建、不需要 Node。

## 功能

| 模块 | 说明 |
| --- | --- |
| **复习笔记** | 33 节正文（覆盖官方 30 个 Task Statement）+ 4 节速查附录，左侧 TOC 可全文搜索（含表格、决策树内容）。可标记「已读完」，每节底部直通该节练习题。标 `＋` 的是官方新增考点。 |
| **刷题** | 即时反馈：选完立刻出解析 + 每个错误选项「为什么错」+ 一键跳回对应笔记小节。可按 Domain / 按小节 / 只做没做过的 / 薄弱题优先 / 收藏 来筛。 |
| **错题集** | 答错自动收录，按 Domain 分组。**连续答对 2 次自动毕业**，避免只是背下了某一次的答案。 |
| **模拟考试** | 规格**锁定为官方值、不可自定义**：60 题 / 120 分钟，按权重（27/18/20/20/15）抽题，6 个场景随机抽 4 个。全程无反馈、带倒计时，交卷后换算 1000 分制，**720 及格**，给出各 Domain 得分和逐题回顾。 |
| **进阶训练（可选）** | 刷题页单独一块，**不影响常规刷题路径**。「先答后看」逼你先写判断依据再看选项；「程度判断」只留正确项和一个强干扰项二选一。不需要的话完全可以跳过。 |
| **中英双语** | 顶栏下拉一键切换。界面、37 节笔记、163 道题（含题干/选项/解析/错误项说明）全部双语。真考是英文，用英文模式练可顺带熟悉官方术语。 |

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

> ⚠️ 参考的那份 27 页中文突击手册有两处与官方不符，站内已按官方修正：
> 1. 手册称「全是单选」→ 官方含 multiple-response 多选题
> 2. 手册称 29 个 Task Statement → 官方 30 条，且**整节漏掉了 Task Statement 5.4**
>    （大型代码库探索的上下文管理：scratchpad、`/compact`、上下文退化、崩溃恢复 manifest）

**仍属本站自设**（无官方依据）：

- 163 道题本身 —— **不是官方真题**
- 错题「连对 2 次毕业」的阈值
- 模考换算分用 `正确数 / 总数 × 1000` 线性折算；官方是 scaled scoring，非线性，只能近似
- 英文版内容为本站撰写，一切以官方 Exam Guide 原文为准

## 题库

163 题，场景式单选 + 多选，分布与考试权重一致：

| Domain | 权重 | Task Statement | 小节 | 题数 |
| --- | --- | --- | --- | --- |
| D1 Agentic Architecture & Orchestration | 27% | 7 | 7 | 39 |
| D2 Tool Design & MCP Integration | 18% | 5 | 6 | 28 |
| D3 Claude Code Configuration & Workflows | 20% | 6 | 8 | 33 |
| D4 Prompt Engineering & Structured Output | 20% | 6 | 6 | 33 |
| D5 Context Management & Reliability | 15% | 6 | 6 | 30 |
| **合计** | **100%** | **30** | **33** | **163** |

「Task Statement」是官方考点数（30），「小节」是笔记实际编号数（33）——
差额来自笔记把部分考点拆成了独立编号。其中 6 道为多选题，对齐官方 multiple-response 题型。

## 数据与隐私

进度全部存在**你自己浏览器**的 `localStorage`（key: `ccae.v2`），**不联网、不上传、无追踪、无 cookie**。

页脚的「管理进度」提供：

- **导出** —— 下载文件或一键复制到剪贴板；文件名自带日期和进度摘要
  （`cca-f-dojo-progress-2026-07-28-76q-75pct.json`），一眼认出哪份是新的
- **导入** —— 拖拽文件、选择文件，或直接粘贴 JSON 文本
- **导入前对比** —— 先列出「文件 / 当前 / 合并后」三列，再让你选：
  - **合并**（推荐）：做题次数取较大值、错题取并集、模考按时间去重 —— 两台设备的进度都不丢
  - **替换**：丢弃当前，完全采用文件内容

导入一律走 `sanitizeState()`：只保留已知字段、题目 id 与小节 id 走白名单、
所有数值强制 `Number`，防止手改过的 JSON 注入内容到页面。

## 文件结构

```
index.html                    页面骨架
assets/styles.css             样式（含深色模式）
assets/app.js                 路由 + 刷题/考试/错题/进阶训练引擎 + 存档
assets/data/notes.js          笔记结构化数据（EXAM_META / NOTES / SECTION_INDEX）
assets/data/questions.js      题库（SCENARIOS / QUESTIONS）
assets/data/i18n.js           界面文案 zh/en
assets/data/content.en.js     英文内容层：domains + 37 节笔记
assets/data/content.en.q1.js  英文题库 D1+D2
assets/data/content.en.q2.js  英文题库 D3+D4+D5
source/                       参考底本（已 gitignore，不随仓库分发）
```

## 扩题

在 `assets/data/questions.js` 的 `QUESTIONS` 数组里追加：

```js
{ id:'q164', d:'d1', s:'1.1', sc:'cs', diff:2,
  q:'题干…',
  o:['选项A','选项B','选项C','选项D'],
  a:1,                                    // 正确项下标
  e:'解析…',
  w:{ 0:'A 为什么错', 2:'C 为什么错' } }    // 可选，「程度判断」模式依赖它
```

多选题：加 `multi: true`、`a` 写成索引数组，且**题干必须写明「（选择 N 项）」**
—— 官方原文 *"each item states how many responses to select"*。判分为完全匹配。

```js
{ id:'q165', d:'d1', s:'1.1', sc:'gen', diff:2, multi:true,
  q:'以下哪些是反模式？（选择 2 项）', o:[...], a:[0,2], e:'…' }
```

`s` 必须是 `SECTION_INDEX` 里已有的小节号；`sc` 取值：
`cs` 客服 / `cc` 代码生成 / `ma` 多 Agent / `dt` 开发者工具 / `ci` CI-CD / `se` 结构化提取 / `gen` 通用。

## 双语机制

界面文案走 `t('key')`，取自 `i18n.js`。笔记与题目走 `secView()` / `qView()`：
按 id 到 `CONTENT_EN` 找英文，**找不到就回退中文并在界面打一个虚线标签**，
所以补翻译可以增量做，不会因为漏一条就整页崩。

新增题目补英文，在 `content.en.q2.js` 里按同 id 加一条：

```js
q164:{q:'…', o:['…','…','…','…'], e:'…', w:{0:'…'}}
```

笔记同理，在 `content.en.js` 的 `sections` 下按 id 补，
**blocks 数组顺序必须与中文侧一一对应**（渲染时按下标合并 `v` / `title` / `head` / `rows`）。

## 已知局限

「程度判断」目前从**任意带解析的错误项**里随机挑对手，而这些干扰项的接近程度参差不齐 ——
有些确实需要权衡（prompt 优化 vs 上 hook），有些一眼就错。
要真正练「程度」，需要给每题标注哪个是**真正的近似项**（加 `near` 字段），这是一次人工判断的活。

## 贡献

欢迎提 issue 指出题目错误或与官方不符之处 —— 准确性是这个项目最在意的东西。
补题、补翻译的 PR 也欢迎，格式见上面「扩题」和「双语机制」。

## License

[MIT](LICENSE)
