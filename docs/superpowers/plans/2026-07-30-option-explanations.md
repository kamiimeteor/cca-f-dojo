# Wrong-Answer Option Explanations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a complete bilingual A–D option-explanation table after every incorrect answer across all 168 questions, while preserving the existing main explanation.

**Architecture:** Keep `e` as the canonical overall/correct-answer explanation and `w` as the canonical per-wrong-option explanation. Build a normalized `optionExplanations` array in `qView()` from those sources, so every rendered question has one explanation per option without duplicating 168 complete arrays in source. Fill every current Chinese and English `w` gap, then render the normalized array only when `revealAnswer()` marks an answer incorrect.

**Tech Stack:** Static HTML, vanilla JavaScript, CSS, Node.js assertion scripts.

---

### Task 1: Add failing data and rendering tests

**Files:**
- Create: `scripts/test-option-explanations.js`
- Modify: `scripts/check-i18n.js`

- [ ] **Step 1: Add a data coverage test**

Load `questions.js`, `content.en.q1.js`, and `content.en.q2.js` in `vm` contexts. For each language and each question, assert that `e` is non-empty and every non-answer index has a non-empty `w[index]`. Assert 168 IDs in both languages and include the question ID and option letter in every failure message.

- [ ] **Step 2: Add source-level rendering assertions**

Assert that `assets/app.js` contains a normalized option-explanation builder, gates the table behind `!correct`, uses `esc()`/`md()` at the appropriate boundaries, and includes status classes for correct and selected-wrong rows. Assert that `assets/styles.css` contains desktop table and small-screen stacked rules.

- [ ] **Step 3: Run the test and verify failure**

Run: `node scripts/test-option-explanations.js`

Expected: FAIL on `q004` Chinese wrong option A before implementation.

### Task 2: Complete bilingual option-level content

**Files:**
- Modify: `assets/data/questions.js`
- Modify: `assets/data/content.en.q1.js`
- Modify: `assets/data/content.en.q2.js`

- [ ] **Step 1: Fill the 39 Chinese empty `w` maps**

Add explanations for every wrong option in:

`q004`, `q012`, `q017`, `q018`, `q023`, `q027`, `q030`, `q040`, `q051`, `q056`, `q062`, `q063`, `q067`, `q070`, `q074`, `q076`, `q081`, `q083`, `q085`, `q102`, `q103`, `q104`, `q105`, `q106`, `q108`, `q119`, `q127`, `q128`, `q132`, `q134`, `q138`, `q141`, `q142`, `q143`, `q144`, `q145`, `q146`, `q149`, `q150`.

Each explanation must identify what the option actually represents and the decisive reason it does not answer this question. For `q012`, use:

```js
w: {
  0: 'Bash 用于执行 shell 命令，例如安装依赖或查看 Git 状态；它不能生成或委派子 agent。',
  2: 'Read 用于读取已知路径的文件内容；它不负责创建 agent。',
  3: 'Grep 用于按内容模式搜索文件和代码；它只能查找内容，不能生成子 agent。',
}
```

- [ ] **Step 2: Fill the corresponding English `w` maps**

Add semantically equivalent, idiomatic English explanations for the same 39 IDs plus `q057`, whose Chinese `w` already exists. For `q012`, use:

```js
w: {
  0: 'Bash runs shell commands such as installing dependencies or checking Git status; it cannot spawn or delegate a subagent.',
  2: 'Read retrieves the contents of a file at a known path; it does not create agents.',
  3: 'Grep searches files and code by content pattern; it can locate text but cannot spawn a subagent.',
}
```

- [ ] **Step 3: Run the data test**

Run: `node scripts/test-option-explanations.js`

Expected: data coverage passes; rendering assertions still fail.

### Task 3: Render the wrong-answer comparison table

**Files:**
- Modify: `assets/app.js`
- Modify: `assets/data/i18n.js`
- Modify: `assets/styles.css`

- [ ] **Step 1: Normalize option explanations in `qView()`**

Add a helper that returns `q.o.map((_, i) => answerSet.has(i) ? q.e : q.w?.[i] || '')`, and attach that array as `optionExplanations` after the Chinese or English question view has been assembled. This preserves language isolation and handles single- and multiple-response questions.

- [ ] **Step 2: Add bilingual interface labels**

Add aligned Chinese/English i18n keys for “逐项解析 / Option by option”, “正确答案 / Correct answer”, and “你的选择 / Your choice”.

- [ ] **Step 3: Add safe table markup**

In `revealAnswer()`, preserve the existing verdict heading and `<p>${md(q.e)}</p>`. When `correct === false`, append a semantic table with one row per option. Render option letters and status labels with `esc()`, option/explanation content with `md()`, mark all answer indexes as correct, and mark selected non-answer indexes as selected-wrong. Place the table before the existing note/next-action row.

- [ ] **Step 4: Add responsive styling**

Use a two-column table on desktop. At the existing mobile breakpoint, make each row stack its option/status header above the explanation, with natural wrapping and no horizontal scrolling. Use `--ok`/`--ok-bg` for correct rows, `--bad`/`--bad-bg` for selected-wrong rows, and neutral colors for all others.

- [ ] **Step 5: Run focused tests**

Run:

```bash
node scripts/test-option-explanations.js
node scripts/check-i18n.js
node scripts/test-progress-colors.js
node scripts/test-practice-resume.js
```

Expected: all commands exit 0.

### Task 4: Browser verification, independent review, and release

**Files:**
- Modify: `index.html`
- Review: all changed files

- [ ] **Step 1: Bump cache versions**

Increment query versions for every changed CSS, data, and app asset in `index.html` so signal0.net does not serve stale files.

- [ ] **Step 2: Verify in a browser**

Check `q012` after an incorrect `Grep` selection in Chinese and English, plus one multiple-response question. Verify correct answers do not show the table, wrong answers do, labels and colors match state, and a narrow viewport stacks rows without horizontal scrolling.

- [ ] **Step 3: Dispatch independent subagent review and validation**

Ask one subagent to review correctness, regression risk, escaping, language isolation, and data coverage. Ask a second subagent to independently run tests and browser validation. Fix all confirmed findings and rerun the full suite.

- [ ] **Step 4: Commit and push**

Stage only feature-related files, commit with `feat: add bilingual option explanations`, and push the current branch to GitHub. Confirm the remote commit and report whether production deployment updates automatically.
