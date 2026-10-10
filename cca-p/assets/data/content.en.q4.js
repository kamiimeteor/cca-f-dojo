/* Domain 4: q071-q099; indices match questions.js. */
Object.assign(CONTENT_EN.questions, {
  "q071": {
    "q": "A bank evaluates an assistant that checks fee explanations. Some difficult cases in the new evaluation are still awaiting scores. How should the team report accuracy while making the coverage of that result visible?",
    "o": [
      "Report confirmed correct cases over all requests, counting unscored cases as errors",
      "Report completion among requests that returned explanations, broken down by difficulty",
      "Report accuracy on scored cases, unscored-case ratio, and results by difficulty",
      "Measure explanation quality by format pass rate, listing pending cases separately"
    ],
    "e": "Use scored cases as the accuracy denominator and report the proportion of unscored cases separately. Difficulty breakdowns expose gaps caused by a backlog of harder cases. See notes 4.1.",
    "w": {
      "0": "[Metric substitution] Unscored cases are not confirmed errors. This measures confirmed-correct coverage, not accuracy among scored cases.",
      "1": "[Metric substitution] Returning an explanation does not establish that its fee information is correct.",
      "3": "[Metric substitution] Format validity does not measure whether the explanation is accurate."
    }
  },
  "q072": {
    "q": "A hospital adds filtering to its nonclinical information assistant. Harmful replies decrease, but ordinary visiting-hours questions are refused more often; the evaluation set already identifies answerable requests. Which metric captures the loss of legitimate service?",
    "o": [
      "Assess service loss by dividing mistaken refusals by the answerable-request count, using existing labels",
      "Assess refusals among all requests, breaking results down by topic",
      "Assess harmful replies among reviewed outputs and retain review records",
      "Assess repeat questions from refused users and compare the filter versions"
    ],
    "e": "Overrefusal measures mistaken refusals within the set of answerable requests. The existing labels support that calculation. See notes 4.1.",
    "w": {
      "1": "[Metric substitution] Overall refusal rate mixes justified and mistaken refusals and uses the wrong denominator.",
      "2": "[Metric substitution] Harmful-output rate captures output risk, not the loss from refusing answerable requests.",
      "3": "[Metric substitution] Repeat requests depend on user behavior and do not identify unjustified refusals."
    }
  },
  "q073": {
    "q": "A retailer tests whether malicious instructions in product material can make an assistant read restricted purchasing records in an isolated environment. Replies from every version remain polite. Which arrangements support a comparison of actual attack effectiveness? Select 2.",
    "o": [
      "Measure the attack success rate as achieved goals divided by valid test attempts",
      "Measure attack success by the frequency of risky words in replies across versions",
      "Check response status and count normal returns as security passes",
      "Check that attack cases, permissions, and success criteria remain consistent",
      "Expand attack testing with cases chosen by the on-duty reviewer, then report version scores"
    ],
    "e": "Security evaluation tracks whether the attack goal was achieved under a consistent test set, permission environment, and denominator. Polite wording and normal responses do not establish that access restrictions held. See notes 4.1.",
    "w": {
      "1": "[Metric substitution] Unauthorized reads may contain no risky vocabulary; word frequency does not measure the attack goal.",
      "2": "[Metric substitution] A normal response status says nothing about access to restricted records.",
      "4": "[Unmeasured expansion] Adding reviewer-selected attacks without identifying a coverage gap does not establish a fixed attack set for comparing versions."
    }
  },
  "q074": {
    "q": "A software company is calculating cost per successful task for an automated repair trial. No patch passed acceptance, although model calls and human reviews incurred costs. How should finance retain the expense without reporting a misleading unit cost?",
    "o": [
      "Record total spending and submitted patches, reporting their ratio as cost per success",
      "Divide this trial's model and staff spending by call count and report cost per success",
      "Allocate this spending to successful patches from the previous trial and report a cross-trial unit cost",
      "List this trial's failed-task spending separately; record its cost per successful task as not applicable"
    ],
    "e": "With zero successful tasks, a finite cost per success is undefined. Report the failed-task expenditure for this window, including model and review costs. See notes 4.1.",
    "w": {
      "0": "[Metric substitution] Submitted patches are not successfully accepted tasks.",
      "1": "[Metric substitution] Spending is fully included, but call count is not the number of successful tasks.",
      "2": "[Metric substitution] Borrowing successes from a different window conceals the zero-success outcome of this trial."
    }
  },
  "q075": {
    "q": "A university is preparing acceptance criteria for a dissertation-summary assistant whose current goal is simply to be more reliable. Departments use different task mixes and score denominators. What should the team do first to make the next evaluation reproducible and comparable?",
    "o": [
      "Compare existing total scores by department, recording rankings and versions",
      "Agree on population, scoring denominator, and targets; assess groups over a fixed window",
      "Expand departmental summary test sets while retaining their current scoring methods",
      "Pause comparisons across departments and report launch readiness from completed evaluation rounds"
    ],
    "e": "Reproducible acceptance requires a defined population, scoring rules, denominator, targets, and window. Compare task groups after agreeing on those definitions. See notes 4.1.",
    "w": {
      "0": "[Metric substitution] Rankings based on incompatible denominators and task mixes do not establish comparable quality criteria.",
      "2": "[Wrong-layer diagnosis] The defect is in metric definitions and incompatible denominators; increasing the evaluation set does not repair them.",
      "3": "[Metric substitution] The number of completed evaluation rounds does not measure readiness against quality requirements."
    }
  },
  "q076": {
    "q": "An archive evaluates a generator whose records require specified fields but allow several valid prose descriptions. The team has a field specification and expert-scored examples. Which arrangements belong in a repeatable mixed-method evaluation? Select 2.",
    "o": [
      "Use exact matches against the reference description to score prose quality",
      "Use code to check required fields and value types, retaining each structural result",
      "Use the ratio of description length to required-field count to score prose quality",
      "Use a multistage review process to negotiate field types before producing structural scores",
      "Use a dimensional rubric for prose quality and calibrate model scores with expert examples"
    ],
    "e": "Code checks suit explicit structural requirements. Open prose needs rubric-based assessment calibrated against human judgment, with separate results for diagnosis. See notes 4.2.",
    "w": {
      "0": "[Data-shape mismatch] Exact matching penalizes valid descriptions when several phrasings are acceptable.",
      "2": "[Metric substitution] Length per required field does not measure the accuracy or completeness of the prose.",
      "3": "[Overengineering] The field specification already supports direct validation; a multistage review to negotiate field types adds no needed judgment."
    }
  },
  "q077": {
    "q": "An insurer's fixed query workflow misses new leads, while a trial investigation agent can choose follow-up read-only tools as leads emerge. Experts have confirmed that several of its query sequences produce valid findings and respect access restrictions. Which evaluation setup should accompany adoption of this design?",
    "o": [
      "Check tool order and state records against the expert demonstration, scoring their agreement",
      "Adopt the agent and evaluate it in an isolated environment, scoring outputs and final state and inspecting traces",
      "Score investigation quality by tool coverage and record the evaluation results",
      "Judge completion by report detail and retain the report text"
    ],
    "e": "The fixed workflow misses leads, while the candidate agent has produced valid results through adaptive paths, supporting its adoption. Evaluate outputs and outcomes, then inspect traces for access constraints and intermediate behavior; a single demonstration is not the only valid sequence. See notes 4.2.",
    "w": {
      "0": "[Data-shape mismatch] A fixed demonstration sequence rejects other valid paths through a dynamic investigation.",
      "2": "[Metric substitution] Tool coverage does not establish that the findings or final state satisfy the task.",
      "3": "[Metric substitution] Detailed prose can accompany incorrect findings and does not establish the environment outcome."
    }
  },
  "q078": {
    "q": "A hospital uses a model to compare patient education materials that human reviewers sometimes rate equally. When candidate order changes, the model repeatedly favors whichever candidate appears first. What is the best next check?",
    "o": [
      "Have reviewers check required fields and accept the grader when the materials pass those checks",
      "Pause candidate-order swaps and accept the grader based on repeatability in the original order",
      "Restore the materials to the same layout and judge grader bias by presentation consistency",
      "Check both candidate orders against human labels, using a fixed rubric for repeated comparisons"
    ],
    "e": "Comparing both orders against human labels tests position bias. Holding the rubric fixed keeps a change in scoring criteria from confounding that check. See notes 4.2.",
    "w": {
      "0": "[Metric substitution] Valid candidate structure does not establish that the grader is free of position bias.",
      "1": "[Metric substitution] Repeatability in one order can consistently reproduce the same position bias.",
      "2": "[Metric substitution] Consistent presentation does not measure whether candidate position affects the scores."
    }
  },
  "q079": {
    "q": "A retailer tests whether its assistant calls a promotions tool when needed. Every current case requires a lookup, yet the assistant also calls the tool for ordinary product descriptions. How should the evaluation set be expanded? Select 2.",
    "o": [
      "Add paired cases labeled for lookup or direct answering",
      "Expand promotion cases requiring lookups and report tool-call coverage",
      "Expand the held-out test set, managing it separately from prompt-tuning examples",
      "Build a multistage classification review to decide which requests enter evaluation",
      "Repeat promotion-lookup cases to enlarge the existing test set"
    ],
    "e": "Paired positive and negative cases expose unnecessary calls. Keeping a held-out set separate from tuning examples tests behavior beyond the cases used to improve the prompt. See notes 4.2.",
    "w": {
      "1": "[Metric substitution] Coverage on required lookups still does not measure unnecessary calls.",
      "3": "[Overengineering] The missing requirement is test cases where no tool is needed; extra review stages do not supply those cases.",
      "4": "[Unmeasured expansion] Repeating existing lookup-required cases does not add cases where the tool should not be called."
    }
  },
  "q080": {
    "q": "A software team gets widely varying scores when repeatedly evaluating a file-organizing agent. Some trials start in a directory already organized by a previous run. How should the repeated evaluation estimate the agent's actual chance of success?",
    "o": [
      "Create independent agent runs, resetting the directory for each trial to measure single-run success rate",
      "Keep the previous agent run's directory state and measure cumulative completion",
      "Expand the same model's reasoning budget and repeat trials using the current directory",
      "Reset the score log and start a fresh set of trials using the current directory"
    ],
    "e": "Reset the environment for every trial and hold the task and scoring criteria fixed. Repeated independent runs then measure variability from the same starting conditions. See notes 4.2.",
    "w": {
      "1": "[Metric substitution] Cumulative completion across dependent runs is different from success in an independent trial.",
      "2": "[Unmeasured expansion] More reasoning does not remove the confounding change in the starting environment.",
      "3": "[Wrong-layer diagnosis] Clearing the score log does not reset the working directory changed by the previous run."
    }
  },
  "q081": {
    "q": "A learning platform is comparing two tutoring prompts online after both passed offline regression tests. Students often ask follow-up questions within a session. How should eligible traffic be assigned to avoid mixing versions within one learning task?",
    "o": [
      "Randomize versions for each request, including follow-ups",
      "Keep fixed subject groups, assigning separate subjects to the control and treatment prompts",
      "Randomize sessions and keep follow-up questions on the assigned version",
      "Assign the treatment this week and compare its results with the previous week"
    ],
    "e": "Session is the appropriate assignment unit here. Randomize eligible sessions and keep each assignment stable to reduce treatment contamination within a task. See notes 4.3.",
    "w": {
      "0": "[Data-shape mismatch] Reassigning each request exposes the same learning task to both treatments.",
      "1": "[Metric substitution] Subject differences are confounded with prompt versions, so group differences do not isolate the treatment effect.",
      "3": "[Metric substitution] Time and student mix can change; a week-over-week comparison is not a concurrent randomized control."
    }
  },
  "q082": {
    "q": "A municipal translation team wants to know whether new terminology examples improve minority-language translations. The proposed release also changes the model, and the original environment and scoring criteria are available. Which arrangements isolate the effect of the examples? Select 2.",
    "o": [
      "Switch models and assess the examples by the gain over the old release",
      "Expand examples and retrieval context, then compare minority-language scores",
      "Keep the original model and runtime settings, varying only the prompt examples",
      "Report the examples' effectiveness through terminology coverage, retaining existing translation scores",
      "Assess repeated runs on the same tasks and criteria, reporting minority-language regressions separately"
    ],
    "e": "Isolate the examples by holding the model and other conditions fixed. Repeat the comparison with the same tasks, grader, and environment, and report minority-language regressions separately. See notes 4.3.",
    "w": {
      "0": "[Metric substitution] Changing the model and examples together prevents attribution of the score change to the examples.",
      "1": "[Unmeasured expansion] Additional context introduces another variable, so the comparison no longer isolates the examples.",
      "3": "[Metric substitution] Term coverage in the examples does not measure improved translation quality."
    }
  },
  "q083": {
    "q": "An A/B test of a bank reconciliation explainer is still within its planned observation window. The treatment is ahead, but the confidence interval for the estimated effect is wide; the planned sample size has not been reached and no stopping condition has fired. How should the team handle the result?",
    "o": [
      "Continue as planned, reporting an inconclusive result with the effect estimate and confidence interval",
      "Stop the test and roll out the current leader, using the observed gain for acceptance",
      "Declare equivalence and retain the cheaper version per call",
      "Add reasoning steps to the treatment prompt and continue recording scores for the same test"
    ],
    "e": "Continue observing or report an inconclusive result until the planned criteria are met, retaining effect size and uncertainty. A temporary lead or undetected difference does not establish a definitive outcome. See notes 4.3.",
    "w": {
      "1": "[Metric substitution] A provisional lead with substantial uncertainty does not satisfy the planned winning criterion.",
      "2": "[Metric substitution] Failure to establish a difference with insufficient data does not establish equivalence.",
      "3": "[Unmeasured expansion] Adding reasoning requirements changes the treatment; accumulating scores afterward does not resolve the original comparison's insufficient sample."
    }
  },
  "q084": {
    "q": "A hospital is running a limited rollout of an administrative-notice assistant. Its primary metric has improved, but review confirms that the treatment crossed the predefined harmful-output stopping threshold; the rollback version passed the original acceptance checks. What should the owner do?",
    "o": [
      "Pause the control and restore its old traffic settings while treatment collects more cases",
      "Check the weighted quality and primary-metric score by version, retaining the traffic split",
      "Add logs for confirmed incidents and defer traffic decisions to the next scheduled review",
      "Stop treatment and restore the accepted version, retaining incident cases"
    ],
    "e": "Apply the predefined stopping or rollback condition once the safety boundary is crossed, without waiting for a final primary-metric result. Retain the incident cases for diagnosis and regression. See notes 4.3.",
    "w": {
      "0": "[Wrong-layer diagnosis] The treatment crossed the boundary; pausing the control does not apply the treatment stopping condition.",
      "1": "[Metric substitution] A composite score does not enforce an independently agreed stopping boundary.",
      "2": "[Audit as prevention] Additional records do not stop continued exposure after the stopping condition has been confirmed."
    }
  },
  "q085": {
    "q": "A retailer cannot reproduce its previous product-classification experiment. It saved the prompt template but omitted runtime variables, retrieval versions, and the scoring rubric version. Which records should the next experiment retain? Select 2.",
    "o": [
      "Record and check the template checksum to determine whether runs are reproducible",
      "Add a run record linking actual variables, model settings, tool and retrieval versions, and experiment ID",
      "Check category counts across runs and report reproducibility from matching category coverage",
      "Record dataset and rubric versions with results, retaining a version combination for rollback",
      "Add an experiment agent that infers historical settings from the template and reruns them"
    ],
    "e": "Reproduction needs actual inputs, configuration and dependency versions, plus dataset and rubric versions. Link those records to results through the experiment ID and retain a rollback combination. See notes 4.3.",
    "w": {
      "0": "[Metric substitution] A matching template checksum does not establish matching variables, dependencies, or scoring conditions, so it cannot determine reproducibility.",
      "2": "[Metric substitution] Matching category coverage does not capture the input, dependencies, or scoring versions.",
      "4": "[Overengineering] An orchestration agent cannot recover unrecorded historical settings; actual settings need recording at execution time."
    }
  },
  "q086": {
    "q": "A technical-support classifier keeps assigning rare incidents to common categories. Ticket fields are complete, but every example in the assembled prompt shows a common category; the same model classifies rare cases correctly with representative examples. Which repair should come first?",
    "o": [
      "Expand tickets with historical discussions and past conversations from the same project",
      "Expand rare-category examples, keeping rules fixed and replaying failures",
      "Switch to a larger classification model while retaining the current rules and examples",
      "Replay common-category cases and assess their accuracy, checking unmatched labels"
    ],
    "e": "The assembled examples are unrepresentative, and a controlled prompt comparison already supports adding rare cases. Repair that imbalance and replay the failures to check for regressions. See notes 4.4.",
    "w": {
      "0": "[Unmeasured expansion] The diagnosed problem is example imbalance; project history does not correct the category examples.",
      "2": "[Model substitution] The current model succeeds in the controlled comparison; the evidence supports fixing examples first.",
      "3": "[Metric substitution] Common-category accuracy conceals the known rare-category failures."
    }
  },
  "q087": {
    "q": "A university research assistant receives a complete archival document exceeding 20k tokens. Its answer cites a real passage but turns a qualified statement into a general conclusion. Which generation arrangement best addresses this factual distortion?",
    "o": [
      "Have the model append citation IDs to each paragraph, then check that the IDs resolve",
      "Expand the input with duplicate copies of the archive for the model to read before answering",
      "Have the model extract verbatim passages before answering, then check claims against sources",
      "Restore the earlier long-form writing prompt while retaining the existing citation process"
    ],
    "e": "Extracting verbatim passages before answering and checking each claim against its source can reduce misinterpretation of qualifications. These measures reduce hallucination risk without guaranteeing error-free answers. See notes 4.4.",
    "w": {
      "0": "[Metric substitution] Resolvable citation IDs locate a source but do not establish that the claim preserves its qualifications.",
      "1": "[Unmeasured expansion] The full source is already available; duplicating it does not address misinterpretation of its qualifications.",
      "3": "[Wrong-layer diagnosis] Changing the writing prompt does not check whether claims preserve the source's qualifications."
    }
  },
  "q088": {
    "q": "A public research office investigates persistent reasoning failures in a scenario-analysis assistant. Reviewers have checked its evidence, assembled prompt, and grader; repeated comparisons on the same tasks and environment show that a higher-capability model meets the bar while the current model does not. The tested higher-capability configuration also has acceptable cost and latency. Which actions follow? Select 2.",
    "o": [
      "Switch to the model configuration that passed the comparison, retaining the original for rollback",
      "Switch to a model one tier above the tested candidate and carry forward that candidate's acceptance result",
      "Increase the current model's reasoning budget and release it with the other settings unchanged",
      "Score the candidate by analysis length and citation count, checking layout consistency",
      "Recheck the agent after the switch on the same task sets, inspecting quality by group in production"
    ],
    "e": "The controlled result supports a model change after evidence, prompt, and grader problems have been ruled out. Adopt the measured configuration and continue regression checks under the same task definitions. See notes 4.4.",
    "w": {
      "1": "[Model substitution] The comparison supports the tested configuration, not a different tier whose behavior has not been measured.",
      "2": "[Unmeasured expansion] The comparison supports the other configuration; increasing the current model's budget has no corresponding evaluation result.",
      "3": "[Metric substitution] Length, citation count, and layout do not measure correctness of complex reasoning."
    }
  },
  "q089": {
    "q": "A bank permits reconciliation records in any order, and reviewers confirm that a set of generated lists contains the correct records and values. The scoring script rejects them because their row order differs from the reference. What should be repaired first?",
    "o": [
      "Check reference order, adjust the prompt, and repeat the existing scoring procedure",
      "Fix the output template and retain scoring against reference row order",
      "Normalize row order in the grader; compare values in code and replay valid lists",
      "Add a review agent to reorder the list for the original reference-order scorer"
    ],
    "e": "The artifact satisfies the contract, so the defect is in the grader. Compare the fields that matter and accept valid variants using a simple, reproducible code check. See notes 4.4.",
    "w": {
      "0": "[Wrong-layer diagnosis] The output contract permits any order; changing generation imposes the grader's unnecessary restriction on the model.",
      "1": "[Data-shape mismatch] Fixing the template still treats variable row order as a correctness requirement despite the delivery rules.",
      "3": "[Overengineering] Code can compare keys and values directly; an extra agent merely accommodates an unnecessary ordering restriction."
    }
  },
  "q090": {
    "q": "A hospital uses prompt caching for policy summaries. Cache reads receive a discount, but frequent policy changes trigger fresh writes; quality and retry policy remain unchanged. How should the team determine whether caching reduces costs for this workload?",
    "o": [
      "Combine cache-write, read, and miss charges; assess total cost against the task baseline",
      "Record the cache-read discount and estimate total workload savings from that rate",
      "Check input lengths on cache hits and estimate savings from reused-token counts",
      "Count policy clauses in the cached prefix and judge cost benefits by clause coverage"
    ],
    "e": "Cache economics depend on the actual mix of writes, reads, and misses. Compare spending for the same workload; the read discount alone is not the reduction in the whole bill. See notes 4.5.",
    "w": {
      "1": "[Metric substitution] A read discount excludes writes and misses and cannot directly establish total savings.",
      "2": "[Metric substitution] Reused-token counts omit the different charges and do not establish lower total expense.",
      "3": "[Metric substitution] Policy coverage measures content completeness, not cache economics."
    }
  },
  "q091": {
    "q": "A retailer generates accurate but verbose product-care instructions. Lowering max_tokens caused some replies to end midway through a caution. Which adjustment best produces concise, complete instructions?",
    "o": [
      "Have the model put conclusions first and keep the current generation cap for the body",
      "Have the model limit sentence count, increase max_tokens for headroom, and check completeness",
      "Increase the same model's reasoning budget so it plans the care instructions more thoroughly",
      "Check the reduction in average output tokens and report compression from that reduction"
    ],
    "e": "Sentence or paragraph limits guide concise writing, while max_tokens is a hard cap. Raise the lowered cap to leave headroom and check completeness so truncation is not mistaken for concise output. See notes 4.5.",
    "w": {
      "0": "[Wrong-layer diagnosis] Reordering the content does not resolve truncation of required cautions at the hard limit.",
      "2": "[Unmeasured expansion] The observed problems are verbosity and truncation at the hard cap; more reasoning does not directly constrain the body's length.",
      "3": "[Metric substitution] A token reduction may come from truncated content and does not establish completeness."
    }
  },
  "q092": {
    "q": "A deployment assistant updates shared configuration and then reads it to generate release instructions. The team proposes parallel tool execution to reduce waiting, but the instructions must reflect this update. Which scheduling approach fits?",
    "o": [
      "Run the write and read concurrently before checking their results and generating instructions",
      "Cache validated configuration and use it during the write",
      "Choose the schedule with the fastest first-text response and use its returned content",
      "Finish the write before reading, checking the result before producing the complete instructions"
    ],
    "e": "The shared-state operations have an ordering dependency. Confirm the write before reading and generating instructions; the rationale for parallel independent reads does not apply here. See notes 4.5.",
    "w": {
      "0": "[Data-shape mismatch] The read depends on this write and may observe old state; waiting for both responses does not fix that race.",
      "1": "[Data-shape mismatch] The cached snapshot need not contain this update and cannot meet the required consistency.",
      "2": "[Metric substitution] First-text speed does not establish that the instructions describe the configuration after this update."
    }
  },
  "q093": {
    "q": "After history compression, a course-design assistant sometimes forgets the teaching-hour limit approved by the instructor. Ablation replays show that restoring that decision fixes the omission, while removing other old discussion preserves quality. Which measures retain correctness while reducing input overhead? Select 2.",
    "o": [
      "Expand to the confirmed complete conversation history and assess retained-message counts",
      "Expand the decision context with the necessary confirmed constraint identified by ablation",
      "Trim to the latest conversation turns and assess compression by remaining-token count",
      "Trim dispensable history; assess quality and input usage on the same replays after each change",
      "Add review stages to infer the instructor's previously approved limits"
    ],
    "e": "Context compression should preserve decisions and evidence. The ablation supports restoring the specific limit while trimming dispensable discussion, followed by replay checks of quality and input savings. See notes 4.5.",
    "w": {
      "0": "[Unmeasured expansion] The ablation isolates the needed decision; restoring all history adds unnecessary input against the cost objective.",
      "2": "[Metric substitution] Token count does not check preservation of the older decision or establish quality.",
      "4": "[Overengineering] The required decision is already recorded; extra review stages add no benefit over restoring that record."
    }
  },
  "q094": {
    "q": "A public-service assistant uses prompt caching for a common policy prefix, followed by each resident's question. A proposal would also reuse the reply from one cache hit for later residents whose eligibility details differ. How should this cache be used?",
    "o": [
      "Reuse matching-prefix processing and generate a reply for the current resident",
      "Reuse the full reply from the previous cache hit, adjusting wording for the resident's name",
      "Expand the policy prefix with repeated clauses so the model receives the same rules several times",
      "Check cache-entry expiry and return a stored policy reply whenever an entry is valid"
    ],
    "e": "Prompt caching reuses processing for a matching input prefix, not generated answers. The current resident's circumstances still need to inform the reply. See notes 4.5.",
    "w": {
      "1": "[Data-shape mismatch] Prompt caching reuses input-prefix processing; it is not an answer cache validated for different eligibility details.",
      "2": "[Unmeasured expansion] No policy information is missing. Repeated clauses do not address residents' differing eligibility or change what prompt caching reuses.",
      "3": "[Data-shape mismatch] A valid prefix cache entry does not supply a cached reply appropriate to this resident."
    }
  },
  "q095": {
    "q": "A financial-analysis assistant uses caching, but its dashboard treats input_tokens as total input. Operations wants the total input tokens processed for a response that also includes cache-write and cache-read fields. Which calculation should it use?",
    "o": [
      "Sum input_tokens and output_tokens for the response's total input usage",
      "Report cache_read_input_tokens as the response's total input usage",
      "Sum input_tokens + cache_creation_input_tokens + cache_read_input_tokens for total input tokens",
      "Compare input_tokens with cache-write usage and report the larger value as total input"
    ],
    "e": "Total input adds ordinary input, cache creation, and cache reads. Track output tokens separately. See notes 4.6.",
    "w": {
      "0": "[Metric substitution] Output is a different usage category, and this sum omits cached input.",
      "1": "[Metric substitution] Cache reads cover only one part of input and omit ordinary input and cache creation.",
      "3": "[Metric substitution] These fields represent different input components; taking the maximum does not total them."
    }
  },
  "q096": {
    "q": "A hospital scheduling-explanation service streams responses. Its dashboard adds the output usage from every message_delta.usage event and exceeds the final response total; the stream is complete, has no retries, and belongs to one message. How should aggregation change?",
    "o": [
      "Record the average cumulative usage across events and count it once on completion",
      "Record initial usage and count that reading on completion",
      "Add a usage-estimation agent to reconstruct output tokens from the response text",
      "Record the final cumulative usage, counting it as the message's usage"
    ],
    "e": "Streaming message_delta.usage values are cumulative. For a complete stream, use the final cumulative reading before aggregating across messages or tasks. See notes 4.6.",
    "w": {
      "0": "[Metric substitution] The average of cumulative readings is not the final consumption of the message.",
      "1": "[Metric substitution] The initial reading omits output generated later in the stream.",
      "2": "[Overengineering] Complete cumulative usage is already available; another estimation component is unnecessary."
    }
  },
  "q097": {
    "q": "A retail market-research assistant using server-side tools returns pause_turn with its report unfinished. The tool loop reached the iteration limit for this turn, while the task remains within its approved budget and no business stopping condition has fired. What should the application do next?",
    "o": [
      "Record the paused state as permanent failure and ask the user to resubmit the complete task",
      "Preserve the paused state and complete context, resume within budget, and track the result",
      "Count a successful HTTP response as completed research and deliver the current report",
      "Increase max_tokens and restart from the original request to recreate the tool sequence"
    ],
    "e": "pause_turn marks a server-side tool loop reaching its per-turn iteration limit and allows continuation. Preserve state, respect the remaining budget, and track the actual task outcome. See notes 4.6.",
    "w": {
      "0": "[Wrong-layer diagnosis] pause_turn identifies a resumable server-side tool-loop pause, not a permanent failure.",
      "2": "[Metric substitution] Transport success does not establish completion of the unfinished research report.",
      "3": "[Unmeasured expansion] The turn paused at a tool-iteration limit; more generation tokens do not address that cause."
    }
  },
  "q098": {
    "q": "A technical-documentation assistant has more truncation alerts, with both max_tokens and model_context_window_exceeded in its logs. The team wants to route investigation by stop reason because the configured generation cap is not the bottleneck for every request. Which responses fit these signals? Select 2.",
    "o": [
      "For max_tokens, check the required output length and increase max_tokens when longer output is needed",
      "For model_context_window_exceeded, expand max_tokens and rerun the original input",
      "For model_context_window_exceeded, check context usage and evaluate trimming that preserves evidence",
      "For max_tokens, check whether the returned body parses before deciding whether to clear the truncation alert",
      "For both groups, assess recovery by HTTP success rate and mark normal responses as restored"
    ],
    "e": "The generation cap and context-window boundary are distinct. Route by stop_reason: when a max_tokens stop reflects genuinely longer required output, increase max_tokens; when the context window is exhausted, investigate context occupancy, because a larger generation cap does not help. See notes 4.6.",
    "w": {
      "1": "[Unmeasured expansion] A context-window boundary is not the request generation cap; increasing max_tokens does not enlarge the window.",
      "3": "[Metric substitution] Parseability shows only that the format is intact; a truncated body can still omit required content, so it cannot decide whether the alert is cleared.",
      "4": "[Metric substitution] HTTP success does not measure content completeness or recovery from truncation."
    }
  },
  "q099": {
    "q": "A teaching-feedback assistant receives more requests from newly added courses. Overall mean quality is stable, but instructors report worse feedback on one type of lab report; random samples already have course labels and version links. How should the team check for degradation hidden by a changing traffic mix?",
    "o": [
      "Check mean quality and traffic shares by version and course, reviewing failures for the regression set",
      "Repeatedly check confirmed overall mean quality by version, retaining a common threshold while stable",
      "Measure course quality from complaint cases and put their correctness rate on the main dashboard",
      "Expand the overall random sample and keep tracking quality through a pooled score"
    ],
    "e": "Compare quality within groups alongside their traffic shares to detect degradation hidden in a stable aggregate. Add confirmed failures to the offline regression set. See notes 4.6.",
    "w": {
      "1": "[Metric substitution] Changes in course mix can mask declining quality in one group within a stable overall mean.",
      "2": "[Metric substitution] Complaint cases are not a random population sample and bias the course-quality estimate.",
      "3": "[Unmeasured expansion] Course-labeled samples already exist; expanding the overall sample without checking group quality can still hide a local regression."
    }
  },
});
