/* 英文题库 第 2 批：Domain 3 + Domain 4 + Domain 5 */
Object.assign(CONTENT_EN.questions, {

/* ═══ DOMAIN 3 ═══ */
q066:{q:'The team rule "every API change must update the OpenAPI spec" is only honoured by about half the team\'s Claude sessions. Most likely cause?',
o:['The rule is not written clearly enough','It lives in user-level ~/.claude/CLAUDE.md, so only people who configured it get it — it belongs at project level, shared via the repo','Claude versions differ across the team','It needs to be a skill to take effect'],
e:'Classic diagnosis: "works for some people, not others" means the rule is at the wrong level — project-level content placed at user level.',
w:{0:'Poor wording would make everyone inconsistent, not half.',2:'That would not produce a clean half-and-half split.',3:'An always-applicable rule belongs in CLAUDE.md.'}},

q067:{q:'Which CLAUDE.md location travels with the repository and is shared with the team?',
o:['~/.claude/CLAUDE.md','.claude/CLAUDE.md or the root CLAUDE.md','~/.claude.json','/etc/claude/CLAUDE.md'],
e:'Project level = .claude/CLAUDE.md or root CLAUDE.md, version-controlled and team-wide.',w:{}},

q068:{q:'In a monorepo, each package has its own coding-standards file and you want the root CLAUDE.md to stay modular instead of copying everything in. What do you use?',
o:['@import syntax to reference external files','MCP resources','The paths field of a path rule','A skill\'s argument-hint'],
e:'@import references external files to keep CLAUDE.md modular — each package pulls in its own standards.',
w:{1:'That exposes data catalogues.',2:'paths is a trigger condition, not a reference mechanism.',3:'Unrelated to references.'}},

q069:{q:'A project CLAUDE.md has grown to 800 lines covering testing standards, API conventions, deployment and more. Best reorganisation?',
o:['Delete half the content','Split it into topic files under .claude/rules/ (testing.md, api-conventions.md, deployment.md)','Move it all to ~/.claude/CLAUDE.md','Convert it into commands'],
e:'An oversized CLAUDE.md should be split into topic-specific files under .claude/rules/.',
w:{0:'You lose the standards.',2:'It becomes personal config and stops being shared.',3:'Commands are plain-text instructions, not a rule-loading mechanism.'}},

q070:{q:'Claude behaves inconsistently across sessions and you suspect a memory-file loading problem. Which command diagnoses it?',
o:['/doctor','/memory','/config','/hooks'],
e:'/memory shows which memory files loaded — the tool for diagnosing inconsistent cross-session behaviour.',w:{}},

q071:{q:'The team wants an IaC security standard to load automatically whenever Claude edits anything under terraform/, and not otherwise. Which mechanism?',
o:['CLAUDE.md','A path rule under .claude/rules/ with a paths glob','A skill under .claude/skills/','A command under .claude/commands/'],
e:'"Automatic" plus "by file type or path" means path rules: glob-matched, deterministic triggering.',
w:{0:'CLAUDE.md always loads regardless of file, wasting tokens.',2:'Skills are task-triggered, not path-triggered.',3:'Commands must be invoked manually.'}},

q072:{q:'A team has a pre-release checklist workflow needed only when preparing a release. Which mechanism?',
o:['CLAUDE.md','Path rules','A skill (.claude/skills/)','.mcp.json'],
e:'Skills are task-triggered (invoked manually or chosen by Claude) and suit task-specific workflows.',
w:{0:'Always loading wastes context.',1:'Not triggered by file path.',3:'MCP server config; unrelated.'}},

q073:{q:'The rule "all code comments must be in English" applies to every file and every task. Where does it belong?',
o:['CLAUDE.md','Path rules','A skill','A command'],
e:'CLAUDE.md always loads and does not discriminate by file — right for universal rules.',
w:{1:'Unmatched files would be missed.',2:'Task triggering does not guarantee loading.',3:'Requires manual invocation.'}},

q074:{q:'Which set of trigger descriptions is entirely correct?',
o:['CLAUDE.md task-triggered / path rules always loaded / skills path-matched','CLAUDE.md always loaded / path rules glob-matched on file path (automatic, deterministic) / skills task-triggered','CLAUDE.md path-matched / path rules task-triggered / skills always loaded','All three always load; they differ only in content'],
e:'CLAUDE.md always loads; path rules fire deterministically on glob match; skills are task-triggered.',w:{}},

q075:{q:'What is the core advantage of path rules over CLAUDE.md?',
o:['They support richer Markdown syntax','They load only when a matching file is edited, cutting irrelevant context and saving tokens','They have higher priority and override CLAUDE.md','They can call tools'],
e:'paths uses globs so the rule loads only for matching files — less irrelevant context, fewer tokens.',
w:{0:'Syntax capability is the same.',2:'Not a priority mechanism.',3:'Rules are text, not executable capability.'}},

q076:{q:'Which frontmatter field in a path rule specifies which files it governs?',
o:['files','paths','glob','match'],
e:'Rule frontmatter fields are paths (a glob pattern) and description.',w:{}},

q077:{q:'A testing convention must apply to every **/*.test.tsx file, scattered across more than twenty directories. Path rule or subdirectory CLAUDE.md?',
o:['Subdirectory CLAUDE.md, one copy in each directory','A path rule, because the convention spans directories and is keyed on file type','The root CLAUDE.md','A skill, invoked manually when writing tests'],
e:'A convention applying to files scattered across directories (every **/*.test.tsx) calls for a path rule; a convention belonging to one directory calls for a subdirectory CLAUDE.md.',
w:{0:'Twenty copies are unmaintainable and will drift.',2:'Loads for every file, wasting context.',3:'Manual invocation is unreliable.'}},

q078:{q:'A convention applies only to files inside services/billing/, which is fairly self-contained. Best mechanism?',
o:['A path rule','A CLAUDE.md inside that subdirectory','The root CLAUDE.md','A command'],
e:'A convention belonging to one directory belongs in that subdirectory\'s CLAUDE.md.',
w:{0:'Workable but a detour for the single-directory case.',2:'Loads globally.',3:'Requires manual invocation.'}},

q079:{q:'A code-analysis skill produces very verbose output that fills the main session\'s context. What do you add to its frontmatter?',
o:['allowed-tools: [Read]','context: fork','argument-hint: "file path"','paths: ["**/*.ts"]'],
e:'context: fork runs the skill in an isolated subagent so its output does not pollute the main session — exactly for code analysis and brainstorming.',
w:{0:'Restricting tools does not reduce output volume.',2:'That only prompts for an argument.',3:'paths is a rule field; skills do not have it.'}},

q080:{q:'A skill should perform read-only analysis and must never write or delete files. What do you configure?',
o:['context: fork','allowed-tools, restricting the skill to read operations','argument-hint','paths'],
e:'allowed-tools restricts which tools a skill may use — e.g. reads only, no writes or deletes.',
w:{0:'That isolates context, not capability.',2:'Only an argument prompt.',3:'Only rules have paths.'}},

q081:{q:'Which field set belongs to a **rule**\'s frontmatter rather than a skill\'s?',
o:['context: fork, allowed-tools, argument-hint','paths, description','name, version, author','model, temperature, max_tokens'],
e:'Rule frontmatter: paths (which files) and description. Skill frontmatter: context: fork, allowed-tools, argument-hint.',w:{}},

q082:{q:'What is the core difference between commands and skills?',
o:['Commands are project-only, skills are user-only','Commands do not support frontmatter (plain text); skills support context: fork, allowed-tools and argument-hint','Commands are faster, skills are slower','Commands are chosen automatically by Claude, skills must be invoked manually'],
e:'Skills = commands + superpowers: isolated execution, tool restriction and argument prompting via frontmatter.',
w:{0:'Both exist at project and user level.',2:'Performance is not the distinction.',3:'Inaccurate / reversed.'}},

q083:{q:'A team wants to share a set of skills with everyone. Where do they go?',
o:['~/.claude/skills/','.claude/skills/','~/.claude.json','.claude/rules/'],
e:'The universal rule: inside the project directory (.claude/) means shared and version-controlled; under ~/ means personal.',w:{}},

q084:{q:'You want a personal variant of a team skill without affecting anyone else. Best approach?',
o:['Edit the team version in .claude/skills/','Create your variant under ~/.claude/skills/ with a different name','Shadow it with the same filename in .claude/skills/','Delete the team skill and replace it with yours'],
e:'Personal skill variants go in ~/.claude/skills/ under a different name, leaving the team copy untouched.',
w:{0:'Pollutes team config and lands in version control.',2:'Same name still sits at project level and affects everyone.',3:'Breaks the team workflow.'}},

q085:{q:'Which of these location mappings is WRONG?',
o:['Skills: project .claude/skills/ ; user ~/.claude/skills/','MCP servers: project .mcp.json ; user ~/.claude.json','Path rules: project .claude/rules/ ; user ~/.claude/rules/','Commands: project .claude/commands/ ; user ~/.claude/commands/'],
e:'Path rules exist only at project level (.claude/rules/); the user-level column is "—". The other three are correct.',w:{}},

q086:{q:'You are splitting a monolith into microservices, touching 45+ files, with several viable designs. Which mode?',
o:['Direct execution, adjusting as you go','Plan mode — explore and design before making changes','Batch API submission','fork_session'],
e:'Plan mode fits large or cross-file architectural change, vague requirements and multiple approaches: design first, avoid rework.',
w:{0:'Diving in on a large vague change causes heavy rework.',2:'Unrelated to execution mode.',3:'A branching technique, not a mode choice.'}},

q087:{q:'You are adding one date-format validation to a form: a single file, clear requirement. Which mode?',
o:['Plan mode, producing a design first','Direct execution','An Explore subagent to investigate first','Split it into a multi-pass review'],
e:'Direct execution suits simple, clear, small-scope changes. Plan mode here is over-engineering.',
w:{0:'Adds pointless turns.',2:'No investigation needed.',3:'Not a review task.'}},

q088:{q:'During exploration Claude must read dozens of files, producing very verbose output, and the main session\'s context is nearly full. Best approach?',
o:['Switch to a model with a larger context window','Use an Explore subagent to isolate the exploration output so the main session receives only a compact summary','Manually delete part of the history','Move the exploration to the Batch API'],
e:'The Explore subagent isolates verbose discovery so the main session gets a summary — this is what prevents context exhaustion.',
w:{0:'Treats the symptom and costs more.',2:'Easy to delete something important.',3:'Batch does not support interactive multi-turn exploration.'}},

q089:{q:'You described the output format you want in prose, but Claude interprets it slightly differently every time. Most effective technique?',
o:['Give 2–3 concrete input/output pairs','Have Claude ask you questions first, then implement','Write tests first and have it iterate','Switch to plan mode'],
e:'Concrete I/O examples are for exactly this: prose descriptions producing inconsistent interpretations — give 2–3 pairs.',
w:{1:'The interview pattern is for domains you do not know well.',2:'Test-driven iteration suits complex implementations.',3:'Mode choice does not resolve ambiguity.'}},

q090:{q:'You are implementing complex distributed-locking logic and want Claude to converge on a correct implementation. Best iteration mode?',
o:['Give a few I/O examples','Test-driven iteration: write the tests first, share the failures, converge','The interview pattern','Try variants in bulk via the Batch API'],
e:'Test-driven iteration suits complex implementations: tests first, share failures, converge step by step.',
w:{0:'Complex logic is hard to cover with a few I/O pairs.',2:'That is for domains you do not know well.',3:'No interactive iteration.'}},

q091:{q:'You are designing in an area you do not know well (cache coherency) and are unsure what to even consider. Best pattern?',
o:['Have Claude implement it and fix problems later','The interview pattern: let Claude ask questions first (invalidation strategy? failure modes?) then implement','Give I/O examples','Write tests first'],
e:'The interview pattern suits unfamiliar domains: let Claude surface the dimensions you had not considered before implementing.',
w:{0:'You cannot judge whether the result is right.',2:'You do not know the correct output yet.',3:'You do not know what to test.'}},

q092:{q:'A CI pipeline calls claude and the job hangs forever. Which flag is most likely missing?',
o:['--output-format json','-p / --print (non-interactive mode)','--json-schema','--resume'],
e:'-p / --print is non-interactive mode and is mandatory in CI — without it the process hangs.',
w:{0:'Affects output format, not hanging.',2:'Same.',3:'Session resumption, unrelated.'}},

q093:{q:'CI must parse Claude\'s review output as structured data with a fixed field structure. Which flags?',
o:['Just -p','-p plus --output-format json plus --json-schema','-p plus --resume','--output-format json on its own'],
e:'The three flags escalate: -p (non-interactive) → --output-format json (parseable) → --json-schema (conforms to a structure).',
w:{0:'Output would be free text and awkward to parse.',2:'resume is unrelated to structured output.',3:'Without -p the job hangs, and field structure is not guaranteed.'}},

q094:{q:'Claude in CI needs to know the team\'s testing standards, fixture conventions and review criteria. Least-effort approach?',
o:['Concatenate the standards into the prompt on every invocation','Put them in CLAUDE.md so CI-invoked Claude picks them up automatically','Store them as MCP resources','Put them in ~/.claude/CLAUDE.md'],
e:'CLAUDE.md supplies CI context: testing standards, fixture conventions and review criteria are picked up automatically.',
w:{0:'Verbose prompts that drift out of date.',2:'Workable, but CLAUDE.md is the documented approach.',3:'User level usually does not exist on a CI runner and does not travel with the repo.'}},

q095:{q:'In CI, one Claude session generates code and then reviews its own output, and almost never reports problems. Cause and fix?',
o:['The model is not capable enough; use a bigger one','Confirmation bias: the same session retains its generation reasoning and will not question its own decisions — review with an independent Claude instance','The prompt does not say "review strictly" — strengthen the wording','Raise the temperature'],
e:'Session isolation: a session reviewing its own output suffers confirmation bias; review must use an independent instance with no generation context.',
w:{0:'A bigger model does not remove same-session bias.',2:'Wording cannot remove a structural bias.',3:'Unrelated to randomness.'}},

q096:{q:'A PR re-runs the Claude review on every push and the same comment has now been posted five times. Best fix?',
o:['Review only once, when the PR is opened','On re-run, pass in the prior findings and instruct Claude to report only new or still-unresolved issues','Cache the review result and reuse it','Reduce review frequency to once a day'],
e:'To avoid duplicate comments, carry the prior findings into the re-run and instruct Claude to report only what is new or unresolved.',
w:{0:'Later commits then go unreviewed.',2:'A cache cannot reflect new changes.',3:'Delays feedback and still duplicates.'}},

q097:{q:'Claude\'s suggested test cases in CI frequently duplicate existing tests. Best fix?',
o:['Add "do not suggest duplicate tests" to the prompt','Provide the existing test files so Claude knows what is already covered','Turn off test suggestions','Only run test suggestions on new files'],
e:'Supplying the existing tests tells Claude what scenarios are covered, so it stops proposing duplicates.',
w:{0:'Claude has no idea what "existing" means without the files.',2:'Throws away the value.',3:'Coverage gaps in older files get missed.'}},

/* ═══ DOMAIN 4 ═══ */
q098:{q:'A code-review agent\'s prompt says only "find problems in the code", and the severity judgements come out wildly inconsistent. First step?',
o:['Add few-shot examples','Make the criteria explicit: define what counts as critical / major / minor','Add a self-review stage','Switch to a stronger model'],
e:'Rung one: the prompt is vague with no criteria → make the criteria explicit. The keyword "no clear criteria" points here.',
w:{0:'With no criteria, examples only get imitated superficially.',2:'Premature complexity.',3:'Does not supply the missing criteria.'}},

q099:{q:'The prompt already states clear classification criteria, but the model still applies them inconsistently on borderline cases. Next step?',
o:['Make the criteria even longer','Add 2–4 few-shot examples covering the borderline cases and showing the reasoning','Add self-review','Add programmatic enforcement'],
e:'Rung two: criteria are clear but applied inconsistently → few-shot. The keyword is "instructions already added but inconsistent".',
w:{0:'The criteria are already clear; length will not help.',2:'That is rung three, and the omissions here are not varying.',3:'No money or safety involved; over-engineering.'}},

q100:{q:'An agent\'s support replies always leave something out, but **something different every time** (sometimes the timeline, sometimes next steps, sometimes the policy reference). Best approach?',
o:['Make the criteria explicit','Few-shot examples','Self-review (evaluator–optimizer): draft → checklist self-check → fill gaps → emit','Programmatic hard limits'],
e:'Rung three: omissions that vary case by case → self-review. The keyword is "gaps vary by case".',
w:{0:'The criteria may already exist; the problem is coverage in execution.',1:'Few-shot cannot enumerate every possible omission.',3:'No money or safety involved.'}},

q101:{q:'A code-review tool has a very high false-positive rate and developers now ignore every warning. Best way to stop the bleeding?',
o:['Downgrade all findings to info','Switch off the high-false-positive categories first, keep the high-precision ones, and re-enable gradually once the criteria improve','Add "be conservative, only report high-confidence issues" to the prompt','Reduce review frequency'],
e:'False-positive management: high noise destroying trust → disable the noisy categories to stop the bleeding, keep the precise ones, re-enable after fixing.',
w:{0:'Real problems get buried too.',2:'This kind of vague instruction does not work; you need concrete criteria.',3:'The false-positive rate is unchanged and trust still collapses.'}},

q102:{q:'Why does "only report high-confidence issues" usually fail as a prompt instruction?',
o:['The model does not understand English adjectives','It is a vague instruction with no actionable basis for judgement — what is needed is concrete categorical criteria','It makes the model report nothing at all','It must be in the system prompt rather than the user prompt'],
e:'Vague instructions like "be conservative" or "only high-confidence" do not work — you need specific categorical criteria.',w:{}},

q103:{q:'What is the correct order of the three-rung prompt ladder?',
o:['few-shot → explicit criteria → self-review','explicit criteria → few-shot examples → self-review (evaluator–optimizer)','self-review → few-shot → explicit criteria','explicit criteria → self-review → few-shot'],
e:'Rung one, vague prompt → explicit criteria. Rung two, clear criteria but inconsistent → few-shot. Rung three, varying omissions → self-review.',w:{}},

q104:{q:'What is the most important principle when designing few-shot examples?',
o:['Give as many as possible; 10–15 covers more ground','Target the cases the model actually gets wrong, show the reasoning, and keep it to 2–4 precise examples','Give only the answers, never the reasoning','Keep every example as short as possible'],
e:'Three principles: target actual failures (do not teach what it knows), show the reasoning (not just the answer), few and precise (2–4 beats 10–15 vague ones).',w:{}},

q105:{q:'Why should few-shot examples show "why this option" rather than just the answer?',
o:['It makes the prompt look more professional','So the model learns the reasoning process and can generalise to unseen but similar cases','To add tokens and trigger deeper thinking','To make the prompt easier for humans to review'],
e:'Showing the reasoning is one of the three principles: the model learns the basis for judgement rather than a surface mapping.',w:{}},

q106:{q:'Which of these should NOT be solved with few-shot examples?',
o:['Tool selection in ambiguous cases','Distinguishing acceptable code patterns from genuine issues (reducing false positives)','Ensuring refunds never exceed the authorised limit','Correct extraction from differently structured documents'],
e:'Few-shot is not a cure-all: money and safety require programmatic enforcement, not examples. The other three are genuine few-shot use cases.',w:{}},

q107:{q:'In an extraction task the model occasionally hallucinates units of measure that are not in the source. Besides schema design, how can few-shot help?',
o:['Show worked examples of how to handle informal units, reducing hallucination','Give 15 examples covering every possible unit','Demonstrate how to invent a plausible unit','Few-shot has no effect on hallucination'],
e:'One documented use of few-shot is reducing hallucination in extraction tasks, e.g. handling informal units of measure.',
w:{1:'Violates "few and precise".',2:'Exactly backwards.',3:'Not true.'}},

q108:{q:'Which item is NOT on the "rule this out first" checklist before reaching for few-shot?',
o:['Whether there are any baseline criteria at all','Whether the tool descriptions or names are problematic','Whether temperature is set too high','Whether the system prompt contains accidental routing instructions'],
e:'The checklist: no criteria → write criteria; tool description problems → fix or rename; money/safety → programmatic; varying omissions → self-review; check the system prompt. Temperature is not on it.',w:{}},

q109:{q:'What is the most reliable way to get consistently structured output from Claude?',
o:['Ask for JSON in the prompt and show a format example','Define a tool with a JSON schema and force structured output via tool_use','Extract with regular expressions from free text','Have Claude emit a Markdown table and parse it'],
e:'The most reliable approach is a tool with a JSON schema, using tool_use to force structured output.',
w:{0:'Probabilistic; format errors still occur.',2:'Brittle.',3:'Still free-text parsing.'}},

q110:{q:'After moving to tool_use with a JSON schema, invoice extraction never produces malformed JSON again — but 8% of invoices still have line items that do not sum to the stated total. Why?',
o:['The schema definition has a bug','Tool use removes syntax errors (malformed JSON, missing fields) but not semantic errors (sums that do not add up, values in the wrong field)','The model version is too old','tool_choice should be set to "any"'],
e:'Heavily tested: tool use eliminates syntax errors ✅ but not semantic errors ❌.',
w:{0:'A schema cannot express cross-field arithmetic constraints.',2:'Unrelated to version.',3:'tool_choice governs whether a tool is called.'}},

q111:{q:'Following on: how do you automatically detect semantic errors like "line items do not sum to the total"?',
o:['Raise temperature for more variety','Add cross-check fields: calculated_total (sum of line items) alongside stated_total (as printed), and flag mismatches for human review','Make the total field nullable','Increase few-shot examples to 15'],
e:'Automatic cross-checking: calculated_total plus stated_total, flagged for human review on mismatch (or conflict_detected: true).',
w:{0:'That moves away from accuracy.',2:'Leaving it empty makes detection harder.',3:'Cannot guarantee arithmetic correctness.'}},

q112:{q:'Some invoices simply have no purchase-order number. How should the schema prevent hallucination?',
o:['Mark it required so the model always fills it','Make it nullable rather than required, allowing null when the value is not in the source','Give it a default of "N/A"','Remove the field from the schema entirely'],
e:'Schema design: when the value may be absent from the source, make it nullable rather than required — that prevents fabrication.',
w:{0:'Required forces the model to invent something.',2:'A default is disguised fabrication and collides with genuine "N/A" values.',3:'Then invoices that do have it cannot be captured.'}},

q113:{q:'In sentiment analysis, some reviews are sarcastic and forcing a positive/negative call produces a high error rate. How should the schema change?',
o:['Change sentiment to a 0–100 score','Add an "unclear" value to the enum','Make sentiment nullable','Add few-shot examples teaching sarcasm detection'],
e:'Schema design: when sentiment genuinely cannot be determined (sarcasm), add an "unclear" enum value.',
w:{0:'A number does not solve "cannot determine".',2:'nullable is for "absent from the source"; here it is present but undecidable.',3:'Sarcasm detection is itself unreliable — the schema needs an escape hatch.'}},

q114:{q:'A classification field\'s value set may grow later and cannot be enumerated now. How should the schema be designed?',
o:['Use a free string with no enum','Add "other" to the enum plus a detail string field','Change the schema each time a new value appears','Make it nullable'],
e:'Schema design for extensibility: "other" plus a detail string field.',
w:{0:'Loses all structural constraint.',2:'High maintenance and always lagging.',3:'null discards the information.'}},

q115:{q:'After a validation failure the system retries with an identical prompt and the same error recurs. Best fix?',
o:['Raise the retry count to five','On retry, include the original document, the failed extraction and the specific validation errors','Retry with a different model','Raise temperature for more varied output'],
e:'A blind retry reproduces the error — send the original document plus the failed extraction plus the specific validation errors.',
w:{0:'Identical input yields identical errors.',2:'Does not address the missing information.',3:'Randomness is not an error-correction mechanism.'}},

q116:{q:'Some documents never yield a "contract effective date" no matter how many times you retry; logs show the field simply is not in the source. What should the system do?',
o:['Keep retrying until it succeeds','Recognise that retrying is futile (the information is not in the document), stop, and mark it missing or route it to a human','Have the model infer a plausible date from context','Loosen validation so it passes'],
e:'The limit of retrying: if the information is not in the provided document, no number of retries helps — you must detect when retrying is futile.',
w:{0:'Burns cost indefinitely.',2:'That is hallucination.',3:'Hides the data gap.'}},

q117:{q:'You want to analyse code-review false positives systematically — which findings developers dismiss and what they have in common. Which field do you add?',
o:['severity','detected_pattern — recording which code pattern triggered the finding','timestamp','reviewer_id'],
e:'detected_pattern records what triggered each finding, so dismissals can be analysed for false-positive patterns.',
w:{0:'Severity does not explain the trigger.',2:'Time does not attribute a pattern.',3:'Unrelated to code patterns.'}},

q118:{q:'A self-check finds calculated_total and stated_total disagree. Best action?',
o:['Overwrite stated_total with calculated_total automatically','Set conflict_detected: true in the output and flag it for human review','Discard the record','Re-extract until they agree'],
e:'The self-check flow sets conflict_detected: true (and flags for review) rather than deciding on the user\'s behalf.',
w:{0:'Line items may themselves be incomplete; do not overwrite unilaterally.',2:'Loses data.',3:'They may never agree if the source itself is wrong.'}},

q119:{q:'What are the two defining characteristics of the Batch API versus the synchronous API?',
o:['Lower latency and higher cost','Up to 24 hours of latency and a 50% cost discount','Real-time responses at full price','A guaranteed latency SLA and a 30% discount'],
e:'Batch API: up to 24 hours, 50% discount. Synchronous: real time, full price.',w:{}},

q120:{q:'A pre-merge PR check blocks developers until it returns. Is the Batch API appropriate?',
o:['Yes, it is half the price','No — this is a blocking workflow and cannot wait up to 24 hours','Yes, as long as you set a short timeout','Yes, the Batch API usually returns within seconds'],
e:'One of the three hard limits: workflows that cannot wait are out. Blocking pre-merge checks need the synchronous API.',
w:{0:'Developers would be blocked indefinitely.',2:'There is no SLA to shorten.',3:'There is no latency SLA; do not assume speed.'}},

q121:{q:'Can the Batch API be used for a research task where the agent calls tools over several turns, deciding each step from the last result?',
o:['Yes, package all the tool calls into one batch','No — the Batch API is fire-and-forget and does not support interactive multi-turn tool calling','Yes, submit one batch per turn','Yes, the Batch API has a built-in agentic loop'],
e:'Second hard limit: workflows needing multi-turn tool calls are out — it is fire-and-forget with no mid-request interaction.',
w:{0:'The turns depend on each other and cannot be packaged up front.',2:'One batch per turn means waiting up to 24h per turn.',3:'Batch provides no agentic loop.'}},

q122:{q:'A batch of 10,000 requests comes back with 37 failures. How do you identify and resubmit exactly those 37?',
o:['By array index position','By the custom_id carried on each request, correlating request to response and resubmitting only the failures','Resubmit the whole batch','Match on timestamps'],
e:'custom_id correlates batch requests and responses, so only the failed items need resubmitting.',
w:{0:'Batch result ordering is not guaranteed.',2:'Wastes the cost of 9,963 successful requests.',3:'Timestamps are neither unique nor reliable.'}},

q123:{q:'Documents arrive continuously, batch processing takes up to 24 hours, and the business requires results within 30 hours of arrival. How often should batches be submitted?',
o:['Every 24 hours','Every 6 hours','Every 30 hours','Every hour'],
e:'Scheduling arithmetic: waiting window + 24h processing ≤ 30h → waiting window ≤ 6h → submit every 6 hours.',
w:{0:'Worst case 24+24 = 48h, which breaches the SLA.',2:'Far beyond the 30h requirement.',3:'Workable but fragments batches and loses the economics; the documented answer is 6 hours.'}},

q124:{q:'You need to run extraction over 500,000 documents with the Batch API. Best process?',
o:['Submit everything at once and deal with problems later','Refine the prompt on a small sample → submit the full volume via Batch → resubmit failures in follow-up batches','Use the synchronous API throughout for quality','Submit half, observe for a week, then submit the rest'],
e:'Large-volume strategy: refine the prompt on a sample, submit the full run via Batch, then resubmit failures batch by batch.',
w:{0:'Running the full volume on an unrefined prompt is enormously wasteful.',2:'Twice the cost and far slower.',3:'Without prompt refinement first, both halves hit the same problems.'}},

q125:{q:'Why is "generate then review" within a single session ineffective?',
o:['The context grows too long and it forgets','The model retains its generation reasoning, producing confirmation bias, so it rarely questions its own decisions','Token costs are too high','A single session cannot call review tools'],
e:'The limit of self-review: the same session keeps its reasoning context → confirmation bias → it does not challenge itself. The fix is an independent instance.',
w:{0:'Not a length problem.',2:'Cost is not the quality issue.',3:'Tool availability is unaffected.'}},

q126:{q:'Following on, what is the correct fix?',
o:['Add "please review strictly" to the same session','Review with an independent Claude instance that has none of the generation context','Raise temperature','Run the review via the Batch API'],
e:'The fix is an independent Claude instance, which has no generation reasoning and therefore no confirmation bias.',
w:{0:'Wording cannot remove a structural bias.',2:'Randomness is not objectivity.',3:'Unrelated to the bias.'}},

q127:{q:'Review findings must be routed by risk: high-confidence issues block the merge, low-confidence ones are advisory. How do you design this?',
o:['Route by how long the finding text is','Have the model self-report a confidence score per finding, enabling calibrated review routing','Route by file path','Route by a threshold on the number of findings'],
e:'Self-reported confidence per finding is what enables calibrated review routing.',w:{}},

q128:{q:'What are the two classic symptoms of reviewing a large PR in one pass?',
o:['Slowness and cost','Attention dilution (local issues missed) and self-contradictory conclusions','Malformed JSON and missing fields','Timeouts and rate limiting'],
e:'A large PR in one pass causes attention dilution and contradictions — hence the split into local and integration passes.',w:{}},

/* ═══ DOMAIN 5 ═══ */
q129:{q:'In a long research context, findings in the middle are consistently overlooked by the agent. What is this called, and how is it fixed?',
o:['Context overflow; switch to a larger-window model','Lost in the middle; put the key-findings summary first and add section headers to help navigate the middle','Confirmation bias; re-check with an independent instance','Attention dilution; split into multiple passes'],
e:'Lost in the middle: LLMs attend to the start and end of long inputs and drop the middle. Fix: key summary first plus section headers.',
w:{0:'A larger window does not change the attention distribution.',2:'Confirmation bias is a different problem.',3:'Attention dilution describes the single-pass review case.'}},

q130:{q:'After a long conversation is auto-summarised, the agent misremembers a refund amount that was previously confirmed. Best fix?',
o:['Disable summarisation and keep the full transcript','Extract the hard facts (amounts, dates, order numbers, policy references) into a persistent "case facts" block that is excluded from summarisation and injected each turn','Make the summaries longer','Ask the customer to restate the amount each turn'],
e:'Summaries are lossy by nature. The fix is a persistent case-facts block excluded from summarisation and injected every turn.',
w:{0:'The context will overflow.',2:'A longer summary is still lossy.',3:'Terrible experience, and the customer may misremember too.'}},

q131:{q:'An upstream subagent emits 155K tokens while the downstream synthesis agent performs best around 50K. Best fix?',
o:['Insert an intermediate summarising agent to compress to 50K','Have the upstream agent return only structured essentials (facts + citations + relevance scores), reducing volume at the source','Truncate to the first 50K','Give the downstream agent a larger-window model'],
e:'Filter at the source rather than summarising afterwards. An intermediate summariser is explicitly marked as treating the symptom.',
w:{0:'Officially marked ❌: another layer that treats the symptom.',2:'Discards later findings.',3:'A bigger window does not improve the signal-to-noise ratio, and lost-in-the-middle persists.'}},

q132:{q:'Putting the key-findings summary at the very start of a long context primarily counteracts what?',
o:['Token cost','Lost in the middle (content in the middle is easily missed)','Confirmation bias','Race conditions'],
e:'Attention is strongest at the start and end, so key content goes first, with section headers to help navigate the middle.',w:{}},

q133:{q:'A customer\'s situation is not covered by any company policy. What should the agent do?',
o:['Extrapolate from the closest policy','Escalate — this is a policy gap, and the agent must not invent rules','Refuse service','Tell the customer to look up the policy themselves'],
e:'One of the four escalation triggers: a policy gap means there is no rule to follow, and the agent must not make one up.',
w:{0:'Extrapolation is inventing a rule; high risk.',2:'Poor experience and unresolved.',3:'Passing the buck.'}},

q134:{q:'Which situation should NOT be escalated to a human?',
o:['A complaint requiring subjective, empathetic judgement','A shipping dispute — the company has a standard procedure','A refund above the agent\'s authorised limit','An irreversible high-risk action'],
e:'Where a standard procedure exists (a shipping dispute), the agent handles it. The other three are genuine escalation triggers.',w:{}},

q135:{q:'A customer raises four issues at once and the agent decides "this is too much for me" and escalates. Is that right?',
o:['Yes, more issues means escalate','No — "several issues at once" is not an escalation trigger; the agent should decompose, investigate in parallel and synthesise one reply','Yes, because the context will overflow','No, it should answer only the first issue'],
e:'Explicitly not an escalation trigger: multiple simultaneous issues. Decompose and handle them in parallel.',
w:{0:'Contrary to the official criteria.',2:'Four issues will not overflow the context.',3:'Leaves customer needs unmet.'}},

q136:{q:'A customer lookup returns three customers with the same name. What should the agent do?',
o:['Pick the one with the most recent order','Do not guess — ask the user for an additional identifier (email, phone, order number)','Escalate to a human','Act on all three accounts'],
e:'Disambiguating multiple matches: do not guess, ask for another identifier.',
w:{0:'Guessing wrong is a serious incident.',2:'A standard disambiguation exists; no escalation needed.',3:'Catastrophic.'}},

q137:{q:'The rule "refunds may not exceed $500" — escalation or programmatic enforcement?',
o:['Escalation: send every refund to a human for confirmation','Programmatic enforcement (hook or prerequisite): the rule is explicit and simply must hold 100% of the time','Neither; a prompt instruction is enough','Escalation, because money is involved'],
e:'The distinction: escalation is for when a human judgement is needed (no rule exists); programmatic enforcement is for an existing rule that must hold 100% (refund caps, identity verification).',
w:{0:'The rule is explicit; no human judgement is required each time.',2:'A prompt cannot guarantee 100%.',3:'Money means a programmatic hard limit, not blanket escalation.'}},

q138:{q:'Two of a research system\'s five data sources timed out. What must the agent absolutely NOT do?',
o:['Continue synthesising with the remaining three sources','Annotate which areas are well supported, which have gaps, and which sources failed','Silently skip the failed sources and emit a report that looks complete','Keep both values and flag the conflict where data disagrees'],
e:'Absolutely prohibited: silently skipping without reporting. Hiding the error leaves a hole in the output that nobody knows about.',w:{}},

q139:{q:'When some data sources fail, what does correct graceful degradation look like?',
o:['Fail the whole task and return an error','Continue synthesising with what is available, and annotate coverage and gaps explicitly in the output','Retry automatically until everything succeeds','Substitute guessed data for the failed sources'],
e:'Graceful degradation: keep working with the available data while clearly flagging the gaps.',
w:{0:'Discards 60% of usable information.',2:'Some failures are not retryable, and this blocks indefinitely.',3:'Hallucination.'}},

q140:{q:'Two sources give different values for the same metric. What should the subagent do?',
o:['Pick whichever looks more credible','Keep both values, flag the conflict, and let the coordinator decide','Take the average','Drop the metric'],
e:'On conflicting data, keep both values with the conflict flagged and let the coordinator decide — do not choose yourself.',
w:{0:'Overreach, and it may be wrong.',2:'Numerically meaningless.',3:'Loses information.'}},

q141:{q:'A search tool returns "0 results". What is that?',
o:['A failure requiring a retry','A successful query with no matches — a meaningful empty result','A timeout','A permission error'],
e:'Heavily tested: "0 results" means the query succeeded and nothing matched; "timeout" means the query never completed and is a failure.',w:{}},

q142:{q:'Why is silent skipping listed as something you must never do?',
o:['It wastes tokens','It hides the error — the final output has a gap that nobody knows about','It triggers rate limiting','It violates the MCP specification'],
e:'Hiding the error means downstream decisions are made on incomplete data without anyone realising.',w:{}},

q143:{q:'Subagents emit so much output that downstream synthesis quality drops. What is the recommended principle?',
o:['Post-hoc summarisation beats source filtering','Source filtering beats post-hoc summarisation','Increase the downstream agent\'s context window','Reduce the number of subagents'],
e:'The principle is that filtering at the source beats summarising afterwards: have upstream agents return structured essentials rather than adding an intermediate summariser.',w:{}},

q144:{q:'In structured handoffs between agents, how should content and metadata be separated?',
o:['Blend everything into one natural-language passage','Content = facts, findings, quotations; metadata = source URL, document name, page number, relevance score','Content = URLs; metadata = facts','No separation is needed; the downstream agent will parse it'],
e:'Structured handoff separates content (facts, findings, quotations) from metadata (source URL, document name, page number, relevance score) to preserve attribution.',w:{}},

q145:{q:'Why is "add an intermediate summarising agent" marked as a ❌ approach?',
o:['Summarising agents are expensive','It adds another processing layer and treats the symptom — the volume should be reduced at the source','The Agent SDK does not support three-level agents','Summarising agents create race conditions'],
e:'❌ an intermediate summariser is another layer treating the symptom; ✅ have upstream agents return structured essentials, cutting volume at the source.',w:{}},

q146:{q:'What are the correct steps of the evaluator–optimizer pattern?',
o:['Emit the final reply directly and spot-check afterwards','Draft the reply → self-check against a checklist (policy? timeline? next steps? did it answer the question?) → fill the gaps → emit the final reply','Generate three versions in parallel and vote','Ask the user what format they want, then generate'],
e:'Evaluator–optimizer: draft → checklist self-check → fill gaps → final reply. It fits omissions that vary case by case.',w:{}},

q147:{q:'An extraction system now emits field-level confidence scores. How should human review be organised?',
o:['Review only the low-confidence fields','Prioritise low confidence for review, and also take a stratified random sample across every confidence band','Review only the high-confidence fields','Sample purely at random, ignoring confidence'],
e:'Review the low-confidence first; still sample the high-confidence, because high confidence can still be wrong.',
w:{0:'Every high-confidence error would escape.',2:'Backwards.',3:'Wastes reviewer capacity on obviously correct samples.'}},

q148:{q:'Which problem does the evaluator–optimizer pattern fit best?',
o:['A hard cap on refund amounts','Omissions that vary from case to case','Wrong tool selection','Malformed JSON'],
e:'It fits omissions that vary case by case — rung three of the prompt ladder.',
w:{0:'Money → programmatic hard limit.',2:'Fix the tool description or name.',3:'tool_use plus a JSON schema.'}},

q149:{q:'Why sample high-confidence extractions for review as well?',
o:['To measure the confidence distribution','Because high confidence can still be wrong — reviewing only low confidence lets those errors escape entirely','To satisfy a compliance audit','To source few-shot material'],
e:'High confidence can still be wrong, so stratified random sampling across bands avoids a systematic blind spot.',w:{}},

q150:{q:'Faced with any "the agent is underperforming" problem, what is the universal priority framework?',
o:['Architecture first → then tools → then the prompt','Tune the prompt first → then tools and workflow → then architecture and infrastructure. Exception: money, safety or compliance go straight to programmatic enforcement','Change the model → then the prompt → then add tools','Add few-shot → then a hook → then split the agent'],
e:'Priority: 1) prompt (simplest, fastest, cheapest) 2) tools and workflow 3) architecture and infrastructure. Exception: money/safety/compliance → programmatic enforcement directly.',w:{}},

q151:{q:'Late in a long codebase-exploration session, Claude starts giving inconsistent answers and cites "the typical approach" rather than the specific classes it actually read earlier. What is happening?',
o:['Hallucination; switch to a stronger model','Context degradation — the early findings have been diluted and the model falls back on generic priors','Overlapping tool descriptions causing wrong tool selection','Confirmation bias'],
e:'Official 5.4: inconsistent answers plus citing "typical patterns" instead of specific classes discovered earlier is the signature of context degradation.',
w:{0:'A different model does not stop the dilution.',2:'A tool-selection problem, unrelated to session length.',3:'Confirmation bias belongs to generate-then-self-review.'}},

q152:{q:'What does the official guidance recommend to counteract that context degradation?',
o:['Re-read the whole codebase every turn','Have the agent maintain scratchpad files recording key findings, and read them back on later questions','Lower the temperature','Shorten each question'],
e:'Scratchpad files persist key findings across context boundaries and are read back to counteract degradation.',
w:{0:'That is exactly what blows the context up.',2:'Unrelated to context capacity.',3:'The problem is diluted history, not question length.'}},

q153:{q:'Exploration has produced a lot of verbose output, the context is nearly full, and the task is not finished. Which in-session compaction mechanism does the official guide name?',
o:['`/memory`','`/compact`','`--resume`','`fork_session`'],
e:'/compact reduces context usage during extended exploration sessions when the window fills with verbose discovery output.',
w:{0:'/memory shows which memory files loaded.',2:'Resumes a session; not compaction.',3:'Creates a branch; not compaction.'}},

q154:{q:'A long-running multi-agent analysis needs to survive crashes. What is the recommended design?',
o:['Print all intermediate results to logs and have a human read them after a crash','Each agent exports its state as a structured manifest to a known location; the coordinator loads it on resume and injects it into agent prompts','Raise max_tokens to avoid interruptions','Submit via the Batch API and let it retry automatically'],
e:'Official 5.4: design crash recovery around structured agent state exports (manifests) that the coordinator loads on resume and injects into agent prompts.',
w:{0:'Unstructured and not automatically recoverable.',2:'Unrelated to crash recovery.',3:'Batch does not support interactive multi-turn workflows.'}},

q155:{q:'A main agent is under heavy context pressure while exploring a large codebase. Which of these are officially recommended mitigations? (Select 3)',
o:['Dispatch subagents for specific questions (e.g. "find all test files") while the main agent stays high-level','Persist key findings in scratchpad files','Read every source file at once to build complete context','Summarise the previous phase before the next one and inject it into the initial context'],
e:'The three official skills for 5.4: subagents isolate verbose exploration, scratchpad files persist key findings, and phase summaries are injected between stages.',
w:{2:'This is the anti-pattern that causes context explosion; the official guidance is incremental exploration (Grep for entry points → Read to follow imports).'}},

q156:{q:'In a research pipeline, subagent findings pass through one summarisation step before reaching the synthesis agent. The conclusions are correct, but nobody can tell which document supports which claim. Root cause?',
o:['The synthesis agent\'s max_tokens is too small','The summarisation step flattened the claim-source mappings — attribution was lost during compression','The subagents were not run in parallel','tool_choice was set to "auto"'],
e:'Official 5.6: summarisation loses source attribution unless claim-source mappings are preserved. Require structured claim-source mappings and have downstream synthesis preserve and merge them.',
w:{0:'Not a length issue; the structure was lost.',2:'Parallelism does not affect attribution.',3:'tool_choice governs whether a tool is called.'}},

q157:{q:'Two equally credible sources report different figures for the same metric. What should the synthesis agent do?',
o:['Take the more recent one','Annotate the conflict and preserve each source\'s attribution, letting the coordinator decide how to reconcile','Take the average','Discard both and mark the data unavailable'],
e:'Official 5.6: annotate conflicting statistics with source attribution rather than arbitrarily selecting one value; reconciliation is the coordinator\'s decision.',
w:{0:'"More recent" is not necessarily more correct, and this is overreach.',2:'Statistically meaningless.',3:'Discards genuinely valid information.'}},

q158:{q:'In a synthesis report, 2023 market-size figures and 2026 figures were presented side by side as "contradictory findings". What should subagents be required to do to prevent this at the source?',
o:['Use only the most recent year\'s data','Include publication / data-collection dates in their structured output','Attach a confidence score to every figure','Convert all figures to a common unit'],
e:'Official 5.6: require publication or data-collection dates in structured outputs so temporal differences are not misread as contradictions.',
w:{0:'Discards trend information.',2:'Confidence does not address the temporal dimension.',3:'Units are not the source of this conflict.'}},

q159:{q:'Which of these are officially named agentic-loop anti-patterns? (Select 3)',
o:['Parsing natural language to decide the loop is over (e.g. looking for "Is there anything else?")','Using a max-iteration cap as the primary stopping mechanism','Inspecting assistant text content as a completion signal','Exiting when stop_reason is "end_turn"'],
e:'The three anti-patterns are the first three. The fourth is the only correct loop-control mechanism.',
w:{3:'This is correct behaviour, not an anti-pattern.'}},

q160:{q:'Which fields should a structured MCP error response carry so the agent can make sound recovery decisions? (Select 3)',
o:['isError','errorCategory','isRetryable','modelVersion'],
e:'The four elements of a structured MCP error: isError, errorCategory (transient/validation/business/permission), isRetryable, and a human-readable description.',
w:{3:'Model version has nothing to do with error recovery.'}},

q161:{q:'To call Claude Code in CI and get output that is both script-parseable and conformant to a fixed structure, which flags are needed? (Select 3)',
o:['-p / --print','--output-format json','--json-schema','--resume'],
e:'The three flags escalate: -p for non-interactive (mandatory in CI, or the job hangs) → --output-format json for parseability → --json-schema to enforce the structure.',
w:{3:'--resume resumes a session and is unrelated to structured CI output.'}},

q162:{q:'Which of these situations should be escalated to a human? (Select 2)',
o:['Company policy says nothing at all about the customer\'s specific request','The customer raised four different issues at once','The refund amount exceeds the agent\'s authorised limit','A shipping dispute, for which the company has a standard procedure'],
e:'A policy gap (no rule to follow) and exceeding the agent\'s authority are both escalation triggers. Multiple issues and disputes with a standard procedure are handled by the agent.',
w:{1:'"Several issues at once" is explicitly not an escalation trigger — decompose and handle in parallel.',3:'A standard procedure exists, so no escalation.'}},

q163:{q:'After enforcing structured output with tool_use and a JSON schema, which problems can STILL occur? (Select 2)',
o:['Malformed JSON','Line items that do not sum to the stated total','Missing required fields','Values placed in the wrong field'],
e:'Tool use removes syntax-level errors (malformed JSON, missing fields) but not semantic errors (sums that do not add up, values in the wrong field).',
w:{0:'Syntax errors are eliminated by the schema.',2:'Missing fields are eliminated by the schema.'}},

});
