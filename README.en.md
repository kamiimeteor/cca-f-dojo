<div align="center">

# cca-f-dojo

**An interactive practice app for the Claude Certified Architect – Foundations (CCA-F / CCAR-F) exam**

Practice · missed-question queue · official-spec mock exam · jump straight to the note — static, offline, bilingual

[中文](README.md) · **English**

[![Try it live](https://img.shields.io/badge/▶_Try_it_live-kamiimeteor.github.io-c8553d?style=for-the-badge)](https://kamiimeteor.github.io/cca-f-dojo/)

[![License](https://img.shields.io/badge/License-MIT-3f7d58)](LICENSE)
![Questions](https://img.shields.io/badge/questions-163-6b5b95)
![Notes](https://img.shields.io/badge/note_sections-37-2e7d7b)
![Coverage](https://img.shields.io/badge/task_statements-30_of_30-4a6fa5)
![Dependencies](https://img.shields.io/badge/dependencies-0-a1662f)

</div>

---

## Why this one

There are 190+ CCA-F repos on GitHub, but they cluster into two groups with a gap in the middle:

| | Chinese | Interactive practice | Official-spec mock | Question → note link |
| --- | :---: | :---: | :---: | :---: |
| [cca-f-complete-guide-cn](https://github.com/cyrus-tt/cca-f-complete-guide-cn) (10★) | ✅ | ❌ | ❌ | ❌ |
| [cca-f-study-zh](https://github.com/tigerbojo/cca-f-study-zh) | ✅ trad. | ❌ | ❌ | ❌ |
| [cca-f-exam-console](https://github.com/Jeffd789/cca-f-exam-console) | ❌ | ✅ | ✅ | ❌ |
| [cca-f-exam-prep](https://github.com/abiodedeyi/cca-f-exam-prep) | ❌ | ✅ skill | ❌ | ❌ |
| **cca-f-dojo (this project)** | ✅ | ✅ | ✅ | ✅ |

**The Chinese ones are reading material; the ones you can actually practise on are English-only.**
This project sits in that intersection — and the English side is complete, not an afterthought.

Three things you will not find elsewhere:

**① Every question links back to the exact note section it tests**
Other projects map questions to one of five domains at best. Here all 163 questions are bound to a
specific section out of 37. Get one wrong and you immediately see "this tests 1.5 Agent SDK Hooks"
with a link straight to it — no hunting.

**② Calibrated line-by-line against the official Exam Guide, with the discrepancies published**
The Chinese cram handbook this was built from got **two things wrong**, both corrected here and
documented below: it claimed the exam is all single-answer (it is not — there are multiple-response
items), and it counted 29 task statements (there are 30 — it **omitted Task Statement 5.4 entirely**).
Traceable accuracy matters more than another fifty questions.

**③ A "commit before you look" drill**
Grinding a question bank quietly trains you to *recognise* the answer — obvious once you see the
choices, blank without them. This mode shows the stem only, makes you write down your reasoning
first, then reveals the options, and afterwards puts what you wrote next to the explanation.
Not seen elsewhere. It and "judgement of degree" are **optional**, tucked into their own block on
the practice page, and never interfere with normal practice.

---

## ⚠️ Disclaimer

**Not affiliated with or endorsed by Anthropic.** Claude, Anthropic and CCA-F / CCAR-F are
trademarks of Anthropic PBC. This is a community study tool.

All 163 questions are **original**, written from the blueprint published in the official Exam Guide.
They are **not real exam items, recalled items, or leaked content**. Practice scores are estimates
only — the real exam uses equated scaled scoring; this app approximates it linearly.

---

## Run it

Online: **<https://kamiimeteor.github.io/cca-f-dojo/>**

Locally (fully offline):

```bash
git clone https://github.com/kamiimeteor/cca-f-dojo.git
cd cca-f-dojo && python3 -m http.server 4321
```

Then open <http://localhost:4321>. No dependencies, no build step, no Node.

## Features

| Module | What it does |
| --- | --- |
| **Study notes** | 33 sections covering all 30 official task statements, plus 4 cheat-sheet appendices. Searchable sidebar (tables and decision trees included). Mark sections read; each links to its own questions. `＋` marks newly emphasised official content. |
| **Practice** | Instant feedback: explanation on answering, a "why this is wrong" note on each distractor, and a link back to the note section. Filter by domain, section, unseen, weak spots, or bookmarks. |
| **Missed queue** | Wrong answers are queued automatically and grouped by domain. **Clears after 2 correct in a row** — so you cannot pass by memorising one attempt. |
| **Mock exam** | Locked to official spec, not configurable: 60 items / 120 minutes, weighted 27/18/20/20/15, 4 scenarios drawn from 6. No feedback until you submit; scored out of 1000 with a **720 pass mark**, plus per-domain breakdown and item-by-item review. |
| **Advanced drills (optional)** | A separate block on the practice page that **never affects the normal path**. "Commit before you look" makes you reason before seeing options; "judgement of degree" leaves only the answer and its closest distractor. Skip them freely. |
| **Bilingual** | One dropdown in the header. Interface, all 37 note sections and all 163 questions (stems, options, explanations, distractor notes) exist in both languages. The real exam is in English, so English mode doubles as terminology practice. |

## Sources

Every exam-spec figure comes from **Anthropic's official Exam Guide**, whose PDF is publicly
downloadable from the [Anthropic Academy certification page](https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification).

> This repository does **not** ship that PDF or its text, nor the third-party Chinese handbook used
> while writing the notes — neither is ours to redistribute. Please get the guide from the official
> link above.

| Item | Official value |
| --- | --- |
| Exam code | CCAR-F |
| Number of items | 60 |
| Time limit | 120 minutes |
| Item format | **Multiple-choice and multiple-response**; each item states how many to select |
| Structure | 4 scenarios drawn from a bank of 6 |
| Passing score | 720 (scaled 100–1000) |
| Fee / validity | $125 USD / 12 months |
| Task statements | **30** across 5 domains |

**Still this project's own choices** (no official basis):

- The 163 questions themselves — **not real exam items**
- The "2 correct in a row" graduation threshold for the missed queue
- Linear score conversion (`correct / total × 1000`); the real exam is non-linear scaled scoring
- The English content is written by this project; the official Exam Guide always wins

## Question bank

163 scenario-based items, single- and multiple-response, distributed to match the official weights:

| Domain | Weight | Task statements | Note sections | Questions |
| --- | --- | --- | --- | --- |
| D1 Agentic Architecture & Orchestration | 27% | 7 | 7 | 39 |
| D2 Tool Design & MCP Integration | 18% | 5 | 6 | 28 |
| D3 Claude Code Configuration & Workflows | 20% | 6 | 8 | 33 |
| D4 Prompt Engineering & Structured Output | 20% | 6 | 6 | 33 |
| D5 Context Management & Reliability | 15% | 6 | 6 | 30 |
| **Total** | **100%** | **30** | **33** | **163** |

"Task statements" is the official count (30); "note sections" is how the notes are numbered (33) —
the difference is that the notes split a few statements into their own entries.
Six items are multiple-response, matching the official format.

## Data and privacy

Progress lives in **your own browser's** `localStorage` (key `ccae.v2`).
**No network calls, no upload, no tracking, no cookies.** The footer lets you
**export / import / reset** — use the exported JSON to move between devices or browsers.

Imports go through `sanitizeState()`: unknown fields are dropped, question and section ids are
allow-listed, and every number is coerced, so a hand-edited JSON file cannot inject anything.

## Layout

```
index.html                    shell
assets/styles.css             styles (incl. dark mode)
assets/app.js                 router + practice/exam/missed/drill engines + persistence
assets/data/notes.js          structured notes (EXAM_META / NOTES / SECTION_INDEX)
assets/data/questions.js      question bank (SCENARIOS / QUESTIONS)
assets/data/i18n.js           UI strings, zh/en
assets/data/content.en.js     English content layer: domains + 37 note sections
assets/data/content.en.q1.js  English questions, D1+D2
assets/data/content.en.q2.js  English questions, D3+D4+D5
source/                       reference material (gitignored, not redistributed)
```

## Adding questions

Append to the `QUESTIONS` array in `assets/data/questions.js`:

```js
{ id:'q164', d:'d1', s:'1.1', sc:'cs', diff:2,
  q:'Stem…',
  o:['Option A','Option B','Option C','Option D'],
  a:1,                                       // index of the correct option
  e:'Explanation…',
  w:{ 0:'why A is wrong', 2:'why C is wrong' } }   // optional; the degree drill relies on this
```

Multiple-response: add `multi: true`, make `a` an array, and **state the count in the stem**
— the official wording is *"each item states how many responses to select"*. Scoring is exact-match.

```js
{ id:'q165', d:'d1', s:'1.1', sc:'gen', diff:2, multi:true,
  q:'Which of these are anti-patterns? (Select 2)', o:[...], a:[0,2], e:'…' }
```

`s` must be an existing id in `SECTION_INDEX`. `sc` is one of:
`cs` support / `cc` code generation / `ma` multi-agent / `dt` developer tooling /
`ci` CI-CD / `se` structured extraction / `gen` general.

## How the bilingual layer works

UI strings go through `t('key')` from `i18n.js`. Notes and questions go through `secView()` /
`qView()`: they look the id up in `CONTENT_EN` and, **if it is missing, fall back to Chinese and
show a dashed tag in the UI**. Translations can therefore be filled in incrementally — one missing
entry never breaks the page.

To add English for a new question, add the same id in `content.en.q2.js`:

```js
q164:{q:'…', o:['…','…','…','…'], e:'…', w:{0:'…'}}
```

Notes work the same way under `sections` in `content.en.js`. **The blocks array must line up
one-to-one with the Chinese side** — rendering merges `v` / `title` / `head` / `rows` by index.

## Known limitation

The "judgement of degree" drill currently picks its foil at random from **any distractor that has a
written explanation**, and those vary in how close they actually are — some genuinely require
weighing up (prompt tuning vs a hook), others are obviously wrong. Making the drill live up to its
name needs a per-question tag marking the genuinely near-miss option (a `near` field), which is a
manual judgement pass.

## Contributing

Issues pointing out wrong answers or anything that contradicts the official Exam Guide are very
welcome — accuracy is what this project cares about most. PRs adding questions or translations are
welcome too; see "Adding questions" and "How the bilingual layer works" above.

## License

[MIT](LICENSE)
