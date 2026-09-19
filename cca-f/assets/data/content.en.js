/* 英文内容层：按 id 覆盖 notes.js / questions.js 的中文原文
 * 缺失的 id 自动回退到中文（界面会标注），所以可以增量补全。
 * 结构必须与中文侧一一对应：blocks 顺序、table 的行列数都要一致。
 */
const CONTENT_EN = {
  domains: {
    d1: { zh: 'Agentic architecture & orchestration', blurb: 'Heaviest domain — you need all of it' },
    d2: { zh: 'Tool design & MCP integration' },
    d3: { zh: 'Claude Code configuration & workflows' },
    d4: { zh: 'Prompt engineering & structured output' },
    d5: { zh: 'Context management & reliability' },
    ref: { title: 'Decision trees & cheat sheets', zh: 'Read this in the last 10 minutes',
           blurb: 'Not weighted on the exam, but covers every high-frequency judgement call' },
  },

  sections: {
    /* ─────────── DOMAIN 1 ─────────── */
    '1.1': { title: 'The agentic loop', blocks: [
      { v: '**What the agentic loop is**: let Claude keep working on its own until the task is done.' },
      { v: '**The `stop_reason` field**: a structured signal in the API response, made specifically for loop control.' },
      { v: ['`"tool_use"` → Claude wants a tool → keep looping', '`"end_turn"` → Claude is finished → exit the loop'] },
      { v: `You send a request to Claude
    ↓
Claude returns a response
    ↓
Check stop_reason
    ↓
"tool_use"?  → run the tool → feed the result back → keep looping
"end_turn"?  → task complete → reply to the user` },
      { title: 'The three anti-patterns (exam favourite — spot them and eliminate)', v: [
        '❌ Do not parse natural language to decide the loop is over (e.g. looking for "Is there anything else?")',
        '❌ Do not use a max-iteration cap as the primary stopping mechanism',
        '❌ Do not inspect assistant text content as a completion signal',
      ]},
      { v: '`stop_reason` is the only correct loop-control signal.' },
    ]},

    '1.2': { title: 'Coordinator–subagent pattern', blocks: [
      { v: '**Hub-and-spoke**: the coordinator is the hub and owns all subagent communication, error handling and information routing. **Subagents never talk to each other directly.**' },
      { v: '**Coordinator responsibilities**: decompose → delegate → aggregate results → decide what happens next.' },
      { title: 'Three rules that matter', v: [
        'The coordinator must **partition the research space explicitly**, giving each subagent a **non-overlapping** scope (by subtopic or by source type).',
        'The coordinator should **select subagents dynamically** rather than always running the full pipeline.',
        'The coordinator can run an **iterative refinement loop**: evaluate the synthesis → find gaps → re-delegate to fill them → repeat until coverage is sufficient.',
      ]},
      { v: '**Subagent context must be passed explicitly** — it is not inherited from the parent.' },
    ]},

    '1.3': { title: 'Subagent invocation, context passing and parallel spawning', tag: 'Newly emphasised', blocks: [
      { v: '**The Task tool**: the Agent SDK mechanism for spawning subagents.' },
      { v: [
        "The coordinator's `allowedTools` **must include `\"Task\"`** for it to spawn subagents",
        'Subagents **do not inherit parent context** and **do not share memory across invocations**',
      ]},
      { v: '**AgentDefinition**: configures each subagent type — `description`, system prompt, tool restrictions.' },
      { v: '**Parallel spawning**: the coordinator emits **multiple Task calls in a single response**. Do not spread them across separate turns.' },
      { title: 'Context-passing best practice', v: [
        "Put the prior agents' **complete findings** directly into the subagent prompt (e.g. search results + document analysis → synthesis agent)",
        'Use a **structured format that separates content from metadata** (source URL, document name, page number) to preserve attribution',
        'Coordinator prompts should state **research goals and quality criteria**, not step-by-step procedure — that lets subagents adapt',
      ]},
      { v: '**`fork_session`**: branch off a shared analysis baseline to explore divergent approaches (e.g. comparing two testing strategies).' },
      { v: 'Task tool spawns subagents | `allowedTools` must contain `Task` | many Tasks in one turn = parallel.' },
    ]},

    '1.4': { title: 'Multi-step workflows, enforcement and handoff', blocks: [
      { v: '**Prompt vs programmatic enforcement — the core judgement call:**' },
      { head: ['Consequence', 'Approach', 'Reliability'], rows: [
        ['Inconsistent formatting, variable answer quality', 'Prompt tuning', 'Probabilistic (good enough)'],
        ['Wrong refund, wrong customer, security hole', '**Programmatic hard limit**', '**Deterministic (required)**'],
      ]},
      { v: 'A prompt is *advice*; code is *law*.' },
      { v: '**Programmatic prerequisite example**: `process_refund` is blocked until `get_customer` has returned a verified customer ID — without verification the refund simply cannot be called.' },
      { v: '**Multi-issue requests**: one message raising several problems → split into separate items → investigate in parallel over shared context → synthesise one unified reply.' },
      { title: 'Structured handoff summary (when escalating to a human)', v: 'Include customer ID, root cause, refund amount, recommended action — so the human never has to read the whole transcript.' },
    ]},

    '1.5': { title: 'Agent SDK hooks (deterministic interception)', blocks: [
      { v: 'A **hook** is code that runs automatically when a specific event fires. It is **deterministic and outside Claude\'s control**.' },
      { head: ['Hook type', 'Fires', 'Purpose', 'Example'], rows: [
        ['`PreToolUse`', '**before** the tool runs', 'permission checks, argument validation, blocking risky actions', 'refund > $500 → block → route to a human'],
        ['`PostToolUse`', '**after** the tool runs', 'result transformation, format normalisation', 'Unix timestamp → human-readable ISO 8601'],
      ]},
      { title: 'Hook vs tool (exam favourite)', v: [
        '**Hook** = fires automatically (deterministic; Claude never even sees it)',
        '**Tool** = Claude chooses to call it (probabilistic; it may pick wrong or forget)',
      ]},
      { title: 'When to reach for a hook instead of a prompt', v: [
        'A business rule that must hold **100% of the time** → hook',
        'Formatting preference or style → a prompt is enough',
      ]},
      { v: 'Hook = automatic + certain | Tool = chosen + probabilistic | Money and safety → hook, always.' },
    ]},

    '1.6': { title: 'Task decomposition strategies', blocks: [
      { head: ['Pattern', 'Fits', 'Example'], rows: [
        ['**Prompt chaining** (fixed pipeline)', 'predictable multi-step reviews', 'per-file analysis → cross-file integration'],
        ['**Dynamic decomposition**', 'open-ended investigation', 'map the structure → find hot spots → generate subtasks on the fly'],
      ]},
      { title: 'Multi-pass review (high-frequency)', v: [
        'A large PR in a single pass → **attention dilution** → split into a per-file local pass plus a cross-file integration pass',
        'The local pass finds local bugs; the integration pass finds cross-file data-flow problems',
      ]},
      { v: '**Adaptive investigation plans**: map the structure first, identify high-impact areas, then produce a prioritised plan that adapts as dependencies surface.' },
    ]},

    '1.7': { title: 'Session state, resumption and forking', blocks: [
      { head: ['Mechanism', 'Purpose', 'When'], rows: [
        ['`--resume <session-name>`', 'resume a named session', 'continuing an investigation across work sessions'],
        ['`fork_session`', 'branch from a shared baseline', 'comparing two refactoring approaches'],
        ['New session + injected summary', 'fresh start, but with context', 'the old tool results have gone stale'],
      ]},
      { title: 'How to choose', v: [
        'Prior context is **mostly still valid** → `--resume`',
        'Prior tool results are **stale** (the code changed) → **new session + a structured summary** is more reliable',
        'Files changed since you resumed → tell the agent **exactly which files**, and do a targeted re-analysis rather than starting over',
      ]},
    ]},

    /* ─────────── DOMAIN 2 ─────────── */
    '2.1': { title: 'Tool descriptions drive tool selection', blocks: [
      { title: 'A good tool description states', v: [
        'what the tool **does**',
        'what **input format** it takes',
        '**when to use it** (example queries)',
        "**when not to use it** (its boundary against similar tools)",
      ]},
      { v: '**Overlapping names or descriptions confuse the model**: e.g. `analyze_content` vs `analyze_document` → rename to remove the overlap (e.g. `extract_web_results`).' },
      { v: '**Split over-general tools**: one `analyze_document` doing too much → split into `extract_data_points` + `summarize_content` + `verify_claim_against_source`.' },
      { v: '**The system prompt influences tool selection**: keyword-sensitive instructions can steer the agent to the wrong tool. If the descriptions look fine but selection is **systematically biased**, inspect the system prompt.' },
    ]},

    '2.2': { title: 'Tool design principles', blocks: [
      { v: '**Eliminate invalid states**: a tool taking many parameter combinations, most of them invalid → split it. Example: `log_workout` (23% invalid combinations) → `log_cardio_workout` + `log_strength_workout`.' },
      { v: '**Race conditions**: a time window between two steps → **merge into one atomic operation**. Example: check availability + book → `find_and_book_appointment`.' },
      { v: '**Uniform return schema**: sources return different shapes → **normalise inside the tool** and return one schema.' },
      { v: '**Least privilege**: an over-broad tool invites misuse → replace it with a narrower one. Example: `fetch_url` (can reach anything) → `load_document` (documents only).' },
      { v: '**Cap the tool count**: 18 tools degrades selection reliability → cut back to **4–5** role-relevant tools.' },
    ]},

    '2.3': { title: 'Structured MCP error responses', tag: 'High-frequency', blocks: [
      { v: 'Tool errors must be **categorised** — never return a flat "Operation failed":' },
      { head: ['Field', 'Purpose', 'Example'], rows: [
        ['`isError`', 'tells the agent the call failed', '`true`'],
        ['`errorCategory`', 'type of failure', '`transient` / `validation` / `business` / `permission`'],
        ['`isRetryable`', 'whether retrying makes sense', '`true` (timeout) / `false` (business-rule violation)'],
        ['human-readable description', 'what to show the user', '"Refund exceeds policy limit"'],
      ]},
      { title: 'The distinctions that get tested', v: [
        '`isRetryable: false` + business-rule violation → the agent must **not** retry; tell the user instead',
        '**"0 results" (query succeeded, nothing matched) ≠ "timeout" (query never completed)** — different meanings, different coordinator decisions',
      ]},
    ]},

    '2.4': { title: 'tool_choice configuration', blocks: [
      { head: ['Value', 'Behaviour', 'Use when'], rows: [
        ['`"auto"`', 'Claude decides whether to call a tool (it may not)', 'ordinary conversation'],
        ['`"any"`', '**must** call some tool, but picks which', 'you need a tool call guaranteed (several schemas, unknown type)'],
        ['`{"type":"tool","name":"xxx"}`', '**forces one specific tool**', 'you need deterministic output (extract first, then process)'],
      ]},
      { v: '**Scoped tools**: a subagent that constantly needs simple fact checks → give it a narrow `verify_fact` tool (handles ~85% of simple lookups itself); complex verification still routes through the coordinator.' },
    ]},

    '2.5': { title: 'MCP (Model Context Protocol)', blocks: [
      { v: '**The point of MCP is a standard interface — build once, reuse everywhere.** Write one MCP server and every MCP-compatible AI app can connect to it.' },
      { title: 'What MCP does NOT give you', v: ['automatic retries', 'automatic auth or rate limiting', 'a faster protocol'] },
      { head: ['MCP config file', 'Scope'], rows: [
        ['Project-level `.mcp.json`', 'shared with the team'],
        ['User-level `~/.claude.json`', 'personal servers'],
      ]},
      { v: '**Secrets**: never hard-code them in config; use `${ENV_VAR}` expansion.' },
      { title: 'MCP resources (newly emphasised)', v: [
        'MCP can expose **content catalogues** (issue summaries, doc hierarchies, database schemas)',
        'This lets the agent **see what data exists** without burning turns on exploratory tool calls',
      ]},
      { v: '**Community vs custom**: use a community MCP server for standard integrations (Jira, etc.); build your own only for team-specific workflows.' },
      { v: '**Write detailed MCP tool descriptions**: thin descriptions make the agent fall back to built-ins like Grep instead of the more capable MCP tool.' },
    ]},

    '2.6': { title: 'Choosing among the built-in tools', tag: 'Newly emphasised', blocks: [
      { head: ['Tool', 'Purpose', 'Typical use'], rows: [
        ['`Grep`', 'search **file contents**', 'find callers of a function, locate an error string, trace imports'],
        ['`Glob`', 'match **file names / paths**', 'find `**/*.test.tsx`'],
        ['`Read`', 'read a whole file', 'understand a file, follow an import chain'],
        ['`Write`', 'create or fully rewrite a file', 'fallback when Edit has no unique anchor'],
        ['`Edit`', 'replace **unique** text in a file', 'small, targeted changes'],
        ['`Bash`', 'run shell commands', 'run tests, install dependencies'],
      ]},
      { v: '**When Edit fails**: the target text is not unique → `Read` the whole file and `Write` it back. Do not keep hammering Edit.' },
      { v: '**Exploration strategy**: `Grep` for entry points → `Read` to follow imports → build understanding incrementally, rather than reading everything up front.' },
      { v: '**Tracing usage**: first collect all exported names, then `Grep` each one for call sites.' },
    ]},

    /* ─────────── DOMAIN 3 ─────────── */
    '3.1': { title: 'CLAUDE.md hierarchy', blocks: [
      { head: ['Level', 'Location', 'Scope'], rows: [
        ['User', '`~/.claude/CLAUDE.md`', 'that user only — **not shared**'],
        ['Project', '`.claude/CLAUDE.md` or root `CLAUDE.md`', 'travels with the repo — **team-wide**'],
        ['Directory', '`CLAUDE.md` in a subdirectory', 'that subtree only'],
      ]},
      { title: 'Diagnostic rule of thumb', v: 'When a rule works "for some people but not others", it is at **the wrong level** — it belongs in the project config but was put in the user config.' },
      { title: '@import syntax (newly emphasised)', v: [
        'Reference external files to keep CLAUDE.md **modular** (e.g. each package pulls in its own standards file)',
        "Example: a sub-package's CLAUDE.md `@import`s the relevant coding-standards file",
      ]},
      { v: '**Splitting a bloated CLAUDE.md**: move topics into `.claude/rules/` files (`testing.md`, `api-conventions.md`, `deployment.md`).' },
      { v: '**`/memory`**: verify which memory files actually loaded — the tool for diagnosing inconsistent behaviour across sessions.' },
    ]},

    '3.2': { title: 'Skill vs path rule vs CLAUDE.md', tag: 'High-frequency', blocks: [
      { head: ['Mechanism', 'Trigger', 'Fits'], rows: [
        ['`.claude/rules/` (path rules)', '**file-path glob match** — automatic, deterministic', 'conventions that vary by file type or location'],
        ['`.claude/skills/` (skills)', '**task-triggered** (invoked manually or chosen by Claude)', 'workflows for a specific task'],
        ['`CLAUDE.md`', '**always loaded**, regardless of file', 'universal rules'],
      ]},
      { v: 'See "automatic" + "by file type or path" → **path rules**.' },
    ]},

    '3.3': { title: 'Path-rule frontmatter', tag: 'Newly detailed', blocks: [
      { v: `---
paths: ["terraform/**/*"]
---
Conventions for editing Terraform files…` },
      { v: [
        'The `paths` field takes **glob patterns** — the rule loads only when a matching file is edited',
        'Less irrelevant context, **fewer tokens**',
      ]},
      { title: 'Path rule or subdirectory CLAUDE.md?', v: [
        'Convention applies to files **scattered across directories** (e.g. every `**/*.test.tsx`) → **path rule**',
        'Convention belongs to **one directory** → **subdirectory CLAUDE.md**',
      ]},
    ]},

    '3.4': { title: 'Frontmatter: rules vs skills', blocks: [
      { v: 'Both rules and skills have frontmatter, but the **fields differ**:' },
      { head: ['Rule frontmatter', 'Skill frontmatter'], rows: [
        ['`paths` (which files), `description`', '`context: fork`, `allowed-tools`, `argument-hint`'],
      ]},
      { head: ['Skill field', 'Purpose', 'Example'], rows: [
        ['`context: fork`', 'run in an **isolated subagent** so output does not pollute the main session', 'code analysis, brainstorming'],
        ['`allowed-tools`', 'restrict which tools the skill may use', 'read-only; no writes or deletes'],
        ['`argument-hint`', 'prompt the user when invoked without arguments', '"Enter the file path to analyse"'],
      ]},
    ]},

    '3.5': { title: 'Commands vs skills, and where config lives', blocks: [
      { head: ['', 'Commands', 'Skills'], rows: [
        ['frontmatter', 'not supported', 'supports `context: fork`, `allowed-tools`, `argument-hint`'],
        ['capability', 'plain text instructions', 'isolated execution, tool restriction, argument prompting'],
      ]},
      { v: 'Skills = commands + superpowers (frontmatter).' },
      { head: ['What you are sharing', 'Project level (team)', 'User level (personal)'], rows: [
        ['Instructions / rules', '`.claude/CLAUDE.md`', '`~/.claude/CLAUDE.md`'],
        ['Skills', '`.claude/skills/`', '`~/.claude/skills/`'],
        ['Commands', '`.claude/commands/`', '`~/.claude/commands/`'],
        ['MCP servers', '`.mcp.json`', '`~/.claude.json`'],
        ['Path rules', '`.claude/rules/`', '—'],
      ]},
      { title: 'The universal rule', v: 'Inside the project directory = shared with the team and version-controlled. Under `~/` = yours alone.' },
      { v: '**Personal skill variants**: create them in `~/.claude/skills/` under a **different name** so the team copy is untouched.' },
    ]},

    '3.6': { title: 'Plan mode vs direct execution', blocks: [
      { head: ['', 'Plan mode', 'Direct execution'], rows: [
        ['Fits', 'large or cross-file architectural change, vague requirements, several viable approaches', 'simple, well-scoped, small changes'],
        ['Example', 'microservice restructuring, a library migration touching 45+ files', 'single-file bug fix, adding one date validation'],
        ['Benefit', 'explore and design before committing, avoiding rework', 'speed'],
      ]},
      { v: '**Explore subagent**: isolate the verbose discovery phase so the main session only receives a compact summary — this is what keeps the context window from blowing up.' },
      { v: '**Combine them**: plan mode for investigation, then direct execution once the approach is settled.' },
    ]},

    '3.7': { title: 'Iterative refinement techniques', tag: 'Newly emphasised', blocks: [
      { head: ['Pattern', 'Fits', 'How'], rows: [
        ['**Concrete I/O examples**', 'prose descriptions get interpreted inconsistently', 'give 2–3 input/output pairs'],
        ['**Test-driven iteration**', 'complex implementations', 'write the tests first → share the failures → converge'],
        ['**Interview pattern**', 'a domain you do not know well', 'have Claude ask questions first (cache invalidation? failure modes?) → then implement'],
      ]},
      { title: 'Batch or one at a time?', v: [
        'Bugs that **interact** → describe them all in one message',
        'Bugs that are **independent** → fix them one at a time',
      ]},
    ]},

    '3.8': { title: 'CI/CD integration', blocks: [
      { head: ['CLI flag', 'Purpose'], rows: [
        ['`-p` / `--print`', 'non-interactive mode — **mandatory in CI**, or the job hangs'],
        ['`--output-format json`', 'machine-parseable output'],
        ['`--json-schema`', 'force output to conform to a given schema'],
      ]},
      { v: `# Standard CI invocation
claude -p "Review this PR" --output-format json \\
  --json-schema '{"type":"object", ...}'` },
      { v: '**CLAUDE.md feeds CI context**: put testing standards, fixture conventions and review criteria there, and CI-invoked Claude picks them up automatically.' },
      { title: 'Session isolation', v: 'A session reviewing the code it just generated suffers **confirmation bias** — use a **separate instance** for review.' },
      { v: '**Avoiding duplicate comments**: when re-running a review, pass in the prior findings and instruct Claude to report only what is **new or still unresolved**.' },
      { v: '**Supply the existing tests**: so Claude knows what is already covered and stops proposing duplicates.' },
    ]},

    /* ─────────── DOMAIN 4 ─────────── */
    '4.1': { title: 'The prompt-improvement ladder', tag: 'Tested repeatedly', blocks: [
      { v: `Rung 1: the prompt is vague (no criteria at all)
    → make the criteria explicit

Rung 2: criteria are clear but applied inconsistently
    → few-shot examples

Rung 3: omissions vary from case to case
    → self-review (evaluator–optimizer pattern)` },
      { title: 'Keyword shortcuts', v: [
        'Question says "no clear criteria" / the prompt is vague → **explicit criteria**',
        'Question says "instructions already added but inconsistent" → **few-shot**',
        'Question says "gaps vary by case" → **self-review**',
      ]},
      { title: 'Managing false positives', v: [
        'High false-positive rate destroying trust → **switch off the noisy categories** first (stop the bleeding), keep the precise ones, re-enable once fixed',
        'Vague instructions like "be conservative" or "only report high-confidence findings" **do not work** — you need concrete categorical criteria',
      ]},
    ]},

    '4.2': { title: 'Designing few-shot examples', blocks: [
      { v: [
        '**Target the failures** — do not teach the model what it already does well',
        '**Show the reasoning** — not just the answer, but why this answer',
        '**Few and precise** — 2–4 sharp examples beat 10–15 vague ones',
      ]},
      { title: 'What few-shot is good for', v: [
        '**Tool selection** in ambiguous cases (show the reasoning)',
        'Telling acceptable patterns apart from genuine issues (**cutting false positives**)',
        'Correct extraction across different document structures (inline citations vs bibliography)',
        'Reducing **hallucination** in extraction (e.g. informal units of measure)',
      ]},
      { title: 'Few-shot is not a cure-all — rule these out first', v: [
        'No baseline criteria → **write the criteria**, not examples',
        'Tool description or name is off → **fix the description / rename**',
        'Money or safety involved → **programmatic enforcement**, not examples',
        'Omissions vary each time → **self-review**',
        'System prompt contains accidental routing cues → **check the prompt**',
      ]},
    ]},

    '4.3': { title: 'Structured output (JSON schema + tool use)', blocks: [
      { v: '**The most reliable approach**: define a tool with a JSON schema and use `tool_use` to force structured output.' },
      { title: 'Tool use removes syntax errors, not semantic ones', v: [
        '✅ Removed: malformed JSON, missing fields',
        '❌ Not removed: line items that do not sum to the total, values in the wrong field',
      ]},
      { head: ['Situation', 'Setting'], rows: [
        ['Several extraction schemas, document type unknown', '`tool_choice: "any"`'],
        ['Metadata must be extracted before anything else runs', '`tool_choice: {"type":"tool","name":"extract_metadata"}`'],
        ['Ordinary conversation', '`tool_choice: "auto"`'],
      ]},
      { title: 'Schema design', v: [
        'Value may be absent from the source → make it **nullable**, not required → prevents fabrication',
        'Sentiment genuinely unclear (sarcasm) → add an `"unclear"` enum value',
        'Category set will grow → `"other"` plus a detail string',
        'Source formatting is inconsistent → put normalisation rules in the prompt',
      ]},
      { v: '**Automatic cross-check**: emit `calculated_total` (sum of line items) alongside `stated_total` (as printed) and flag mismatches for human review.' },
    ]},

    '4.4': { title: 'Validation, retries and feedback loops', blocks: [
      { title: 'Retrying after a validation failure', v: 'A blind retry reproduces the same error. Send the **original document + the failed extraction + the specific validation errors**.' },
      { v: '**The limit of retrying**: if the information is simply **not in the document**, no number of retries will help — recognise when retrying is futile.' },
      { title: 'The detected_pattern field (newly emphasised)', v: [
        'Add a `detected_pattern` field to each structured finding',
        'It records **which code pattern triggered the finding**',
        'When developers dismiss findings, you can then **analyse false-positive patterns systematically**',
      ]},
      { v: '**Self-check flow**: extract `calculated_total` and `stated_total`; on mismatch set `conflict_detected: true`.' },
    ]},

    '4.5': { title: 'Batch API', blocks: [
      { head: ['', 'Synchronous API', 'Batch API'], rows: [
        ['Latency', 'real time', '**up to 24 hours**'],
        ['Cost', 'full price', '**50% discount**'],
        ['Fits', 'blocking workflows (pre-merge checks)', 'non-blocking, latency-tolerant work (overnight analysis)'],
      ]},
      { title: 'Three hard limits', v: [
        'Workflows that cannot wait are out',
        'Workflows needing **multi-turn tool calls** are out (fire-and-forget; no mid-request interaction)',
        '**No latency SLA** — "up to 24h" is a ceiling, not a promise of speed',
      ]},
      { v: '**`custom_id` (newly emphasised)**: every batch request carries one, so responses can be correlated back — and on failure you resubmit only the failed items.' },
      { v: '**Scheduling arithmetic**: documents arrive continuously + a 24h processing window + a 30h end-to-end SLA → submit a batch **every 6 hours**.' },
      { v: '**Large-volume strategy**: refine the prompt on a small sample → submit the full volume via Batch → resubmit failures in follow-up batches.' },
    ]},

    '4.6': { title: 'Multi-instance and multi-pass review', tag: 'Heavily tested', blocks: [
      { title: 'Why self-review is weak', v: 'The same session keeps its generation reasoning in context → **confirmation bias** → it rarely questions its own decisions. **Fix: review with a separate Claude instance** that has none of that context.' },
      { title: 'Multi-pass review', v: [
        'A big PR in one pass → attention dilution and self-contradictory findings',
        'Split into a **per-file local pass** (local defects) and a **cross-file integration pass** (data-flow problems across files)',
      ]},
      { v: '**Self-reported confidence**: have the model attach a confidence score to each finding, enabling calibrated review routing.' },
      { v: '**Keyword-sensitive bias**: descriptions look fine but selection is systematically wrong (a given keyword produces 78% wrong picks) → look for accidental routing instructions in the **system prompt**.' },
    ]},

    /* ─────────── DOMAIN 5 ─────────── */
    '5.1': { title: 'Managing the context window', blocks: [
      { title: 'Lost in the middle', v: 'LLMs attend well to the **start and end** of a long input and **drop things from the middle**. Fix: put the key-findings summary **first**, and add **section headers** to help navigate the middle.' },
      { v: '**Summarisation loses critical detail in long conversations** — summaries are **lossy by nature**. Fix: pull hard facts (amounts, dates, order numbers, policy references) into a persistent **"case facts" block** that is **excluded from summarisation** and injected into every prompt.' },
      { v: '**Upstream output too large**: subagents emit 155K tokens while the downstream agent works best around 50K. Fix: have upstream agents return only **structured essentials** (facts + citations + relevance scores) — **filter at the source**. Do not add an intermediate summarising agent; that treats the symptom.' },
    ]},

    '5.2': { title: 'Escalation decisions', blocks: [
      { title: 'Escalate when', v: [
        '**Policy gap** — no rule covers this, and the agent must not invent one',
        '**Subjective judgement required** — beyond the agent (empathy calls)',
        '**Irreversible, high-risk action** — a human must confirm',
        '**Beyond the agent\'s authority** — e.g. a refund above its limit',
      ]},
      { title: 'Do NOT escalate when', v: [
        'A standard procedure exists (shipping disputes have a process)',
        'The customer raised several issues at once (the agent can handle multiple issues)',
        'You suspect the customer might change their mind (speculation is not a reason)',
      ]},
      { v: '**Disambiguating multiple matches**: when a tool returns several matches, **do not guess** — ask the user for another identifier (email, phone, order number).' },
      { v: 'Escalation = a **human judgement** is needed (no rule exists). Programmatic enforcement = a rule exists and must hold **100%** (refund caps, identity verification).' },
    ]},

    '5.3': { title: 'Graceful degradation and partial failure', blocks: [
      { title: 'The distinction that gets tested', v: [
        '**"0 results"** — the query succeeded and nothing matched → a **meaningful empty result**',
        '**"timeout"** — the query never completed → a **failure**, and you must decide about retrying',
      ]},
      { title: 'Never do this', v: 'Silently skipping and not reporting it. Hiding the error means the final output has a hole nobody knows about.' },
      { title: 'Do this instead', v: [
        'Some sources failed → **carry on synthesising with what you have**',
        '**Annotate coverage explicitly** in the output: which areas are well supported, which have gaps, which sources failed',
        'Conflicting data → **keep both values and flag the conflict** → let the coordinator decide; do not pick one yourself',
      ]},
    ]},

    '5.4': { title: 'Context management in large-codebase exploration',
      tag: 'Missing from the notes · restored from the official guide', blocks: [
      { title: 'This section was absent from the original handbook', v: [
        'Official Task Statement 5.4 exists in full, but that 27-page Chinese cram sheet **skipped it entirely**',
        'What follows is written from the blueprint published in the official Exam Guide, and is examinable',
      ]},
      { title: 'Context degradation', v: 'In long sessions the model starts giving **inconsistent answers** and citing "typical patterns" instead of the specific classes and functions it actually discovered earlier. That is dilution, not the model getting worse.' },
      { head: ['Technique', 'Solves', 'How'], rows: [
        ['**Scratchpad files**', 'keeping key findings across context boundaries', 'the agent writes findings to a scratch file and reads them back on later questions, countering degradation'],
        ['**Subagent delegation**', 'isolating verbose exploration output', 'the main agent stays high-level; specific questions ("find all test files", "trace refund-flow dependencies") go to subagents'],
        ['**`/compact`**', 'compressing context mid-session', 'use when exploration has filled the window with verbose discovery output'],
        ['**Phase summaries**', 'carrying state between phases', 'summarise the previous phase before spawning the next set of subagents, and inject it into their initial context'],
        ['**State manifests**', 'crash recovery', 'each agent exports state to a known location; the coordinator loads the manifest on resume and injects it into agent prompts'],
      ]},
      { v: 'Long session answering badly → suspect context degradation first: scratchpad for the essentials, subagents for the noise, `/compact` for the bulk, manifests for crashes.' },
    ]},

    '5.5': { title: 'Self-review and quality assurance', blocks: [
      { title: 'The evaluator–optimizer pattern', v: [
        'Draft the reply',
        'Self-check against a checklist (policy? timeline? next steps? did it answer the question?)',
        'Fill any gaps found',
        'Emit the final reply',
      ]},
      { v: '**When it fits**: omissions that vary from case to case.' },
      { title: 'Field-level confidence scores', v: [
        'Have the model emit a confidence score per extracted field',
        'Low confidence → prioritise for human review',
        'High confidence can still be wrong → **stratified random sampling** across every confidence band',
      ]},
      { v: 'Review the low-confidence first; still sample the high-confidence.' },
    ]},

    '5.6': { title: 'Inter-agent information flow, provenance and conflicting sources',
      tag: 'Official 5.6 · completed from the Exam Guide', blocks: [
      { v: '**The problem**: subagents emit too much and downstream synthesis quality drops. **Principle: filter at the source rather than summarising afterwards.**' },
      { head: ['Approach', 'Effect'], rows: [
        ['✅ Have upstream agents return only structured essentials', 'reduces volume at the source'],
        ['❌ Insert an intermediate summarising agent', 'another processing layer; treats the symptom'],
      ]},
      { title: 'Structured handoff: separate content from metadata', v: [
        '**Content**: facts, findings, quotations',
        '**Metadata**: source URL, document name, page number, relevance score',
      ]},
      { title: 'Provenance loss (official addition)', v: 'Summarisation steps **flatten claim-source mappings** — the conclusions survive but "which document said this" does not. Require subagents to emit **structured claim-source mappings** (source URL, document name, relevant excerpt), and require downstream synthesis to **preserve and merge** them rather than compressing them away.' },
      { title: 'Handling conflicting sources (tested)', v: [
        'Credible sources give **conflicting statistics** → **annotate the conflict and keep source attribution**; do not arbitrarily pick one',
        'Deliver document analysis **with the conflicting values included** and explicitly flagged, and let the coordinator reconcile before synthesis',
        'Structure the report into **well-established** versus **contested** findings, preserving each source\'s own characterisation and methodological context',
      ]},
      { title: 'Time (newly emphasised)', v: 'Require publication / collection **dates** in structured output, so data from different periods is not misread as contradictory.' },
      { v: '**Render by content type**: financial data as tables, news as prose, technical findings as structured lists — do not flatten everything into one format.' },
      { v: 'Flag conflicts, do not adjudicate | pass citations through, do not flatten | every figure carries its date.' },
    ]},

    /* ─────────── APPENDIX ─────────── */
    'R.1': { title: 'Decision-tree quick reference', blocks: [
      { title: '"Output is inconsistent" — what do I pick?', v:
`→ Does the prompt state clear criteria?
  → No → make the criteria explicit
  → Yes, but applied unevenly → does the question say "instructions added but still inconsistent"?
    → Yes → few-shot examples
    → Are the omissions different every time? → self-review (evaluator–optimizer)` },
      { title: '"It picked the wrong tool" — what do I pick?', v:
`→ Are the tool names/descriptions clear and non-overlapping?
  → Unclear / overlapping → fix the description, rename
  → Clear, but a specific keyword biases selection → check the system prompt
  → Clear, but it misfires on ambiguous cases → few-shot (ambiguous cases + show the reasoning)` },
      { title: '"Should this escalate to a human?"', v:
`→ Does a policy or rule cover this situation?
  → No (policy gap) → escalate
  → Yes, a standard procedure exists → do not escalate; the agent handles it
→ Does it involve money or safety?
  → Yes → programmatic enforcement (a hard limit, not an escalation)` },
      { title: '"Is a prompt enough, or do I need enforcement?"', v:
`→ How bad is the failure?
  → Formatting / style / efficiency → prompt tuning is enough
  → Money / safety / identity verification → programmatic hard limit (hook or prerequisite)` },
      { title: '"Which configuration mechanism?"', v:
`→ Does the rule always apply?
  → Yes → CLAUDE.md
  → Only for certain file types or paths → path rules (.claude/rules/)
  → Only during a certain task → skills (.claude/skills/)
→ Who needs it?
  → The whole team → project level (.claude/)
  → Just me → user level (~/)` },
      { title: '"Too much output / context is blowing up"', v:
`→ Is a subagent emitting too much?
  → Yes → filter at the source (structured essentials only)
→ Is a skill too verbose?
  → Yes → context: fork to isolate it
→ Is code exploration too noisy?
  → Yes → Explore subagent
→ Is a long conversation losing key facts?
  → Yes → persist a case-facts block` },
    ]},

    'R.2': { title: 'Fix priority — the universal framework', blocks: [
      { v: [
        'Tune the **prompt** first (state criteria, give examples) — simplest, fastest, cheapest',
        'Then adjust **tools and workflow** (fix descriptions, split tools, restructure)',
        'Only then reach for **architecture or infrastructure** (extra models, ML classifiers, programmatic enforcement)',
      ]},
      { title: 'Exception', v: ['Money, safety or compliance → go straight to programmatic enforcement'] },
    ]},

    'R.3': { title: 'Easily confused pairs', blocks: [
      { head: ['A', 'B', 'Difference'], rows: [
        ['Hook', 'Tool', 'automatic and deterministic vs chosen by Claude and probabilistic'],
        ['`isRetryable: true`', '`isRetryable: false`', 'timeout is retryable; a business-rule violation is not'],
        ['"0 results"', '"timeout"', 'query succeeded with no matches vs query never completed'],
        ['Plan mode', 'Direct execution', 'complex / vague / cross-file vs simple / clear / single-file'],
        ['`tool_choice:"any"`', '`tool_choice:"auto"`', 'must call a tool vs may not call one'],
        ['Path rules', 'Subdirectory CLAUDE.md', 'by file type across directories vs everything in one directory'],
        ['Skills', 'Commands', 'frontmatter superpowers vs plain text'],
        ['`context: fork`', 'Explore subagent', 'a reusable isolated skill vs ad-hoc exploration'],
        ['Escalation', 'Programmatic enforcement', 'a human judgement is needed vs a rule must hold 100%'],
        ['Sync API', 'Batch API', 'real-time and blocking vs up to 24h at half price'],
        ['Few-shot', 'JSON schema', 'teaching Claude how vs validating that it did'],
        ['Explicit criteria', 'Few-shot', 'no criteria yet vs criteria exist but are applied unevenly'],
        ['`--resume`', 'New session + summary', 'context mostly valid vs prior results stale'],
      ]},
    ]},

    'R.4': { title: 'Glossary', blocks: [
      { head: ['Term', 'Meaning'], rows: [
        ['Agentic loop', 'Claude works autonomously (call tool → read result → call again…) until `stop_reason: "end_turn"`'],
        ['`stop_reason`', 'the API loop-control signal: `"tool_use"` continue / `"end_turn"` stop'],
        ['Hub-and-spoke', 'coordinator-centred topology; subagents never talk to each other directly'],
        ['Task tool', 'the Agent SDK mechanism for spawning subagents'],
        ['AgentDefinition', 'a subagent\'s configuration (description, system prompt, tool restrictions)'],
        ['`fork_session`', 'branch an independent exploration from a shared baseline'],
        ['Inline', 'shown in place, with no extra action needed to reveal it'],
        ['Atomic operation', 'completes in one step, uninterruptible — avoids race conditions'],
        ['Confirmation bias', 'favouring your own prior judgement; generating and reviewing in one session causes it'],
        ['Graceful degradation', 'keep working with what you have when parts fail, while flagging the gaps'],
        ['Least privilege', 'give the agent only the tools and permissions its job requires'],
        ['Prompt chaining', 'a fixed, ordered multi-step pipeline'],
        ['Dynamic decomposition', 'generating subtasks from what you discover along the way'],
        ['MCP resources', 'content catalogues exposed over MCP so the agent knows what data exists'],
        ['`custom_id`', 'the Batch API identifier correlating requests with responses'],
        ['`detected_pattern`', 'a field recording which code pattern triggered a finding'],
        ['`@import`', 'CLAUDE.md syntax for pulling in an external file'],
      ]},
    ]},
  },

  /* questions 由 content.en.questions.js 合并进来 */
  questions: {},
};
