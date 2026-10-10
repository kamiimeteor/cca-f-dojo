/* Domain 2: q154–q177; option indices match questions.js. */
Object.assign(CONTENT_EN.questions, {
  "q154": {
    "q": "A retailer needs to classify a large volume of short product comments using clearly defined labels. It has no model baseline, faces tight cost and latency limits, and can upgrade if quality falls short. Which starting approach best fits?",
    "o": [
      "Start with Haiku 4.5 and test classification quality and latency on the retailer’s comments",
      "Start with Fable 5.1 and rely on its strongest reasoning for the comments",
      "Start with Opus 5.5, evaluate on actual comments, then consider moving to a lower tier",
      "Start with Sonnet 5.5 and choose the production tier from public benchmark test results"
    ],
    "e": "Clear rules, high volume, and tight limits favor an efficiency-first baseline. Actual quality failures can then justify an upgrade. See notes 2.1.",
    "w": {
      "1": "[Model substitution] The workload prioritizes efficiency; no demonstrated capability gap calls for the strongest reasoning tier.",
      "2": "[Model substitution] Evaluating on Opus 5.5 before stepping down is the capability-first path for uncertain, complex tasks; clear rules and tight cost and latency limits give no reason to start at that tier.",
      "3": "[Metric substitution] Public benchmark tests do not measure accuracy on these labels or latency in this application."
    }
  },
  "q155": {
    "q": "A hospital coding team is comparing models that assign diagnosis codes to discharge summaries. All candidates meet the same quality threshold, but the cheaper model requires more retries and staff review. Which comparison should guide the choice of the least costly configuration?",
    "o": [
      "Compare token charges for one successful call and total the resulting call bills",
      "Compare average time to first output and consider throughput changes",
      "Compare total spend per accepted task, counting retries and staff review",
      "Compare discharge records completed per batch and tally model call frequency"
    ],
    "e": "With quality held constant, cost per accepted task includes unsuccessful attempts and review. A lower token price can still lead to higher total expenditure. See notes 2.1.",
    "w": {
      "0": "[Metric substitution] The charge for one successful call omits failed attempts and staff costs incurred to reach that result.",
      "1": "[Metric substitution] Generation time measures waiting, not expenditure that includes staff review.",
      "3": "[Metric substitution] Counts and call frequency omit the prices of resources spent on each accepted result."
    }
  },
  "q156": {
    "q": "An engineering team is exploring a code migration with complex dependencies across modules. It first needs to establish whether acceptable quality is feasible; latency and budget permit a capability-first approach. Which experiment follows the usual recommended starting point?",
    "o": [
      "Begin with Haiku 4.5, test quality on actual migration tasks, then decide whether to upgrade",
      "Begin with Opus 5.5, refine the prompt, and evaluate before considering a lower tier",
      "Begin with Sonnet 5.5, assess it on actual migration samples, then choose the tier",
      "Begin with Fable 5.1, then keep subsequent migrations on the strongest capability tier"
    ],
    "e": "The capability-first path starts with Opus 5.5, then refines and evaluates the task before exploring lower effort or a cheaper tier. Fable 5.1 is a further option when demanding tasks still expose a capability gap. See notes 2.1.",
    "w": {
      "0": "[Model substitution] The scenario permits capability-first work and asks for the usual starting point; beginning on the fastest tier lacks support.",
      "2": "[Model substitution] Trying a middle tier before establishing the usual capability-first baseline lacks support.",
      "3": "[Model substitution] Fixing the strongest tier before testing the usual capability-first baseline lacks evaluation support."
    }
  },
  "q157": {
    "q": "A university timetabling assistant uses Opus 5.5 to detect schedule conflicts and meets its quality targets, but reasoning overhead is high. The team wants to evaluate effort changes while keeping the model and preserving performance on difficult cases. Which actions fit? Select 2.",
    "o": [
      "Try a lower effort setting and rerun the original evaluation set, including difficult cases",
      "Expand the scheduling history with more timetables from previous years",
      "Infer a fixed token allowance from the configured effort level and use it to evaluate the savings",
      "Evaluate overhead before and after the change by actual token usage and task quality",
      "Raise the effort setting and confirm on the original evaluation set that reasoning is more thorough"
    ],
    "e": "Effort is soft guidance, not a fixed token allocation. Once quality is acceptable, a lower setting can be evaluated using actual usage and the original task set. See notes 2.1.",
    "w": {
      "1": "[Unmeasured expansion] No evidence gap calls for earlier timetables, which increase input overhead without addressing the stated reasoning cost.",
      "2": "[Metric substitution] The setting is not measured usage, so an inferred fixed allowance cannot establish savings from soft guidance.",
      "4": "[Unmeasured expansion] Quality already passes; no identified failure justifies more reasoning effort, which also runs against the goal of lowering reasoning cost."
    }
  },
  "q158": {
    "q": "A public research team uses Opus 5.5 for difficult constraint analysis. After prompt refinement, evaluations at xhigh and max still fail its quality threshold; Fable 5.1 passes the same task set within the project’s latency and total-cost limits. Which configuration should the next release use?",
    "o": [
      "Keep Opus 5.5 at max, add supporting analysis material, and then run a regression on the original task set",
      "Run Sonnet 5.5 at max to benefit from its lower standard input price",
      "Move to Haiku 4.5 and evaluate the release by its fastest relative latency",
      "Switch to the more capable Fable 5.1 and use the original task set as a regression suite"
    ],
    "e": "Opus 5.5 still has a capability gap after refinement and high-effort evaluation. The measured Fable 5.1 configuration meets the project constraints, supporting the switch. See notes 2.1.",
    "w": {
      "0": "[Unmeasured expansion] The evaluation identifies a capability gap, not missing material; extra material has no demonstrated benefit, and the regression still runs on the failing configuration.",
      "1": "[Model substitution] A lower input price does not establish that Sonnet 5.5 passes these difficult tasks.",
      "2": "[Model substitution] Relative latency does not establish that Haiku 4.5 meets the required quality threshold."
    }
  },
  "q159": {
    "q": "A store’s after-sales drafting assistant cites facts correctly, but its tone varies between promotional copy and legal correspondence. The system message only says “You are an expert”; the team needs concise, neutral customer communication. What should it change first?",
    "o": [
      "Specify a more concrete after-sales role and tone in the system message",
      "Attach past correspondence from several departments as tone references",
      "Switch to a more capable model and keep the current system role description",
      "Add a style-planning agent to negotiate the tone of individual responses"
    ],
    "e": "The facts are sound; the role and tone are underspecified. A concrete system instruction directly expresses the required communication style. See notes 2.2.",
    "w": {
      "1": "[Unmeasured expansion] Correspondence from different departments adds competing styles without defining this role’s tone.",
      "2": "[Model substitution] A model change has no demonstrated benefit for an underspecified role.",
      "3": "[Overengineering] A fixed tone can be specified directly; per-request negotiation adds unnecessary orchestration."
    }
  },
  "q160": {
    "q": "A school uses Claude to turn staff-meeting remarks into minutes. Its prompt mixes example remarks with the current meeting’s remarks, and the minutes occasionally include course names from an example; name extraction passes separate tests. Which adjustment most directly addresses this?",
    "o": [
      "Include more sample minutes so common course names recur throughout the input",
      "State at the top of the prompt that example names must not be copied, keeping the current concatenation",
      "Set up a minutes-review agent to check course names in the generated minutes",
      "Enclose the examples and the current remarks in XML tags that identify their purposes"
    ],
    "e": "The prompt confuses the purposes of its inputs. Consistent, meaningful tags distinguish the format to imitate from the content to record. See notes 2.2.",
    "w": {
      "0": "[Unmeasured expansion] More examples leave the purpose ambiguity intact and add names that can be misattributed.",
      "1": "[Wrong-layer diagnosis] A prohibition does not mark which text is an example and which is current input; the mixed structure remains.",
      "2": "[Overengineering] Review orchestration still receives the mixed input and adds agents for a boundary that can be labeled directly."
    }
  },
  "q161": {
    "q": "A finance team extracts expense_type and evidence from reimbursement notes, and the response format is stable. When a note omits the purpose, the model often guesses a category; the team accepts unknown values and wants supported results retained. Which prompt change fits best?",
    "o": [
      "Include similar reimbursement notes and require categories to cite evidence from them",
      "Specify unknown for missing evidence and require a supporting passage for each category",
      "Move to a more capable model and retain the existing category and field instructions",
      "Specify the format of the returned fields and evaluate extraction quality by field completeness"
    ],
    "e": "The task allows unknown values, so the output contract should specify how to handle insufficient evidence. A populated field is not necessarily a supported classification. See notes 2.2.",
    "w": {
      "0": "[Unmeasured expansion] Evidence from other notes cannot establish this note’s purpose; similar claims only add categories the model can borrow.",
      "2": "[Model substitution] The missing element is an unknown-value rule; no evaluation supports a model switch as the remedy.",
      "3": "[Metric substitution] The format is already stable; field completeness measures structure, not whether evidence supports the category."
    }
  },
  "q162": {
    "q": "A government assistant extracts information from submitted forms and uses a tool to read records the applicant may access. Forms can contain embedded instructions, and the service does not yet check resource ownership on each record request. Which changes address both input interpretation and access enforcement? Select 2.",
    "o": [
      "State record-ownership rules in the system message and have the model compare them before requesting a read",
      "Place submitted forms in an explicit data slot and define the trust boundary for embedded instructions",
      "Check ownership after reading and alert on mismatches",
      "Add human confirmation to the general record reader while reusing its existing access configuration",
      "Validate identity and ownership for each read at the tool endpoint and reject unauthorized requests"
    ],
    "e": "The template should identify external material as data. The execution endpoint must enforce resource access, addressing a separate responsibility from prompt structure. See notes 2.2.",
    "w": {
      "0": "[Prompt as enforcement] A natural-language instruction does not enforce resource permissions at the execution endpoint.",
      "2": "[Audit as prevention] A read has already disclosed data by the time the alert runs; a later check does not enforce access.",
      "3": "[Guarding excess capability] The reader retains access this task does not need; confirmation does not remove excess capability."
    }
  },
  "q163": {
    "q": "A support platform stores a template with stable reply-writing rules and a {{case_text}} slot. Captured requests still contain the literal placeholder, so the model never receives the ticket text; the rules have been validated separately. What should be fixed first?",
    "o": [
      "Ask the model to recognize the placeholder and recover the ticket text from its variable name",
      "Expand the example set with tickets from neighboring categories",
      "Check the app’s template rendering and insert this ticket’s text into the outgoing request",
      "Switch to a model suited to code understanding and retain the current template assembly order"
    ],
    "e": "The application substitutes template variables. If the request lacks the ticket text, request construction must be fixed; a variable name does not provide the missing data. See notes 2.2.",
    "w": {
      "0": "[Wrong-layer diagnosis] Template rendering belongs to the application; the model cannot supply data that was never passed in.",
      "1": "[Unmeasured expansion] Additional tickets do not supply the current ticket and do not fix request construction.",
      "3": "[Model substitution] A different model still receives the same empty slot; greater capability does not supply the missing data."
    }
  },
  "q164": {
    "q": "A hospital administration team needs to turn de-identified equipment-maintenance notices into registration summaries. The required fields and wording rules can be stated directly, and the team has no prompt baseline. Which approach uses the fewest components to find out whether those rules are sufficient?",
    "o": [
      "Build drafting and review agents, then merge their output",
      "List the requirements in the prompt, then test a baseline without examples",
      "Expand the example set with common notices first, then evaluate the few-shot prompt",
      "Increase the current model’s reasoning effort to generate a more detailed rewriting process"
    ],
    "e": "Explicit rules and no established failure pattern favor a zero-shot baseline. Its results can identify whether examples or a more involved workflow are needed. See notes 2.3.",
    "w": {
      "0": "[Overengineering] This fixed-format rewriting task has no demonstrated need for review orchestration, which complicates the baseline.",
      "2": "[Unmeasured expansion] No wording or boundary gap has been identified; adding examples before evaluating obscures whether the rules alone suffice.",
      "3": "[Unmeasured expansion] No complex reasoning failure justifies extra effort before evaluating the stated rules."
    }
  },
  "q165": {
    "q": "A product-review classifier’s examples all contain clear praise, and ordinary positive reviews pass testing. Polite comments about returned products are often misclassified as positive; the team can change only the few-shot examples while keeping the rules and model fixed. Which revision is best supported?",
    "o": [
      "Add clear-praise examples, expanding coverage of product names and review lengths",
      "Add reasoning text to the examples, expanding explanations of the existing positive reviews",
      "Add contrasting examples of polite negative reviews and similar positive reviews, expanding boundary coverage with ideal categories",
      "Add examples from common support topics, expanding coverage to shipping and promotion inquiries"
    ],
    "e": "The failures concern the boundary between polite wording and actual sentiment. Relevant contrasting inputs with ideal labels teach that distinction while preserving ordinary-case coverage. See notes 2.3.",
    "w": {
      "0": "[Unmeasured expansion] More names and lengths do not cover the identified boundary around polite negative reviews.",
      "1": "[Unmeasured expansion] Existing positive cases pass; longer explanations do not add the missing ambiguous class.",
      "3": "[Unmeasured expansion] Other support topics do not address the classification failure and add irrelevant input."
    }
  },
  "q166": {
    "q": "A financial research team is testing complex reasoning on Haiku 4.5, whose logs show the default thinking behavior. It wants to keep that model and compare manual extended thinking with the baseline. Which request settings belong in this experiment? Select 2.",
    "o": [
      "Set type: enabled in the thinking object to turn on manual extended thinking",
      "Set output_config.effort to high for this model",
      "Set type: adaptive in the thinking object so the model determines its reasoning effort",
      "State at the end of the prompt that analysis should proceed step by step, keeping the current thinking configuration",
      "Provide budget_tokens in the thinking object to configure the manual reasoning budget"
    ],
    "e": "Haiku 4.5 defaults to thinking off. Manual extended thinking uses type: enabled with budget_tokens; a request for step-by-step analysis does not enable API thinking. See notes 2.3.",
    "w": {
      "1": "[Wrong-layer diagnosis] Haiku 4.5 does not support effort, so this field cannot configure its manual thinking mode.",
      "2": "[Wrong-layer diagnosis] This model supports manual extended thinking, not the adaptive configuration.",
      "3": "[Wrong-layer diagnosis] A step-by-step instruction works at the prompt layer; it does not change the API thinking configuration or enable manual thinking."
    }
  },
  "q167": {
    "q": "A developer-tool team has moved to Sonnet 5.5 and wants to remove reasoning before tool use while allowing progress updates between tools. Its request combines between_tools with xhigh and additional thinking fields, producing a configuration error. Which changes fit this mode? Select 2.",
    "o": [
      "Change the thinking type to disabled and leave effort at xhigh",
      "Keep between_tools and set effort to low, medium, or high",
      "Set thinking to adaptive and continue testing at xhigh",
      "Remove the other thinking fields that the between_tools mode does not accept",
      "Leave the mode and effort unchanged and expand the tool-use examples in the request"
    ],
    "e": "Sonnet 5.5 accepts between_tools only at low, medium, or high, with no other thinking fields. Disabled returns 400, while adaptive does not meet the requested removal of upfront reasoning. See notes 2.3.",
    "w": {
      "0": "[Wrong-layer diagnosis] Sonnet 5.5 rejects disabled, so this change still uses an unsupported configuration.",
      "2": "[Wrong-layer diagnosis] Adaptive is a different reasoning mode and does not meet the requirement to remove upfront reasoning.",
      "4": "[Unmeasured expansion] The error concerns configuration compatibility, not example coverage; more examples do not repair the fields."
    }
  },
  "q168": {
    "q": "An assessment team first extracts rubric items and then generates marking guidance. Code can validate the extracted items, and the business requires generation to wait until that validation passes. Which prompting workflow also makes failures traceable to a stage?",
    "o": [
      "Chain extraction and drafting calls with a programmatic validation gate for the handoff",
      "State the extract-then-draft order in a single prompt and return a combined result",
      "Call extraction and drafting in parallel, then validate both results against the item format",
      "Have the model check the items itself and continue with full guidance in the same call if they pass"
    ],
    "e": "Programmatically verifiable intermediate output and a required gate favor prompt chaining. The application validates extraction before deciding whether to invoke drafting. See notes 2.3.",
    "w": {
      "1": "[Prompt as enforcement] An instruction within one call cannot give the application an enforceable check before drafting starts.",
      "2": "[Audit as prevention] Validating after drafting has run replaces the programmatic gate required before drafting starts.",
      "3": "[Prompt as enforcement] The model’s own judgment is not the required programmatic validation gate."
    }
  },
  "q169": {
    "q": "A regulation-comparison assistant is about to send a long request containing statutory text, a system message, tool definitions, and earlier tool results. Its model and input formats are supported by token counting, and the team needs to check whether there is room for this turn’s output. Which check fits?",
    "o": [
      "Count the full input for the target model and compare that estimate with window capacity",
      "Estimate total usage from document character counts and use that count for the capacity check",
      "Count input that misses the cache and check remaining capacity after excluding the repeated prefix",
      "Count the full input for the target model and reserve space for generation"
    ],
    "e": "Input and the current output share the context window. System content, tool definitions, and tool results all count; the input estimate must leave room for generation. See notes 2.4.",
    "w": {
      "0": "[Metric substitution] Input counting omits this turn’s output budget; the capacity comparison must reserve space for generation.",
      "1": "[Data-shape mismatch] Characters do not map to tokens at a fixed rate, so character counts cannot reliably measure model-specific usage.",
      "2": "[Metric substitution] Billable uncached input is not context occupancy; cached content still takes window space."
    }
  },
  "q170": {
    "q": "A medical-record archiving application is adding capacity checks. One request references a PDF by URL; another uses an MCP connector, and token counting rejects these input forms. The source material must remain intact. Which actions support a useful usage assessment? Select 2.",
    "o": [
      "Supply the PDF as supported base64 input and count it for the target model",
      "Count the URL string’s tokens to estimate document usage",
      "Check actual usage for requests with unsupported inputs and document the limits of preflight coverage",
      "Check the client-tool definition count and use it to sign off on the connector request’s capacity",
      "Generate a short PDF summary and enter its count in the original request’s capacity record"
    ],
    "e": "Token counting rejects URL/file document sources but accepts a PDF supplied as base64. MCP connectors are unsupported, so actual usage must inform checks whose preflight coverage is incomplete. See notes 2.4.",
    "w": {
      "1": "[Data-shape mismatch] The encoded length of a URL is not the input representation of the document it points to.",
      "3": "[Metric substitution] Client-tool counts do not cover MCP connector requests; a partial count cannot establish total capacity.",
      "4": "[Metric substitution] The summary count measures a different, shorter input rather than the original request that must be retained."
    }
  },
  "q171": {
    "q": "A financial research assistant compares several long reports already present in its context. The prompt starts with the question, and source identifiers are mixed into report text; the team wants better cross-document answers without evidence that any reports are missing. Which revision best fits?",
    "o": [
      "Expand the report collection in context with related material from previous years",
      "Add source labels in context, place the long reports before the question, and extract evidence before answering",
      "Tag the reports by length band and allocate answer length by band",
      "Compress each report into an equally long summary and check source coverage using summary word counts"
    ],
    "e": "Long documents first, a final question, and explicit sources with evidence extraction are a recommended structure to evaluate. The benefit still needs measurement on this task. See notes 2.4.",
    "w": {
      "0": "[Unmeasured expansion] The reports are already available; additional history does not address source labeling or question placement.",
      "2": "[Metric substitution] Report length does not indicate relevance to the question, so allocating answers by length band uses the wrong measure.",
      "3": "[Metric substitution] Equal summary length does not establish that essential evidence and cross-document differences survived."
    }
  },
  "q172": {
    "q": "A debugging assistant is nearing its context limit, largely because of obsolete tool outputs. Its decisions and open tasks remain relevant, the client must retain the complete record, and the environment supports server-side context editing. Which treatment is most targeted?",
    "o": [
      "Replace the whole early conversation with a summary of both tool outputs and task state",
      "Remove early messages chronologically and retain the latest tool output for further analysis",
      "Clear obsolete tool results selectively and leave the conversation stored on the client unchanged",
      "Cache earlier tool output and evaluate the capacity change by input reuse rate"
    ],
    "e": "Context editing can selectively clear obsolete tool results while the client keeps the full record. This is more targeted than summarizing the entire history when task state remains relevant. See notes 2.4.",
    "w": {
      "0": "[Wrong-layer diagnosis] Whole-history summarization affects more than necessary when the obsolete tool results are already identified.",
      "1": "[Data-shape mismatch] Chronological position does not identify relevance; age-based deletion also affects decisions still needed.",
      "3": "[Metric substitution] Input reuse measures caching benefits, not whether obsolete results occupy less context space."
    }
  },
  "q173": {
    "q": "A municipal statistics office uses Sonnet 5.5, with thinking left in its default adaptive mode, to generate a long commentary on its statistical yearbook in one request. The body text is expected to run well beyond 128K tokens, and input counting shows plenty of context capacity left. The team must revise the generation plan before sending. Which actions fit? Select 2.",
    "o": [
      "Set the maximum output from the context space still free and generate the full text in a single request",
      "Switch to Haiku 4.5 for faster output and generate the full text in a single request",
      "Plan section lengths within the ordinary per-request output limit and use several requests to continue the text",
      "Enable server-side compaction to shrink input and free context space for the answer",
      "Reserve part of each request’s output budget for thinking, leaving body text below the limit"
    ],
    "e": "Context capacity is not an output allowance: an ordinary Sonnet 5.5 request can output at most 128K tokens, and current-turn thinking also uses that budget. Generate the text in sections and leave room for thinking. See notes 2.4.",
    "w": {
      "0": "[Metric substitution] Remaining context capacity is not an output allowance; the per-request output limit still caps the response.",
      "1": "[Model substitution] Haiku 4.5 has a lower per-request output limit, so switching models cannot fit the full text in one request.",
      "3": "[Wrong-layer diagnosis] Context capacity is already sufficient; the constraint is the output limit, which compacting input does not raise."
    }
  },
  "q174": {
    "q": "A textbook team reuses role instructions, terminology rules, and output contracts across several tasks. Results regressed after a module changed, but the team cannot identify the assembled modules in production and needs to restore the previous behavior quickly. Which maintenance approach fits?",
    "o": [
      "Fix the assembly order, record versions, gate changes on regression results, and keep a rollback configuration",
      "Cache the latest module text and check prompt reuse through cache-read volume",
      "Assign a persistent agent to each module and let a coordinator negotiate the rules for the current request",
      "Run regression evaluations on readability scores and judge module updates by the score changes"
    ],
    "e": "Deterministic assembly and version records make a request traceable. Regression evaluation and a retained configuration allow rollback when behavior deteriorates; caching does not manage module versions. See notes 2.5.",
    "w": {
      "1": "[Wrong-layer diagnosis] Cache reads concern input reuse and do not supply assembly versions or rollback records.",
      "2": "[Overengineering] Shared instruction modules do not require resident agents; negotiation does not solve version tracking.",
      "3": "[Metric substitution] Readability does not establish compliance with terminology and task rules or identify the regressed version."
    }
  },
  "q175": {
    "q": "A hospital administration assistant repeatedly sends an identical 512-token prefix to Haiku 4.5, but no cache is written and no error is reported. Sonnet 5.5 has passed the task’s quality, latency, and total-cost checks. The team wants to cache the prefix without changing its text. Which change is supported?",
    "o": [
      "Change the prefix’s cache TTL to one hour while still sending to Haiku 4.5",
      "Add the administration handbook to lengthen the prefix and keep sending to Haiku 4.5",
      "Count repeated Haiku 4.5 requests and evaluate cache effectiveness from that count",
      "Switch to Sonnet 5.5 and set a cache breakpoint on the same prefix"
    ],
    "e": "Haiku 4.5 requires at least 4,096 tokens for caching, while Sonnet 5.5 requires 512. A shorter prefix is not cached and produces no error; the existing task evaluation supports switching to the model whose threshold it meets. See notes 2.5.",
    "w": {
      "0": "[Wrong-layer diagnosis] TTL controls retention, not the minimum cache length; the prefix would still be too short.",
      "1": "[Compliance shortcut] Adding the handbook changes a prefix that must stay verbatim, bypassing a stated constraint to obtain caching.",
      "2": "[Metric substitution] Repetition counts are not cache writes or reads and do not establish that the threshold is met."
    }
  },
  "q176": {
    "q": "A financial-policy assistant has successfully written a prefix cache with the default TTL, and its requests take a long time to finish generating. Operations needs to schedule reuse and account for a cache hit’s effect on expiry. Which timing rule should it use?",
    "o": [
      "Count the default five minutes from response completion, restarting after a cache-hit response completes",
      "Count five minutes from the first write request, keeping that original deadline after later hits",
      "Count the default five minutes from request start; a hit refreshes it at no extra charge",
      "Count a default hour from the start of a read or write request, refreshing that period on a hit"
    ],
    "e": "Cache TTL starts when a read or write request begins. Hits refresh it without a separate refresh fee, so a long response’s completion time is not the starting point. See notes 2.5.",
    "w": {
      "0": "[Metric substitution] Using response completion as the clock origin overestimates the remaining TTL.",
      "1": "[Metric substitution] The original deadline omits later refreshes and can underestimate the period available for reuse.",
      "3": "[Metric substitution] This cache uses the default TTL; calculating an hour overestimates its available lifetime."
    }
  },
  "q177": {
    "q": "An inventory-reconciliation Skill has a working script executed by the client; the model only needs to explain its results. The script currently prints a completion marker, and trials show the explanation lacks locations for discrepant records, although the calculation has passed validation. Which changes fit? Select 2.",
    "o": [
      "Run the existing script and pass its output into context for the model’s explanation",
      "Expand the request context with the script source and its dependency files",
      "Add the inventory source-file paths to context so the explanation can cite where discrepant records come from",
      "Expand the script output so discrepant records and their locations enter context for the explanation",
      "Use a more capable model to read the completion marker and retain the current script output"
    ],
    "e": "When a Skill script runs, its output enters context; the code itself need not. Since the missing information is known, the output should include the discrepancies and locations needed for the explanation. See notes 2.5.",
    "w": {
      "1": "[Unmeasured expansion] The model needs execution results; source code and dependencies do not supply this run’s discrepancies.",
      "2": "[Data-shape mismatch] File paths locate data files, not which records differ or where; the script output must supply those results.",
      "4": "[Model substitution] The completion marker lacks discrepancy data; a stronger model cannot read results the script never emitted."
    }
  }
});
