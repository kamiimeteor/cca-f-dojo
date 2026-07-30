/* 英文题库 第 1 批：Domain 1 + Domain 2 */
Object.assign(CONTENT_EN.questions, {

/* ═══ DOMAIN 1 ═══ */
q001:{q:'A support agent decides the conversation is over by looking for "Is there anything else I can help with?" in Claude\'s reply. QA finds the agent often quits in the middle of tool calls. What is the root fix?',
o:['Instruct Claude in the system prompt to use that sentence only when genuinely finished','Check the API response\'s stop_reason field: continue on tool_use, stop on end_turn','Raise the max-iteration cap from 5 to 20','Append a user message asking "anything else?" after every turn'],
e:'`stop_reason` is the structured loop-control signal in the API response and the only correct termination test. Parsing natural language is the first of the three anti-patterns.',
w:{0:'A prompt is probabilistic advice; the wording is not guaranteed and the bug returns.',2:'A max-iteration cap is a safety net only, never the primary stop condition.',3:'Adds pointless turns and still judges by text content.'}},

q002:{q:'The API returns stop_reason: "tool_use". What is the correct next step in the agentic loop?',
o:['Return the response text to the user and finish','Run the tool Claude asked for, feed the result back as a new message, and continue the loop','Resend the identical request once as a retry','Look for the word "done" in the assistant text before deciding'],
e:'tool_use means Claude wants a tool: run it, return the result, keep looping until end_turn.',
w:{0:'That truncates unfinished work.',2:"Retrying resends the same request and suits transient failures; here tool_use requires running the tool and returning its result, so retrying makes no progress.",3:'Inspecting assistant text is an anti-pattern.'}},

q003:{q:'Which is an acceptable use of a maximum-iteration cap in an agentic loop?',
o:['As the primary signal that the task is complete','As a runaway safety net, with termination still decided by stop_reason','As a replacement for stop_reason, which is sometimes unreliable','To limit how many tools Claude may call per turn'],
e:'A cap is only a safety net against runaway loops and cost. Termination must come from stop_reason.',
w:{0:"A maximum-iteration cap protects against runaway loops and cost, but reaching it does not mean the task is complete; termination must use stop_reason.",2:'stop_reason is a structured signal — it is the most reliable thing available.',3:'Iteration count is unrelated to tools per turn.'}},

q004:{q:'Which of these is NOT one of the three named agentic-loop anti-patterns?',
o:['Parsing natural language to decide the loop is over','Using a max-iteration cap as the primary stopping mechanism','Inspecting assistant text content as a completion signal','Feeding tool results back to Claude as new messages'],
e:'Feeding tool results back is the correct behaviour. The other three are the named anti-patterns.',w:{0:'Natural-language termination depends on variable wording and can mistake an intermediate reply for completion; the loop should read structured stop_reason.',1:'A maximum-iteration limit is a runaway safety cap, not evidence that the task is complete, so it cannot be the primary stop condition.',2:'Assistant text is unstructured and variable; treating it as a completion flag is as brittle as parsing any other natural-language phrase.'}},

q005:{q:'A code-generation agent occasionally "finishes early" on long tasks. Logs show the loop exiting while stop_reason was still tool_use. What should you inspect first?',
o:['Whether the termination condition mixes in checks on text content or iteration count','Whether the Claude model version is out of date','Whether tool return values are too large','Whether the system prompt is too long'],
e:'stop_reason said continue but the loop exited, so the termination condition contains a non-stop_reason test — one of the anti-patterns.',
w:{1:'The model version does not make application code exit while stop_reason is still tool_use; the fault remains in the local loop condition.',2:'A large tool result affects context usage but does not directly turn tool_use into a termination signal.',3:'System-prompt length may affect model behaviour, but it cannot explain application code ignoring structured stop_reason and exiting early.'}},

q006:{q:'What does stop_reason: "end_turn" mean?',
o:['Claude wants to call a tool','Claude has finished this turn; the loop should end and the result go to the user','Claude hit the token limit','An error occurred and a retry is needed'],
e:'end_turn means Claude is done — the task is complete and you reply to the user.',
w:{0:'tool_use, not end_turn, signals that Claude wants the application to execute a tool and continue the loop.',2:'max_tokens signals that generation hit its token limit; end_turn instead means the current work is complete.',3:'Execution or API failures use error responses rather than end_turn, which is a normal completion signal.'}},

q007:{q:'In a multi-agent research system, an architect wants two subagents to exchange intermediate findings directly to lighten the coordinator\'s load. What is wrong with that?',
o:['It breaks hub-and-spoke: subagents must not communicate directly — communication, error handling and routing all belong to the coordinator','It will drive token costs up','The Agent SDK does not support that message format','It will slow the subagents down'],
e:'Hub-and-spoke: the coordinator owns all subagent communication, error handling and information routing; subagents never talk directly.',
w:{1:"Token cost is an optimisation concern; this question tests the hub-and-spoke communication boundary, which direct subagent communication violates.",2:'This is an architecture principle, not a support limitation.',3:"Response speed is a performance concern; the actual defect is that subagents bypass the coordinator and violate the hub-and-spoke architecture."}},

q008:{q:'A coordinator dispatched four subagents on the same topic and three reports came back largely duplicated. What is missing from the coordinator design?',
o:['It failed to partition the research space and give each subagent a non-overlapping scope (by subtopic or source type)','The subagents were not given enough tools','Four subagents is too many; it should use one','No maximum iteration count was set'],
e:'The coordinator\'s first rule: partition the research space explicitly with non-overlapping scopes.',
w:{1:'Tools are not the cause of duplication.',2:'Parallelism is fine; the overlap is the problem.',3:"A maximum-iteration cap limits runaway loops, not overlapping research scopes; the coordinator must assign non-overlapping work to prevent duplication."}},

q009:{q:'A coordinator always runs "search agent → document agent → verification agent → synthesis agent" in fixed order, even for simple queries — slow and expensive. What should change?',
o:['Let the coordinator select subagents dynamically instead of always running the full pipeline','Merge all four agents into one large agent','Shorten each agent\'s system prompt','Add caching to the pipeline'],
e:'Coordinator rule two: choose subagents dynamically rather than running a fixed pipeline.',
w:{1:'Loses specialisation and isolation.',2:"A shorter system prompt may reduce context per call, but every agent still runs in the fixed pipeline; the coordinator should select agents dynamically.",3:'Caching does not stop unnecessary invocations.'}},

q010:{q:'After synthesising a report, the coordinator notices one subtopic is clearly under-evidenced. What does the official guidance recommend?',
o:['Publish the report and note the weak evidence','Enter an iterative refinement loop: evaluate the synthesis, locate gaps, re-dispatch targeted subagents, repeat until coverage is sufficient','Ask the user to rephrase the question','Re-run every subagent from scratch'],
e:'Coordinator rule three: evaluate → find gaps → re-delegate with targeted queries → repeat until coverage is sufficient.',
w:{0:'Do not ship a known gap you can close.',2:"Asking the user again fits an unclear request; here the coordinator already knows the evidence gap and should dispatch a targeted subagent to close it.",3:'Wasteful and untargeted.'}},

q011:{q:'After the coordinator decomposes a task, a subagent reports it has no idea what the user is asking about. The most likely cause?',
o:['Subagents do not inherit parent context; the coordinator must pass what they need explicitly','The subagent model version is too old','The coordinator\'s allowedTools is misconfigured','The subagent\'s max_tokens is too small'],
e:'Subagent context must be passed explicitly — it is never inherited from the parent.',
w:{1:"Model version can affect capability, but it does not change the rule that subagents lack parent context; the coordinator must pass the background explicitly.",2:'A bad allowedTools stops spawning entirely, not context.',3:'Affects output length, not input background.'}},

q012:{q:'In the Agent SDK, which tool must appear in a coordinator\'s allowedTools for it to spawn subagents?',
o:['Bash','Task','Read','Grep'],
e:'The Task tool spawns subagents, so "Task" must be present in allowedTools.',w:{0:'Bash runs shell commands such as installing dependencies or checking Git status; it cannot spawn or delegate a subagent.',2:'Read retrieves the contents of a file at a known path; it does not create agents.',3:'Grep searches files and code by content pattern; it can locate text but cannot spawn a subagent.'}},

q013:{q:'A coordinator needs to investigate five independent subtopics in parallel. What is correct?',
o:['Emit five Task calls in a single response','Send one Task call per turn across five turns','Write "please investigate these five topics in parallel" inside one Task prompt','Use fork_session five times'],
e:'Parallel spawning means multiple Task calls in one coordinator response — not spread across turns.',
w:{1:'That is serial and five times slower.',2:'A single subagent will not truly parallelise internally.',3:'fork_session branches from a shared baseline; it is not a dispatch mechanism.'}},

q014:{q:'Search-agent and document-agent results must reach a synthesis agent. What is the best way to pass context?',
o:['Send a one-line summary and let the synthesis agent look things up again','Put the prior agents\' complete findings directly in the synthesis prompt, using a structured format that separates content from metadata (source URL, document name, page)','Write results to a shared file for the synthesis agent to read','Rely on shared memory between subagents'],
e:'Best practice: complete findings in the prompt, with content and metadata separated to preserve attribution.',
w:{0:'Summaries are lossy and force duplicated work.',2:'Adds indirection and loses the attribution structure.',3:'Subagents do not share memory.'}},

q015:{q:'A coordinator prompt spells out "first search X, then read document Y, then compare Z". When an unexpected data shape appears, every subagent stalls. How should the prompt change?',
o:['Add more detail, enumerating every branch','State research goals and quality criteria rather than step-by-step procedure, so subagents can adapt','Reduce the number of subagents','Move the prompt into AgentDefinition\'s description field'],
e:'Coordinator prompts should specify goals and quality criteria, not procedure — that is what enables adaptation.',
w:{0:'Enumerating branches is impossible and brittle.',2:"Reducing the subagent count changes the level of parallelism but does not address the rigidity of step-by-step instructions; the prompt should state goals and quality criteria.",3:'Relocating the text changes nothing.'}},

q016:{q:'A team wants to compare a "migrate to Jest" path against a "migrate to Vitest" path from the same codebase analysis, without the two explorations contaminating each other. What fits?',
o:['--resume the same session and alternate between them','fork_session, creating two independent branches from the shared baseline','Two entirely separate new sessions, each starting from zero','Put both options in one prompt and let Claude analyse them together'],
e:'fork_session exists precisely to branch independent explorations from a shared analysis baseline.',
w:{0:'One session means the two explorations pollute each other.',2:'Throws away the shared baseline and repeats the analysis cost.',3:'The two options will bias each other.'}},

q017:{q:'What does AgentDefinition configure?',
o:['Each subagent type\'s description, system prompt and tool restrictions','MCP server connection parameters','The CLAUDE.md loading hierarchy','When hooks fire'],
e:'AgentDefinition is the subagent configuration: description, system prompt, tool restrictions.',w:{1:'MCP connection settings configure an external tool server, not a subagent role, prompt, or permission set.',2:'The CLAUDE.md hierarchy controls where project memory loads from; it does not define subagents.',3:'Hook timing configures event-driven automation and is unrelated to defining a subagent.'}},

q018:{q:'Regarding subagent memory, which statement is correct?',
o:['Subagents share memory across invocations','Subagents neither share memory across invocations nor inherit parent context','Subagents inherit parent context but do not share memory with each other','Subagent memory is synchronised automatically via MCP resources'],
e:'Both are negative: no inherited parent context, no shared memory across invocations. Hence context must be passed explicitly.',w:{0:'Each subagent invocation is isolated and does not automatically retain memory from a previous call.',2:'Subagents neither inherit parent context automatically nor share memory across calls, so this statement is only half right.',3:'MCP resources expose readable data; they do not synchronise conversation memory between subagents.'}},

q019:{q:'A support agent occasionally issues refunds without verifying the customer\'s identity. Which option is the most reliable fix?',
o:['Write "identity must be verified first" in bold in the system prompt','Add a programmatic prerequisite: process_refund is blocked until get_customer returns a verified customer ID','Provide three few-shot examples demonstrating correct verification','Add "please verify identity before calling" to the tool description'],
e:'Money plus identity verification demands determinism, so it needs a programmatic hard limit. A prompt is advice; code is law.',
w:{0:'A prompt is only probabilistic advice.',2:'Few-shot raises the odds but guarantees nothing.',3:"A tool description helps Claude decide when to call a tool, but remains probabilistic; identity verification needs a programmatic prerequisite that always runs."}},

q020:{q:'An agent\'s reply formatting is occasionally inconsistent (sometimes with headings, sometimes without). No money or safety is involved. Best fix?',
o:['Add a PreToolUse hook to intercept','Tune the prompt / add few-shot examples','Add a programmatic prerequisite','Escalate to a human'],
e:'Formatting inconsistency is the "probabilistic is fine" case — prompt tuning is enough; no hard limit needed.',
w:{0:'PreToolUse hooks are for deterministic interception of risky operations; using one for heading style is unnecessary enforcement.',2:'Programmatic prerequisites fit rules that must never fail, while this is a tolerable formatting preference, so the approach is over-engineered.',3:'Human escalation is for authority limits, high risk, or subjective judgement, not ordinary formatting variation.'}},

q021:{q:'One customer message raises three issues at once: refund status, exchange policy, and a login failure. Best handling?',
o:['Answer the first only and let the customer ask again','Split into separate items, investigate in parallel over shared context, then synthesise one unified reply','Escalate immediately because there are too many issues','Handle them serially, replying after each one'],
e:'Multi-issue requests: decompose, investigate in parallel over shared context, synthesise a single unified reply.',
w:{0:"Answering only the first item fits a single-issue request; this message contains three known needs, so the choice omits two and forces another exchange.",2:'"Several issues at once" is explicitly NOT a reason to escalate.',3:'Slow and fragmented.'}},

q022:{q:'The agent decides to escalate a case to a human. Best handoff?',
o:['Forward the raw conversation transcript','Provide a structured summary: customer ID, root cause, refund amount, recommended action','Send "customer needs help" plus the ticket number','Ask the customer to re-explain to the human'],
e:'A structured handoff summary means the human does not have to read the whole transcript.',
w:{0:'Forces the human to re-read everything.',2:'Not enough information.',3:'Terrible customer experience.'}},

q023:{q:'Which consequence REQUIRES a programmatic hard limit rather than prompt tuning?',
o:['The tone is not friendly enough','Summaries are sometimes too long, sometimes too short','A refund was paid into the wrong customer\'s account','Email signature formatting is inconsistent'],
e:'Wrong refund = money plus wrong identity → deterministic requirement → programmatic hard limit. The rest are probabilistic style issues.',w:{0:'Tone is a style preference that prompt guidance can usually improve; it does not require a programmatic hard limit.',1:'Summary length can be controlled with explicit criteria, structure, or token limits and does not carry the same zero-tolerance financial risk.',3:'An email signature is a formatting concern suited to a template or prompt, not a safety hard limit.'}},

q024:{q:'What does "a prompt is advice, code is law" mean in practice for architecture decisions?',
o:['Prompts are never reliable; put all logic in code','When failure is tolerable (formatting, style) use a prompt; when a rule must hold 100% (money, safety, identity) use programmatic enforcement','Programmatic enforcement is cheaper, so prefer it','Prompts work for conversation but not workflows'],
e:'The test is severity of consequence: probabilistic is fine → prompt; determinism required → programmatic.',
w:{0:'This is too absolute: prompts are the appropriate, lowest-cost control for tolerable style and formatting variation.',2:'Programmatic enforcement costs more and is reserved for rules that must hold deterministically, not every preference.',3:"Prompts can guide workflows as well as conversations; the choice depends on whether failure is tolerable, not on the interaction being conversational."}},

q025:{q:'Company policy: any refund over $500 must go to a human. Which mechanism is most reliable?',
o:['State the limit in the tool description','A PreToolUse hook that intercepts before execution and blocks over-limit refunds, routing to a human','A PostToolUse hook that checks the amount after the refund','Few-shot examples showing escalation when over the limit'],
e:'PreToolUse fires before the tool runs and exists for permission checks and blocking risky actions. Refund > $500 → block → human is the canonical example.',
w:{0:'Probabilistic; Claude may ignore it.',2:'The money has already gone out.',3:'Probabilistic; no guarantee.'}},

q026:{q:'A tool returns Unix timestamps and you want them normalised to human-readable ISO 8601 before Claude sees them. What do you use?',
o:['A PreToolUse hook','A PostToolUse hook','A system-prompt instruction telling Claude to convert them','A different tool that returns ISO format'],
e:'PostToolUse fires after execution and exists for result transformation and format normalisation — this is the canonical example.',
w:{0:"PreToolUse handles checks before execution, when no result exists yet; timestamp conversion must run afterward in a PostToolUse hook.",2:'Probabilistic and wastes tokens.',3:'There may be no alternative tool, and a hook generalises.'}},

q027:{q:'What is the core difference between a hook and a tool?',
o:['Hooks are faster, tools are slower','Hooks fire automatically and deterministically (Claude never sees them); tools are chosen by Claude and are probabilistic (it can pick wrong or forget)','Hooks are read-only, tools can write','Hooks are project-scoped, tools are user-scoped'],
e:'Hook = automatic + certain. Tool = chosen + probabilistic. Money and safety always require a hook.',w:{0:'Speed is not the defining distinction; the key difference is deterministic automatic execution versus model-chosen invocation.',2:'Hooks and tools can both read or write depending on their implementation; there is no fixed read/write split.',3:'Project or user scope describes where configuration applies, not the core difference between hooks and tools.'}},

q028:{q:'When should you use a hook rather than a prompt?',
o:['When you want output in a particular language','When a business rule must hold 100% of the time','When you want replies to be more concise','When you want Claude to call a certain tool more often'],
e:'A rule requiring 100% compliance needs a deterministic hook; style and formatting preferences are fine in a prompt.',
w:{0:'Output language is a style preference that prompt guidance can handle; it does not need deterministic hook enforcement.',2:'Conciseness is a tolerable style preference and should be tuned in the prompt.',3:'Tool-selection preference should first be expressed through clear tool descriptions or prompt guidance, not a mandatory hook.'}},

q029:{q:'In review someone proposes: "make permission checking a check_permission tool and have Claude call it before sensitive operations." What is the flaw?',
o:['Tool calls add latency','A tool is chosen by Claude and therefore probabilistic — it may forget or misjudge, so it cannot guarantee 100% compliance; permission checks belong in a PreToolUse hook','check_permission overlaps with other tool names','It consumes an allowedTools slot'],
e:'Security and permissions must hold 100% of the time, so they need an automatic deterministic hook, not a tool Claude elects to call.',
w:{0:"Tool-call latency is a performance cost, but the critical risk is that Claude may skip the permission tool, so the security check is not guaranteed.",2:"Renaming resolves ambiguity between similar tools; here the flaw is making permission checking optional, which a clearer name still cannot guarantee.",3:"An allowedTools slot affects the available set, not enforcement; a security check that must always run belongs in an automatic PreToolUse hook."}},

q030:{q:'A hook fires and blocks a tool call. From Claude\'s point of view, what happens?',
o:['Claude knows in advance and routes around it','The hook is deterministic and system-executed; Claude cannot influence whether it fires','Claude can ask to skip the hook in its prompt','The hook is only a suggestion to Claude'],
e:'A hook is code that runs automatically on an event — deterministic and entirely outside Claude\'s control.',w:{0:'Claude does not know in advance exactly how a hook will rule; the system runs the hook independently when the event occurs.',2:'A prompt cannot let Claude bypass a deterministic hook; the hook code decides whether the call proceeds.',3:'A hook is executable enforcement that can block an operation, not probabilistic advice for Claude.'}},

q031:{q:'A 120-file PR was reviewed in one pass; Claude missed many local bugs and its conclusions contradicted each other. Best fix?',
o:['Switch to a larger-context model and run one pass again','Split into a per-file local pass (local bugs) and a cross-file integration pass (data-flow issues)','Ask the developer to break it into smaller PRs','Review only the 20 files with the most changed lines'],
e:'Large PR in one pass causes attention dilution and contradictions; multi-pass review splits local from integration concerns.',
w:{0:'Attention dilution is not a window-size problem.',2:'Pushes the burden onto the developer; not an architectural fix.',3:"Filtering by changed-line count only narrows scope and can miss small but important cross-file effects; the review needs local and integration passes."}},

q032:{q:'The task is "analyse each file statically, then integrate into a cross-file report" — fixed and predictable. Which decomposition pattern?',
o:['Dynamic decomposition','Prompt chaining','fork_session','Evaluator–optimizer'],
e:'Prompt chaining is a fixed ordered pipeline, ideal for predictable multi-step reviews (per-file analysis → cross-file integration).',
w:{0:'Dynamic decomposition suits open-ended exploration.',2:"fork_session creates independent branches from a shared baseline for comparing alternatives; this fixed sequential workflow calls for prompt chaining.",3:'That is for self-review gap filling.'}},

q033:{q:'The task is "investigate potential performance problems in this unfamiliar codebase" — you cannot know in advance what you will find. Which pattern?',
o:['Prompt chaining','Dynamic decomposition: map the structure, find hot spots, generate subtasks on the fly','Batch API submission','A PreToolUse hook'],
e:'Dynamic decomposition suits open-ended investigation: subtasks emerge from intermediate findings.',
w:{0:'A fixed pipeline cannot handle the unknown.',2:"The Batch API submits work in bulk but does not create new subtasks from discoveries made during a scan; this open exploration needs dynamic decomposition.",3:"A PreToolUse hook checks or blocks an operation before execution; it does not plan investigation steps from new findings, which this task requires."}},

q034:{q:'In multi-pass review, what is the cross-file integration pass responsible for finding?',
o:['Null-pointer risk inside a single function','Cross-file data-flow problems (e.g. a module changed its return shape and callers were not updated)','Inconsistent code style','Missing comments'],
e:'The local pass finds local bugs; the integration pass finds cross-file data-flow problems. That is the division of labour.',
w:{0:'A null-pointer risk within one function belongs to the per-file local pass, not cross-file integration.',2:'Code style is a local consistency concern and does not trace data flow between files.',3:'Missing comments are a local documentation issue, not a cross-file contract failure.'}},

q035:{q:'Yesterday you were halfway through debugging with Claude Code. The code has not changed and your earlier analysis still holds. What do you do?',
o:['Start a new session and paste in a summary','Use --resume <session-name> to resume the named session','fork_session','Redo the analysis from scratch'],
e:'When prior context is mostly still valid, --resume is the right mechanism for continuing across work sessions.',
w:{0:'Pasting a summary loses detail and is unnecessary while the original context is still valid.',2:'fork_session creates an independent branch for comparing approaches; it is not the normal way to continue one investigation.',3:'Repeating the analysis discards valid understanding and spends time and tokens rebuilding it.'}},

q036:{q:'Last week\'s session read 30 files and built up understanding, but a colleague has since refactored most of them. What is most reliable?',
o:['--resume the original session; Claude will notice the files changed','Start a new session with an injected structured summary, because the old tool results are stale','fork_session from the old session','Keep the old session and just mention "the code changed" in the prompt'],
e:'When prior tool results are stale, a new session plus a structured summary beats resuming — resume drags a pile of outdated file contents back in.',
w:{0:'Claude does not automatically invalidate old tool results.',2:'The baseline being forked is itself stale.',3:'The stale content stays in context and skews judgement.'}},

q037:{q:'After --resume, you find three files have changed. Best move?',
o:['Have the agent re-analyse the entire codebase','Tell the agent exactly which three files changed and request a targeted re-analysis','Ignore the changes and carry on','Abandon the session and start over'],
e:'Name the specific changed files and do a targeted re-analysis rather than starting from scratch.',
w:{0:'Re-analysing the whole codebase is wasteful when only three known files changed and discards still-valid understanding.',2:'Ignoring the changes lets conclusions rest on stale file contents and can produce incorrect fixes.',3:"Even when prior tool results are stale, the recommended approach is a new session with an injected structured summary, not starting with no context at all; here only three files changed, so targeted re-analysis is enough."}},

q038:{q:'What is fork_session for?',
o:['Resuming an interrupted investigation across work sessions','Creating an independent exploration branch from a shared analysis baseline, e.g. to compare two approaches','Running reviews in parallel in CI','Clearing context and starting over'],
e:'fork_session branches independent explorations from a shared baseline (comparing two refactoring or testing strategies).',
w:{0:"--resume continues one named session across work periods; comparing two approaches from a shared baseline instead requires fork_session branches.",2:'Not a CI parallelism mechanism.',3:"Clearing context starts a new session with no shared baseline; fork_session preserves the baseline and creates an independent exploration branch."}},

/* ═══ DOMAIN 2 ═══ */
q039:{q:'An agent frequently confuses analyze_content and analyze_document. Most direct effective fix?',
o:['Add three few-shot examples showing how to choose','Rename to remove the overlap, e.g. analyze_content → extract_web_results','Explain the difference in the system prompt','Merge the two tools into one'],
e:'Overlapping names confuse the model — rename to remove the overlap. That comes before few-shot (rule things out first).',
w:{0:'Few-shot is not a cure-all; naming problems get renamed.',2:"A system-prompt rule may reduce confusion, but the overlapping tool names remain; rename them first so each name communicates a distinct purpose.",3:'Merging creates an over-general tool and makes it worse.'}},

q040:{q:'Which four things should a good tool description contain?',
o:['Author, version, last updated, licence','What it does, what input format it takes, when to use it (example queries), when not to use it (its boundary against similar tools)','Return type, error codes, timeout, retry policy','Cost per call, average latency, concurrency limit, rate limits'],
e:'Tool descriptions drive LLM tool selection. The four elements: what it does / input format / when to use / when not to use.',w:{0:'Author, version, and licence are package metadata; they do not help the model decide whether this tool fits a task.',2:'Return types and failure behaviour are interface details but omit the crucial when-to-use and when-not-to-use boundaries.',3:'Cost and rate limits are operational constraints, not a substitute for purpose, input format, and selection boundaries.'}},

q041:{q:'Analysis shows that when a user query contains the word "report", the agent picks the wrong tool 78% of the time; otherwise it is fine. The tool descriptions have been reviewed and are clear and non-overlapping. What next?',
o:['Add few-shot examples for report scenarios','Check the system prompt for unintentional keyword-based routing instructions','Rename the tools','Reduce the number of tools'],
e:'Descriptions are fine but selection is systematically biased by a keyword — inspect the system prompt for accidental routing instructions.',
w:{0:'Few-shot may mask the symptom, but a systematic keyword effect calls for checking accidental system-prompt routing first.',2:"Renaming helps when names or descriptions overlap; both are clear here, and the report-specific error points to system-prompt routing instructions.",3:"Reducing tool count helps when the whole selection set is overloaded; this error occurs only on one keyword, which points to system-prompt routing bias."}},

q042:{q:'One analyze_document tool extracts data points, writes summaries and verifies claims, and the agent uses it inconsistently. Best fix?',
o:['Write a longer, more detailed description','Split it into extract_data_points + summarize_content + verify_claim_against_source','Set tool_choice: "any" to force a tool call','Add a PostToolUse hook to normalise the return format'],
e:'An over-general tool doing too much should be split into single-responsibility tools.',
w:{0:'No description can paper over mixed responsibilities.',2:'Forcing a call does not help it pick correctly.',3:"A PostToolUse hook transforms or normalises results after execution; the problem is one tool having three roles, so those roles should be split."}},

q043:{q:'log_workout accepts many parameter combinations and telemetry shows 23% of calls use invalid combinations (e.g. sets and reps sent for cardio). Best fix?',
o:['List every legal combination in the description','Split into log_cardio_workout + log_strength_workout, designing the invalid states away','Add validation and return an error so Claude retries','Add few-shot examples showing correct parameters'],
e:'Eliminate invalid states: a tool with many mostly-invalid combinations should be split.',
w:{0:"A description can document legal combinations but preserves invalid states and makes the model choose among them; splitting the tool removes those states.",2:'Remedial after the fact; still wastes calls.',3:'Probabilistic improvement; the design flaw remains.'}},

q044:{q:'An agent calls check_availability then book_appointment; occasionally the slot is taken in between and the booking fails. Best fix?',
o:['Auto-retry on failure','Merge into one atomic operation, find_and_book_appointment','Add a lock and shorten the interval between calls','Add a PostToolUse hook to detect the failure'],
e:'A race condition caused by a window between two steps is fixed by making the operation atomic.',
w:{0:'A retry can collide again.',2:'Shrinking the window does not remove it.',3:"A PostToolUse hook can detect the failed booking after the race has happened, but cannot close the time window; one atomic operation can."}},

q045:{q:'An agent pulls data from four APIs with different field names and shapes, and often mishandles them. Best approach?',
o:['Describe all four shapes in the prompt and let Claude adapt','Normalise inside the tool and return one uniform schema','Provide a few-shot example for each shape','Add a PreToolUse hook to validate arguments'],
e:'Uniform return schema: convert formats inside the tool and return one schema.',
w:{0:'Describing four formats in the prompt pushes conversion onto the model and leaves probabilistic mapping errors.',2:'Few-shot examples may improve adaptation but still make the model translate four incompatible shapes instead of giving it one deterministic schema.',3:'PreToolUse handles call inputs before execution and cannot normalize four different API response shapes.'}},

q046:{q:'A research agent has a fetch_url tool that can reach any URL, and audits show it occasionally pulls unrelated social-media pages. What satisfies least privilege?',
o:['List banned domains in the prompt','Replace it with a narrower tool such as load_document, which only loads document formats','Add a PostToolUse hook to filter results','Word the fetch_url description more strictly'],
e:'Least privilege: an over-broad tool invites misuse — replace it with a narrower one (fetch_url → load_document).',
w:{0:'A blocklist is incomplete and only probabilistic.',2:'The fetch already happened — wasteful and risky.',3:'A description is advice, not a restriction.'}},

q047:{q:'An agent is configured with 18 tools and telemetry shows tool-selection accuracy has dropped noticeably. Best action?',
o:['Write longer descriptions for every tool','Cut back to 4–5 tools relevant to that agent\'s role','Set tool_choice: "any"','Merge the 18 tools into 3 larger ones'],
e:'Too many tools degrades selection reliability — reduce to 4–5 role-relevant tools.',
w:{0:'Longer descriptions crowd the context instead.',2:'Forcing a call does not help it choose.',3:'Creates over-general tools and a surge of invalid states.'}},

q048:{q:'An MCP tool returns "Operation failed" for every kind of failure, so the agent keeps retrying business-rule violations. Best fix?',
o:['Cap the agent at two retries','Return structured errors: isError, errorCategory, isRetryable, and a human-readable description','Make the error message a bit more detailed','Add a PostToolUse hook to translate errors'],
e:'Structured MCP errors have four parts: isError / errorCategory (transient, validation, business, permission) / isRetryable / human-readable description.',
w:{0:'Still two pointless retries, and it hides the type distinction.',2:'Unstructured — the agent still has to guess.',3:'Translation does not answer "is this retryable".'}},

q049:{q:'For the error "refund exceeds policy limit", what should isRetryable be, and what should the agent do?',
o:['true; retry with exponential backoff','false; do not retry pointlessly — tell the user','true; try a different tool','false; skip silently and move on'],
e:'A business-rule violation is isRetryable: false — the agent should not retry, it should tell the user.',
w:{0:'No number of retries changes the rule.',2:'A different tool does not change the rule.',3:'Silent skipping is absolutely prohibited.'}},

q050:{q:'One search tool returns "0 results"; another returns "timeout". How should the coordinator treat them differently?',
o:['Both are failures; retry both','"0 results" is a successful query with no matches (a meaningful empty result); "timeout" means the query never completed (a failure requiring a retry decision)','Both are successes; continue synthesising','Escalate both to a human'],
e:'This distinction is heavily tested: 0 results ≠ timeout; they mean different things and drive different coordinator decisions.',
w:{0:'Retrying "0 results" is pointless.',2:'A timeout means a data gap; it is not a success.',3:"Human escalation fits policy gaps, subjective judgement, or high-risk actions; these two results have clear semantics the coordinator can handle directly."}},

q051:{q:'What are the typical values of errorCategory?',
o:['low / medium / high / critical','transient / validation / business / permission','read / write / execute / admin','info / warn / error / fatal'],
e:'errorCategory describes the failure type: transient, validation, business, permission.',w:{0:'Low through critical is a severity scale, not an errorCategory that explains cause and retryability.',2:'Read, write, execute, and admin describe operations or permissions, not failure categories.',3:'Info, warn, error, and fatal are logging levels, not business categories for agent error handling.'}},

q052:{q:'A database query times out and returns an error. What should isRetryable be?',
o:['false, because the query is faulty','true — a timeout is a transient error and can be retried','It depends on the query length','Omit the field and let the agent decide'],
e:'A timeout is transient → isRetryable: true. Contrast with a business-rule violation → false.',
w:{0:'A timeout does not mean the query itself is invalid.',2:"Query length is merely a request property and does not decide retryability; a timeout is a transient error, so isRetryable should be true.",3:'Omitting it sends you back to guessing — exactly what this avoids.'}},

q053:{q:'A document pipeline has five extraction schemas (invoice, contract, CV…) but you do not know the document type in advance. What should tool_choice be?',
o:['tool_choice: "auto"','tool_choice: "any"','tool_choice: {"type":"tool","name":"extract_invoice"}','Leave tool_choice unset'],
e:'"any" forces a tool call without fixing which one — exactly right for several schemas and an unknown document type.',
w:{0:'Under auto, Claude may skip the tool and emit free text.',2:'Forcing one schema will use the wrong one.',3:'Unset behaves like auto.'}},

q054:{q:'A workflow requires extract_metadata to be called first before any downstream processing. How do you configure the first turn?',
o:['tool_choice: "auto"','tool_choice: "any"','tool_choice: {"type":"tool","name":"extract_metadata"}','Write "please call extract_metadata first" in the prompt'],
e:'When you need deterministic output through a specific tool, name it in tool_choice.',
w:{0:"tool_choice: \"auto\" fits general conversation where Claude may skip tools; this workflow requires extract_metadata first, so auto is not deterministic.",1:"tool_choice: \"any\" guarantees some tool call and fits an unknown schema type; this workflow requires extract_metadata specifically, so any may choose wrongly.",3:'A prompt is probabilistic advice.'}},

q055:{q:'In a research system, one subagent needs simple fact verification 85% of the time but must queue back through the coordinator every time. Best optimisation?',
o:['Grant it all of the coordinator\'s tools','Give it a scoped tool such as verify_fact so it handles simple lookups itself, while complex verification still routes through the coordinator','Let it talk directly to other subagents','Remove the coordinator and go fully peer-to-peer'],
e:'Scoped tools: a narrow tool covers the high-frequency simple case; complex cases still go through the coordinator.',
w:{0:'Violates least privilege and inflates the tool count, hurting selection accuracy.',2:'Breaks hub-and-spoke.',3:"A fully peer-to-peer design removes the coordinator's control of communication, errors, and routing; this case only needs one scoped verification tool."}},

q056:{q:'What is the core value of MCP?',
o:['Automatic retries and rate limiting for tool calls','A standard interface: write one MCP server and every MCP-compatible AI application can connect to it — build once, reuse everywhere','A faster transport protocol than REST','Built-in authentication and secret management'],
e:'MCP\'s value is the standard interface. It does NOT provide automatic retries, auth/rate limiting, or a faster protocol.',w:{0:'Retries and rate limiting must be implemented by the client, server, or infrastructure; MCP does not supply them automatically.',2:'MCP provides an interoperable interface, not a guarantee of a transport faster than REST.',3:'Authentication and secret management remain responsibilities of the server and deployment environment, not built-in MCP hosting.'}},

q057:{q:'A team wants its MCP server configuration in version control so everyone shares it. Which file?',
o:['~/.claude.json','.mcp.json in the project root','.claude/CLAUDE.md','.claude/rules/mcp.md'],
e:'Project-level .mcp.json is the shared team configuration; user-level ~/.claude.json is personal.',w:{0:'~/.claude.json is personal user configuration, so it does not travel with the repository.',2:'CLAUDE.md holds project instructions and memory, not MCP server connection definitions.',3:'.claude/rules/ contains path-triggered instructions and is not the project MCP configuration file.'}},

q058:{q:'An MCP configuration needs an API key. Correct approach?',
o:['Put it directly in .mcp.json since the repository is internal','Use ${ENV_VAR} expansion — never hard-code secrets in configuration','Put it in CLAUDE.md with a "do not share" comment','Encrypt it and store it in .mcp.json'],
e:'Never hard-code secrets; use environment-variable expansion.',
w:{0:'Internal repositories leak and get forked too.',2:'Worse — CLAUDE.md is also version-controlled.',3:'The secret is still in the repo, and so is the way to decrypt it.'}},

q059:{q:'An agent needs to know what issue summaries, documentation hierarchies and database schemas exist internally, and currently burns many turns discovering them through exploratory tool calls. Which MCP capability solves this?',
o:['MCP tools','MCP resources — expose a content catalogue so the agent knows what data is available','MCP\'s automatic retry mechanism','MCP prompts'],
e:'MCP resources expose content catalogues (issue summaries, doc hierarchies, database schemas) so no exploratory calls are needed.',
w:{0:'Tools are the exploratory calls themselves.',2:'MCP does not provide automatic retries.',3:'Not for exposing data catalogues.'}},

q060:{q:'A team added an MCP server offering advanced code search, but the agent still prefers the built-in Grep. Most likely cause and fix?',
o:['The MCP server is too slow; optimise its performance','The MCP tool description is too thin for the agent to see it beats Grep — write a detailed description','Built-in tools have protocol-level priority over MCP tools and this cannot change','Disable Grep in allowedTools'],
e:'Thin MCP tool descriptions make the agent fall back to built-ins like Grep; write the description in detail.',
w:{0:'Selection is driven by the description, not latency.',2:'No such hard priority exists.',3:'Blunt disabling harms legitimate uses and leaves the description problem unsolved.'}},

q061:{q:'A team needs to integrate Jira (standard SaaS) and an in-house approval workflow. What is the recommendation?',
o:['Build both in-house for consistency','Use a community MCP server for Jira; build your own only for the in-house workflow','Look for community servers for both','Skip MCP and write plain tools'],
e:'Use community servers for standard integrations; build custom ones only for team-specific workflows.',
w:{0:"Building an MCP server is appropriate for a team-specific workflow; rebuilding the standard Jira integration duplicates existing community work.",2:'No community server will exist for a proprietary internal process.',3:'Throws away the reuse benefit of standardisation.'}},

q062:{q:'You need to find every place that calls calculateTax(). Which built-in tool?',
o:['Glob','Grep','Read','Bash'],
e:'Grep searches file contents — finding callers, locating error strings, tracing imports. Glob matches names and paths.',w:{0:'Glob matches file names and path patterns; it cannot directly locate calculateTax() calls inside file contents.',2:'Read retrieves one known file; when the caller locations are unknown, opening files one by one is inefficient.',3:'Bash could run a search command indirectly, but built-in Grep is the direct, controlled tool for content search.'}},

q063:{q:'You need to find every **/*.test.tsx file in the project. Which built-in tool?',
o:['Grep','Glob','Read','Write'],
e:'Glob matches file names and path patterns; finding **/*.test.tsx is the canonical case.',w:{0:'Grep searches file contents, while the task is to match a file-name and path pattern.',2:'Read opens a known file and cannot enumerate every path matching **/*.test.tsx.',3:'Write creates or modifies files and does not discover files whose paths match a pattern.'}},

q064:{q:'Edit keeps failing because the target text is not unique in the file. Best handling?',
o:['Keep extending old_string until it is unique','Read the whole file and Write it back','Use Bash and sed to substitute','Give up on modifying that file'],
e:'When Edit cannot find a unique anchor, fall back to Read + Write rather than fighting Edit.',
w:{0:'Inefficient and may still not be unique.',2:'Bypasses the tool layer and is risky.',3:"Giving up leaves the file unchanged and the task unfinished; when Edit cannot find unique text, Read the complete file and rewrite it with Write."}},

q065:{q:'What is the recommended strategy for understanding an unfamiliar large codebase?',
o:['Read every source file at once to build complete context','Grep for entry points → Read to follow the import chain → build understanding incrementally','Run tree in Bash to see the directory structure and stop there','Have Claude write a speculative architecture document first'],
e:'Exploration strategy: Grep for entry points, Read to follow imports, build up incrementally rather than reading everything (which blows up the context).',
w:{0:'Context explosion plus mountains of irrelevant material.',2:"tree shows names and directory structure, which helps orientation, but not code semantics or import relationships; Grep and Read are still needed.",3:"A speculative architecture document lacks code evidence and can turn guesses into facts; first find entry points with Grep and follow imports with Read."}},

/* ═══ D1 additions ═══ */
q164:{q:'A subagent keeps failing to reach an external data source. After retrying five times it gives up and returns an empty "nothing relevant found" report. The coordinator takes that at face value and moves on to synthesis. What is the underlying design fault?',
o:['The subagent disguised a failure as an empty result. Error handling belongs to the coordinator — the subagent should report the failure honestly and let the coordinator decide whether to retry, switch sources, or flag the gap','The retry count is too low and should be raised to 20','The coordinator should call that external source itself instead of delegating it','The subagent should contact another subagent to get the data'],
e:'In hub-and-spoke, the coordinator owns communication, error handling and information routing. A subagent that swallows failures and disguises them as empty results conflates "found nothing" with "never completed the lookup" — the coordinator loses the basis for its decision and the gap goes unflagged.',
w:{1:'No number of retries changes the fact that a failure is being disguised as an empty result, and retrying a genuinely unavailable source is pure waste.',2:'Pulling the work back into the coordinator forfeits specialisation and isolation, and still does not make failures visible.',3:'That violates hub-and-spoke — subagents should not talk to each other directly.'}},

q165:{q:'After collecting reports from four subagents, the coordinator concatenates all four verbatim and ships that as the final report. Users complain that one conclusion appears three times and two passages contradict each other. Which step did the coordinator skip?',
o:['Result aggregation — the coordinator\'s chain is decompose → delegate → aggregate → decide next step, and aggregation means de-duplicating and adjudicating conflicts, not concatenating','Task decomposition — it should have dispatched only one subagent to avoid duplication','Delegation — each subagent needed a longer system prompt','Nothing: duplication and contradiction are the inherent price of multi-agent architectures'],
e:'Aggregation is not concatenation: duplicate conclusions have to be collapsed and contradictions surfaced explicitly for the next step to handle. Concatenating just forwards the problem to the user.',
w:{1:'Parallelism is not the error, and collapsing to a single agent forfeits both parallelism and specialisation; the duplication here comes from missing aggregation (overlapping scope is a separate issue).',2:'Prompt length has nothing to do with the aggregation step.',3:'This is precisely what the coordinator exists to solve, not a cost to accept.'}},

q166:{q:'A team audits an unfamiliar codebase for performance problems using Dynamic Decomposition. Their approach: have the agent map the directory structure once, then generate all 40 subtasks up front and work through them. At subtask 12 they discover the real bottleneck sits in a module that never made the list — but the plan is already fixed. What went wrong?',
o:['The point of dynamic decomposition is that the plan keeps adjusting as dependencies surface — not that subtasks are frozen once mapping is done','Mapping the directory structure was wasted effort; they should have gone straight to file-by-file analysis','40 subtasks is too many; it should be under 10','They should have used Prompt Chaining — a fixed pipeline is more reliable'],
e:'An adaptive investigation plan is: map the structure → identify high-impact areas → produce a prioritised plan → keep adjusting it as dependencies surface. Freezing the list turns dynamic decomposition back into a fixed pipeline, which is guaranteed to miss whatever you could not foresee.',
w:{1:'Mapping is the first step of dynamic decomposition; without it there is no way to identify high-impact areas.',2:'The count is not the issue — 40 subtasks can be perfectly reasonable; the problem is that the list stopped adapting.',3:'A fixed pipeline is exactly the mode that cannot cope with the unknown, and this task does not know in advance what it will find.'}},

q167:{q:'A CI pipeline\'s PR review was split into a per-file local pass and a cross-file integration pass. To halve token spend the team merged them into one prompt: "find both local bugs and cross-file problems." Local bug detection then dropped noticeably. Why?',
o:['Merging back into a single pass reintroduces attention dilution — splitting into two passes exists precisely so each pass watches for one class of problem','CI machines lack the compute; they need a bigger runner','"Local" should come after "cross-file" in the prompt; the order is wrong','The two problem classes must be handled by two different models'],
e:'A single pass over a large PR dilutes attention, which is the whole reason the review was split into local and integration passes. The tokens saved by merging buy the dilution problem straight back.',
w:{1:'Nothing to do with compute; this is about how attention is allocated.',2:'Reordering the wording does not change the structural flaw of watching for two classes in one pass.',3:'One model running twice is enough — the fix is narrowing what each pass looks for, not using different models.'}},

q168:{q:'An investigation session has been idle for three weeks (the project was frozen and not a single line of the codebase changed). The team reasons "that is far too long, the context cannot still be fresh" and starts a new session from scratch. Is that judgement right?',
o:['No — the test is whether the tool results have gone stale, not how much time passed. The code never changed, so the old file contents are still valid and --resume is right','Yes — any session older than two weeks should be restarted','Yes — the longer the gap, the more inconsistent the model becomes','No — they should fork_session from the old session instead'],
e:'Choosing between --resume and a new session depends on whether the earlier tool results are still valid. The code did not change, so the earlier file reads are still accurate, and resuming is both cheapest and keeps the understanding already built. Elapsed time is not the test.',
w:{1:'There is no "expires after N days" rule; the test is whether the content has gone stale.',2:'Inconsistency comes from context being diluted over many turns within a session, not from calendar time while suspended.',3:'Forking is for branching two parallel explorations off one baseline; here they simply want to carry on with the same piece of work.'}},

});
