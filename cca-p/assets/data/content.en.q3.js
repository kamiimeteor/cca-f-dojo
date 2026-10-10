/* Domain 1: q039–q070; option indices match questions.js. */
Object.assign(CONTENT_EN.questions, {
  "q039": {
    "q": "A payment platform calculates settlement fees using published rules that are fully expressible in code. Its calculator has passed acceptance testing. Customers now need plain-language explanations, while amounts must remain reproducible. How should the responsibilities be divided?",
    "o": [
      "Have Claude infer the current fee from similar bills and itemize the result",
      "Keep the accepted fee calculator and use Claude to explain its itemized output",
      "Have several agents calculate fees and let a coordinator combine matching amounts",
      "Calculate fees in code and approve itemized amounts using customers’ readability ratings"
    ],
    "e": "The accepted calculator supplies reproducible amounts, while Claude explains its output. The language requirement does not require moving arithmetic into the model. See notes 1.1.",
    "w": {
      "0": "[Data-shape mismatch] Inferring fees from similar bills does not implement the required reproducible rate calculation.",
      "2": "[Overengineering] The existing calculator meets the requirement; agent coordination addresses no demonstrated gap.",
      "3": "[Metric substitution] Readability ratings assess the explanation, not the accuracy of itemized amounts."
    }
  },
  "q040": {
    "q": "A hospital wants to reduce referral-document preparation time using dictated notes and existing reports. Staff approve the final document. The proposal currently asks for “better documents, prepared faster” without acceptance criteria. Which targets best express the business need?",
    "o": [
      "Assess factual accuracy in the finished document and generation time for each draft",
      "Record editing time and use API success rates to assess preservation of the required facts",
      "Track missing facts and editing effort, using dictation time as the measure of cycle length",
      "Assess required factual coverage, staff editing effort, and total preparation time"
    ],
    "e": "Acceptance criteria should cover both document quality and the work needed to complete it. Required facts, editing effort, and total time make those goals testable. See notes 1.1.",
    "w": {
      "0": "[Metric substitution] Generation time excludes staff editing and approval from the preparation process.",
      "1": "[Metric substitution] API success does not measure whether the required facts survive in the document.",
      "2": "[Metric substitution] Dictation time covers input collection, not document preparation, revision, and approval."
    }
  },
  "q041": {
    "q": "A retailer is considering Claude for promotional inventory analysis. The team has not established which store data it may access or who handles missing information. It must decide whether to start a pilot before selecting a model. What should it establish first? Select 2.",
    "o": [
      "Establish data-access permissions, freshness needs, and available fields for the pilot",
      "Choose the leading model on an industry benchmark and use its recommended settings",
      "Set usable-recommendation criteria and assign incomplete cases to a business role",
      "Use a recommendation template; check field formatting before requesting a pilot",
      "Create persistent store agents and a headquarters agent to combine recommendations"
    ],
    "e": "Data access, acceptance criteria, and exception ownership establish whether the pilot is feasible. Those requirements should guide model and orchestration choices. See notes 1.1.",
    "w": {
      "1": "[Model substitution] A ranking cannot establish the right model before task and data requirements are known.",
      "3": "[Wrong-layer diagnosis] Valid recommendation formatting does not establish data availability or responsibility for missing inputs.",
      "4": "[Overengineering] The missing prerequisites concern the pilot; there is no established need for layered orchestration."
    }
  },
  "q042": {
    "q": "A software company routes incident tickets to internal response queues. Routing must account for causal relationships, and the maintenance team is small. On the same representative evaluation set, a capable model meets quality and timing requirements in one call. A smaller model misses causal links, while its revision chain exceeds the deadline. Which starting design fits?",
    "o": [
      "Use the capable model for one-call ticket routing within quality and timing limits",
      "Deploy the smaller model for one-call routing and assess price per call and response length",
      "Deploy the smaller model’s revision chain to complete ticket routing in stages",
      "Move the smaller model to another tier and deploy routing with the current prompt"
    ],
    "e": "A simple architecture does not require the smallest model. The tested single-call design meets quality, timing, and maintenance constraints without the failing revision chain. See notes 1.1.",
    "w": {
      "1": "[Metric substitution] Price and length omit the causal fidelity required by the task.",
      "2": "[Overengineering] An accepted single-call design exists; the revision chain adds orchestration and exceeds the deadline.",
      "3": "[Model substitution] No task evaluation establishes that the untested tier meets quality and timing requirements."
    }
  },
  "q043": {
    "q": "A university uses Claude to rewrite event notes as alumni newsletters. The notes use project abbreviations, and drafts often expand them into outdated names. Current official names are in this term’s internal project directory, which the team may read. Style already meets requirements, and staff publish the newsletters. What should the team change first?",
    "o": [
      "Add writing and reviewing agents to infer full project names from the event notes",
      "Use a model with stronger general knowledge to expand project names from memory",
      "Supply the model with current internal directory entries for the project names",
      "Attach past newsletters and extract their project names for the current draft"
    ],
    "e": "The failure is missing current institutional knowledge. Supply the authorized directory so names can be grounded in its entries, before adding orchestration or changing to a model with stronger general knowledge. See notes 1.1.",
    "w": {
      "0": "[Overengineering] Additional orchestration still has only the abbreviations in the notes, not the missing current institutional knowledge.",
      "1": "[Model substitution] General knowledge does not establish this term’s internal names, and changing models does not supply the current directory.",
      "3": "[Unmeasured expansion] Past newsletters cannot establish current names; adding old material does not resolve the freshness gap."
    }
  },
  "q044": {
    "q": "A public grant office is testing Claude to organize application arguments. Incorrect conclusions could affect applicants, and current evaluations cannot reliably grade recommendations. The office still wants to reduce reading effort, while officers must make formal decisions. Which pilot boundaries fit? Select 2.",
    "o": [
      "Split an application by page and have each processor recommend a decision for its pages",
      "Provide source-linked summaries in page order; officers handle decisions",
      "Put officers’ decision rules in the system prompt and let output update formal status",
      "Increase reasoning effort to write detailed approval recommendations",
      "Create an owned human handoff for missing or conflicting evidence"
    ],
    "e": "Source-linked summaries and an owned handoff support staff reading without extending the pilot into formal decisions that it cannot reliably justify. See notes 1.1.",
    "w": {
      "0": "[Data-shape mismatch] An application decision depends on evidence across the record, not separate page-level conclusions.",
      "2": "[Prompt as enforcement] Prompt instructions do not enforce the requirement that officers make formal decisions.",
      "3": "[Unmeasured expansion] More reasoning does not resolve the inability to grade recommendations reliably."
    }
  },
  "q045": {
    "q": "An invoice assistant sometimes receives scans without a currency. The model guesses from the supplier name, causing downstream amounts to be categorized incorrectly. Currency must come from the invoice or confirmed supplementary material. Where should the intervention occur?",
    "o": [
      "Add a currency explanation to the output template for a fuller account of the amount",
      "Use a stronger model to infer the missing currency from the existing invoice input",
      "Return invoices missing currency; resume with confirmed supplementary material",
      "Add more supplier examples to the prompt to broaden currency inference"
    ],
    "e": "The failure begins with missing input evidence. Returning the item at intake prevents an unsupported guess from entering later stages as a valid field. See notes 1.2.",
    "w": {
      "0": "[Wrong-layer diagnosis] An output explanation cannot supply the missing authoritative currency information.",
      "1": "[Model substitution] A model upgrade cannot supply the invoice evidence or confirmed supporting material required here.",
      "3": "[Unmeasured expansion] Additional inference examples do not provide invoice or confirmed supporting evidence."
    }
  },
  "q046": {
    "q": "A clinic scheduling assistant times out after submitting a room reservation. The service may have saved it, but no result reached the assistant. Status can be queried by the business reference, and a new submission creates another reservation. How should recovery proceed?",
    "o": [
      "Use the business ID to read this operation’s server-side record before finishing or resubmitting",
      "Extend the timeout and submit the same reservation details again",
      "Send the operation to the reservation reconciliation queue for a batch process to fill in its outcome",
      "Read the target slot’s availability and infer this submission’s result from whether it is occupied"
    ],
    "e": "Checking the business operation distinguishes a saved reservation from an unsuccessful or still-unknown write. A transport timeout alone does not establish failure. See notes 1.2.",
    "w": {
      "1": "[Wrong-layer diagnosis] The unresolved issue is the write outcome; changing the timeout and resubmitting does not establish it.",
      "2": "[Wrong-layer diagnosis] A status lookup is available for this operation; deferring it to batch reconciliation does not directly resolve the current request.",
      "3": "[Metric substitution] The slot may be occupied by another reservation, so availability does not establish this submission’s write outcome."
    }
  },
  "q047": {
    "q": "An online retailer generates promotional price recommendations with structured outputs. JSON fields are stable, but some discounts fall outside approved price bounds. Large changes require operations approval. Which controls belong between output and execution? Select 2.",
    "o": [
      "Check amounts against approved bounds at publication and block invalid changes",
      "Have operations check JSON field formatting, then release the price for publication",
      "Add approved ranges to the system prompt and ask the model to control publishable amounts",
      "For approval-required changes, sequence operations approval, logging, and publication",
      "Record published prices alongside approved ranges for daily review by operations"
    ],
    "e": "Structured output controls field shape. Price checks and approval routing separately enforce what may be published and when publication may occur. See notes 1.2.",
    "w": {
      "1": "[Wrong-layer diagnosis] A formatting check addresses structure without implementing the price bounds or approval required before publication.",
      "2": "[Prompt as enforcement] The price boundary requires an execution check; a prompt does not enforce that boundary.",
      "4": "[Audit as prevention] Reviewing published prices does not enforce the price boundary before publication."
    }
  },
  "q048": {
    "q": "Complaints increase after an issue classifier is released on a developer platform. Feedback includes accidental votes and unredacted logs, while output formatting is unchanged. Only redacted material may enter the shared regression set. How should the team use the feedback for the next version?",
    "o": [
      "Store complete feedback under issue identifiers in the shared evaluation set to reproduce classification results",
      "Expand the classifier’s historical issue set with prior classification results",
      "Refine the result template and evaluate the readability of the interface messages",
      "Redact and review feedback, link it to classification outcomes, then add regression cases"
    ],
    "e": "Feedback should become reliable, usable examples before entering regression evaluations. Linking it to actual outcomes separates product opinions from classification failures. See notes 1.2.",
    "w": {
      "0": "[Compliance shortcut] Keeping the complete feedback for reproduction includes unredacted logs in a set restricted to redacted material.",
      "1": "[Unmeasured expansion] The complaint cause is not established, so extra historical issues are not a targeted correction.",
      "2": "[Wrong-layer diagnosis] Readability testing does not build the missing path from feedback to classification quality."
    }
  },
  "q049": {
    "q": "A university laboratory uses a custom client tool to submit approved purchase orders. The model has returned a tool-call request, but the backend has not executed it, even though the interface says “submitted.” How should completion be wired?",
    "o": [
      "Use a receipt definition that passed format tests and regenerate the tool call request",
      "Execute the authorized call in the application and update the order from the backend result",
      "Add submission instructions to the prompt so the model writes clearer completion messages",
      "Save the purchase-event ID in the parser and mark submission complete on event receipt"
    ],
    "e": "The application executes client tools. Proposing an action, executing it, and receiving its result are separate stages; completion must follow the business outcome. See notes 1.2.",
    "w": {
      "0": "[Wrong-layer diagnosis] Testing the receipt format does not execute the purchase; changing the definition and regenerating the request leave application execution missing.",
      "2": "[Wrong-layer diagnosis] The missing action is backend execution; clearer wording does not submit an order.",
      "3": "[Metric substitution] An event receipt confirms reception, not completed execution in the purchasing system."
    }
  },
  "q050": {
    "q": "A municipal research office produces policy briefs by drafting an outline, checking it, writing the sections, and preparing a summary. A single generation often misses outline constraints. Staged processing meets quality requirements, and the extra waiting is acceptable. Which pattern fits?",
    "o": [
      "Use prompt chaining with ordered prompts and criteria for advancing stages",
      "Use routing to select a writing prompt from the policy topic",
      "Use orchestrator-workers so a planner chooses writing subtasks for each brief",
      "Use parallel sectioning so each section works independently from the initial request"
    ],
    "e": "Fixed subtasks and an acceptable latency trade-off favor prompt chaining. Gates ensure that later stages consume accepted earlier output. See notes 1.3.",
    "w": {
      "1": "[Data-shape mismatch] Topic routing does not implement the required sequence of dependent writing stages.",
      "2": "[Overengineering] The subtasks are already fixed and separable; dynamic planning adds no needed capability.",
      "3": "[Data-shape mismatch] Sections depend on the approved outline, which independent generation from the initial request omits."
    }
  },
  "q051": {
    "q": "A corporate finance help desk receives billing explanations, contract terminology questions, and integration requests. Each category has an accepted specialist process. One shared prompt causes formatting conflicts, and a classifier meets routing criteria on real requests. How should the entry point work?",
    "o": [
      "Combine the specialist prompts into a longer prompt with full examples for each category",
      "Route each request category to its specialist prompt workflow and required inputs",
      "Run requests through billing, contract, and integration processes in sequence, then combine the outputs",
      "Choose a fixed process by the user’s company and retain that company’s prompt configuration"
    ],
    "e": "Distinct, accurately classified requests fit routing. Existing specialist paths avoid the prompt interference observed with shared generation. See notes 1.3.",
    "w": {
      "0": "[Unmeasured expansion] Adding to the shared prompt retains the cross-task interference despite reliable routing being available.",
      "2": "[Overengineering] Reliable classification is available, so running unrelated processes adds unnecessary stages.",
      "3": "[Data-shape mismatch] The relevant distinction is request type; one company can submit requests in different categories."
    }
  },
  "q052": {
    "q": "A hospital training team reviews a complete operations handbook for ambiguous instructions, without making patient decisions. Independent prompts reviewing the same text and combining findings improve coverage. Splitting by chapter misses contradictions across chapters. Which parallel pattern fits?",
    "o": [
      "Use sectioning to assign chapters for review and combine the chapter findings",
      "Use routing to select a review prompt and matching chapter by topic",
      "Use voting: independent prompts review the full handbook; combine judgments",
      "Use a single augmented LLM with other departments’ handbooks as review context"
    ],
    "e": "This is voting: independent attempts at the same task are combined. Sectioning divides the work, and the pilot shows why chapter partitions are unsuitable here. See notes 1.3.",
    "w": {
      "0": "[Data-shape mismatch] Chapter partitioning has been shown to miss the required cross-chapter contradictions.",
      "1": "[Data-shape mismatch] A single topic route does not provide independent judgments over the complete handbook.",
      "3": "[Unmeasured expansion] Other departments’ material has no demonstrated benefit for finding ambiguity in this handbook."
    }
  },
  "q053": {
    "q": "A retailer has a terminology guide and clear grading criteria for localized copy. It tests single generation, voting across versions, and revision from evaluator comments. Only revision meets the quality threshold within budget, and feedback consistently identifies fixable defects. Which design should it use?",
    "o": [
      "Use voting to combine independent drafts and select the most popular version",
      "Use one generation and assess delivery quality through sentence fluency",
      "Partition by region and have each regional prompt produce its final copy",
      "Use evaluator-optimizer with evaluation prompts to guide draft revisions"
    ],
    "e": "Clear criteria, useful feedback, and measured improvement support evaluator-optimizer. The choice follows the comparative trial rather than an assumption that more iterations always help. See notes 1.3.",
    "w": {
      "0": "[Data-shape mismatch] The tested voting approach misses the quality floor and does not use actionable revision feedback.",
      "1": "[Metric substitution] Fluency does not cover the specified terminology and grading criteria.",
      "2": "[Data-shape mismatch] Regional partitioning alone does not provide the revision process shown to meet the criteria."
    }
  },
  "q054": {
    "q": "A migration platform receives upgrades for different services. Required file changes become clear only after repository analysis. The lead model can then assign nonconflicting change scopes, and integration tests already exist. Fixed file partitions repeatedly miss new dependencies. Which orchestration choices fit? Select 2.",
    "o": [
      "Assign tasks by directory and reuse this division for later requests",
      "Identify changes by submission time and merge worker edits in that order",
      "Have a central model derive and delegate subtasks from the repository analysis",
      "Provide the repository’s complete history to the dynamic planner as context for its assignments",
      "Merge worker edits in dependency order and have the lead run integration checks"
    ],
    "e": "Orchestrator-workers fits subtasks that cannot be fixed in advance. The lead assigns work dynamically and combines outputs, with integration checks beyond worker completion. See notes 1.3.",
    "w": {
      "0": "[Data-shape mismatch] Required subtasks vary by input; fixed assignments are the observed source of omissions.",
      "1": "[Data-shape mismatch] Submission time does not express code dependencies and cannot determine a sound integration order.",
      "3": "[Unmeasured expansion] Current repository analysis can establish task boundaries; no evidence calls for the full history."
    }
  },
  "q055": {
    "q": "A university archive investigates the provenance of donated objects. Each discovery can change the next lead, so a complete path cannot be specified in advance. Read-only access is approved. Sandbox trials favor dynamic exploration over a fixed retrieval chain within cost and time limits. Which architecture fits?",
    "o": [
      "Use a predefined retrieval chain that visits sources in a fixed order before summarizing",
      "Use an agent that chooses actions from evidence, with budgets and human handoff points",
      "Use one generation with the searchable archive loaded as context for a provenance conclusion",
      "Use an investigative agent and assess research quality through agreement between its runs"
    ],
    "e": "Discoveries determine the control flow, and controlled trials support an agent. Budgets and human handoff bound its operational risk. See notes 1.3.",
    "w": {
      "0": "[Data-shape mismatch] The fixed path does not adapt to changing leads, consistent with the trial results.",
      "2": "[Unmeasured expansion] Loading archive text does not implement the control flow needed to follow intermediate discoveries.",
      "3": "[Metric substitution] Agreement between runs does not establish sufficient, traceable provenance evidence."
    }
  },
  "q056": {
    "q": "A city planning team researches flood, transport, and energy resilience. The evidence streams are independent and lengthy, while the main report needs findings, sources, and conditions. In a comparative pilot, separate subagents improve coverage over one agent at acceptable token and coordination cost. How should work be organized?",
    "o": [
      "Expand to multiple agents based on the pilot, with a lead synthesizing the evidence",
      "Have one agent maintain a shared history across topics and retain the exploratory record",
      "Use a higher-tier model for longer analysis while one agent manages the research",
      "Divide the three evidence sets into equal text segments and merge findings in segment order"
    ],
    "e": "Independent directions, long research histories, and acceptable overhead support multiple agents. The lead needs attributed findings and conditions rather than every exploratory step. See notes 1.4.",
    "w": {
      "1": "[Unmeasured expansion] Accumulating exploratory history in one context does not provide the measured benefit of separate investigations.",
      "2": "[Model substitution] The pilot supports multiple agents, but does not establish equivalent coverage from a higher model tier.",
      "3": "[Data-shape mismatch] Equal text segments do not preserve the independent research questions and their evidence relationships."
    }
  },
  "q057": {
    "q": "A due-diligence system has a lead and several research subagents, all with read-only access. Workers duplicate the same company and period while another period is missed. Synthesis also mixes versions of the research table. Which coordination changes fit? Select 2.",
    "o": [
      "Increase the number of research subagents to cover more material through varied paths",
      "Route company-period assignments; supplement them with source guidance and output rules",
      "Route searches by source website; let each worker choose company-period coverage",
      "Version shared research tables and have the lead track assignments and synthesis",
      "Expand each worker’s input history with more prior research responses"
    ],
    "e": "Duplication, gaps, and mixed versions point to delegation and synthesis contracts. Explicit scopes reduce overlap, while version identifiers let the lead combine consistent outputs. See notes 1.4.",
    "w": {
      "0": "[Overengineering] More agents retain the undefined assignment and version boundaries causing the failures.",
      "2": "[Data-shape mismatch] Source websites do not map one-to-one to company-period coverage, so this division can leave required units unassigned.",
      "4": "[Unmeasured expansion] Additional responses do not assign ownership or identify the valid artifact version."
    }
  },
  "q058": {
    "q": "Every change to a nursing roster alters staffing availability for later changes. Each step needs the same current roster. Local trials show parallel subagents overwriting one another, while a sequential design meets quality and timing requirements at lower maintenance cost. Which architecture should be used now?",
    "o": [
      "Add parallel subagents so each shift receives more candidate rosters",
      "Keep concurrent writes and audit roster changes after the daily handover",
      "Generate shift rosters concurrently and resolve conflicts by retaining the later-completed result",
      "Keep one current roster and apply changes serially in submission order"
    ],
    "e": "This shared-state workload has measured evidence favoring sequential execution. That local result, rather than a universal rule about agents, supports the choice. See notes 1.4.",
    "w": {
      "0": "[Overengineering] More parallel participants do not resolve the conflicting shared-state updates.",
      "1": "[Audit as prevention] An audit after updates cannot prevent conflicting writes before they occur.",
      "2": "[Data-shape mismatch] Completion order does not represent staffing dependencies in the shared roster."
    }
  },
  "q059": {
    "q": "Before opening a store, a retailer checks inventory, price labels, and opening hours through three fixed interfaces. The queries are independent, and traces attribute most waiting to serial network calls. Results can be joined by store identifier without exploratory decisions. Which orchestration change fits?",
    "o": [
      "Assign an autonomous worker to each system and have a lead agent distribute the checks",
      "Route each store to the interface matching its main product category and produce its check result",
      "Issue the fixed queries in parallel and join their results by store identifier",
      "Retain serial interface calls and use a faster model to generate the check result"
    ],
    "e": "Independent fixed queries can run concurrently and be joined by a stable identifier. This task does not require autonomous planning. See notes 1.4.",
    "w": {
      "0": "[Overengineering] The interfaces and checks are fixed, so autonomous planning adds no needed capability.",
      "1": "[Data-shape mismatch] The three checks are components of one store check, not alternative routes by product category.",
      "3": "[Model substitution] The delay comes from serial network calls, which a generation-model change leaves untouched."
    }
  },
  "q060": {
    "q": "Software release-review subagents finish at very different times. The team wants to process completed results while others continue. Every required branch must still finish or receive a human disposition before the final decision. What should asynchronous coordination include? Select 2.",
    "o": [
      "Process in arrival order, tracking branch states, versions, late results and errors",
      "Append branch replies in arrival order, treating rerun results as new records in the summary",
      "Tell the lead in its prompt to wait for complete results and decide when to publish",
      "Collect branch error logs after delivery and have staff review unfinished tasks",
      "Have the publisher check resolved task states before releasing the final decision"
    ],
    "e": "Asynchrony permits earlier use of results but requires explicit state, late-result, and error handling. The final delivery gate still depends on the full task state. See notes 1.4.",
    "w": {
      "1": "[Data-shape mismatch] Arrival order does not identify result versions, so reruns can mix superseded and current results.",
      "2": "[Prompt as enforcement] The required completion condition needs a state gate; a prompt alone does not enforce it.",
      "3": "[Audit as prevention] Post-delivery review does not resolve required branches before the final decision."
    }
  },
  "q061": {
    "q": "A university registrar delegates extraction of course-scheduling rules. Some subtasks return empty lists, leaving the coordinator unable to distinguish no applicable rules, an unreadable file, and unfinished work. The team wants to retain delegation and let the coordinator decide whether to retry or involve staff. How should the subtask contract change?",
    "o": [
      "Convert empty lists to manual-review cases and have registrar staff classify them",
      "Supply neighboring courses’ rule documents as context for each extraction task",
      "Accept replies that match the list format and pass them to the coordinator",
      "Specify completion status, failure details, and sources in extraction replies"
    ],
    "e": "A subtask contract should distinguish valid empty results, execution failures, and unfinished work so the coordinator can choose the next action. See notes 1.5.",
    "w": {
      "0": "[Wrong-layer diagnosis] Manual review of every empty list leaves the contract unable to distinguish valid empty results from execution failures.",
      "1": "[Unmeasured expansion] The missing information concerns result status; extra course material does not disambiguate an empty list.",
      "2": "[Metric substitution] A valid list format cannot distinguish a valid empty result, a read failure, and work in progress."
    }
  },
  "q062": {
    "q": "A land registry extracts ownership fields from many independent parcel records and combines them by unique parcel identifier. Parallel processing is acceptable, but the pilot duplicates some records and omits others. Which decomposition and merge design fits?",
    "o": [
      "Partition records by text length and concatenate extraction results as they finish",
      "Provide neighboring parcel records to each partition as ownership context",
      "Supply parcel IDs, partition by parcel, and list missing or duplicate records",
      "Check the total output fields and accept record coverage by that count"
    ],
    "e": "Partition independent records by parcel and use the identifier manifest at merge time to report missing and duplicate records. See notes 1.5.",
    "w": {
      "0": "[Data-shape mismatch] Text-length boundaries and completion order do not preserve parcel-based coverage.",
      "1": "[Unmeasured expansion] Neighboring records do not define partition ownership or repair coverage gaps and duplicates.",
      "3": "[Metric substitution] The same field total can hide both duplicated and missing parcels, so it does not establish record coverage."
    }
  },
  "q063": {
    "q": "A bank’s new corporate payment design requires security, data, and performance reviews, each with distinct acceptance criteria. An encryption recommendation may affect performance, so the final implementation must reconcile their requirements. Which decomposition fits?",
    "o": [
      "Divide the document by page and have teams review their pages before joining findings",
      "Route reviews by specialty, collect evidence and impacts, then reconcile cross-domain conflicts",
      "Have teams repeat a general review and select the implementation by majority agreement",
      "Assess design quality by issue counts and prioritize the domain with the most findings"
    ],
    "e": "Distinct specialist criteria justify decomposition by expertise. Evidence and impact let synthesis reconcile constraints across specialties. See notes 1.5.",
    "w": {
      "0": "[Data-shape mismatch] Page boundaries do not align with specialist criteria or constraints spanning the design.",
      "2": "[Data-shape mismatch] Different specialist constraints need reconciliation rather than a majority general opinion.",
      "3": "[Metric substitution] Issue counts do not measure impact or compatibility of cross-domain requirements."
    }
  },
  "q064": {
    "q": "A hospital migrates historical records through summarization, field extraction, and archive-linking subtasks. Each reports completion, but some summaries are linked to the wrong encounter after merging. Which acceptance-contract changes directly address this? Select 2.",
    "o": [
      "Create links between summaries and encounter records using matching keywords",
      "Require subtask outputs to carry original record IDs, sources, and summary mappings",
      "Check summary ownership and final archive state against original encounters after merging",
      "Upgrade the summarization model and continue with the current output contract",
      "Attach neighboring encounter records to items with linkage errors and rerun summarization"
    ],
    "e": "Local completion claims do not establish the final business state. Verifiable identifiers and an integration check are needed to preserve ownership through merging. See notes 1.5.",
    "w": {
      "0": "[Data-shape mismatch] Matching keywords do not uniquely identify an encounter and can link a summary to the wrong record.",
      "3": "[Model substitution] A summarization upgrade does not repair the linkage contract responsible for the merge failure.",
      "4": "[Unmeasured expansion] Extra neighboring material does not repair the identifier relationship needed to establish ownership."
    }
  },
  "q065": {
    "q": "A retailer standardizes product names successfully in one call. A trial splits brand, model, and purpose into subtasks, but the fields frequently constrain one another. Quality does not improve, while repeated context sharing and merging increase time and cost. What granularity change fits?",
    "o": [
      "Restore whole-task processing and assess granularity by accepted output and total task cost",
      "Split the purpose task further and add specialist entry points for product categories",
      "Expand full-text input for each subtask and increase synthesis reasoning effort",
      "Keep the split that passed subtask-speed tests; assess efficiency by mean subtask time"
    ],
    "e": "Finer decomposition is not inherently better. With interdependent fields and an accepted single-call design, measured end-to-end results favor keeping the work together. See notes 1.5.",
    "w": {
      "1": "[Overengineering] The evidence points to excessive handoffs; more entry points add to that problem.",
      "2": "[Unmeasured expansion] Repeated context is already costly, and the trial shows no quality benefit from further expansion.",
      "3": "[Metric substitution] Subtask averages omit repeated context and the cost of completing the merged result."
    }
  },
  "q066": {
    "q": "A coding assistant increases generated code volume, but reviewers spend more time repairing patches. The team lead wants to know whether delivery per engineer has improved without lowering release quality. Which measures fit?",
    "o": [
      "Assess development output using generated lines of code per engineering hour",
      "Assess working efficiency using first-code latency and editor response time",
      "Assess accepted delivery per engineer over time, including effort spent on repairs and review",
      "Assess team delivery using submitted patches per contributing engineer"
    ],
    "e": "Productivity concerns accepted output per person over time, including repair and review effort. Generation volume is a process measure. See notes 1.6.",
    "w": {
      "0": "[Metric substitution] Generated lines do not distinguish accepted delivery from work needing repair.",
      "1": "[Metric substitution] Interaction speed omits review and repair effort and the accepted output ultimately delivered.",
      "3": "[Metric substitution] Entering review does not establish acceptance and therefore does not measure completed delivery."
    }
  },
  "q067": {
    "q": "A university plans personalized research-route guidance for students who previously had no such service. It wants to determine whether the new offering merits ongoing delivery. The prototype can return text, but no pilot has run. Which pilot outcomes best address this transformation goal?",
    "o": [
      "Assess the new service by the disciplines covered and the number of available guidance templates",
      "Assess the service by adoption rates and delivery of acceptable plans to target students",
      "Assess the pilot by mean time to deliver a plan and cost per successful task",
      "Assess delivery using service-page visits and the proportion downloading a plan"
    ],
    "e": "Transformation requires evidence that the intended users adopt the new capability and receive it successfully. Resource measures can constrain delivery but do not establish that outcome. See notes 1.6.",
    "w": {
      "0": "[Metric substitution] Configuration coverage does not establish adoption by target students or acceptable service delivery.",
      "2": "[Metric substitution] Efficiency and cost can constrain delivery but do not establish adoption of the new capability.",
      "3": "[Metric substitution] Visits and downloads do not establish usable plans or adoption by the intended students."
    }
  },
  "q068": {
    "q": "A permit assistant meets its mean response-time target, yet complex requests often time out. The service commitment covers slow-request completion and answer quality, while the dashboard mixes first-token and full-completion timing. Which changes directly support the commitment? Select 2.",
    "o": [
      "Check whether first-token latency meets its target and accept the completion deadline on that basis",
      "Use daily mean request duration to determine whether the service meets its completion deadline",
      "Define the measurement window and how failures are counted; track completion percentiles and quality",
      "Add call-chain time budgets and fallback paths that preserve required answer quality",
      "Increase reasoning effort for complex requests on the same model"
    ],
    "e": "The commitment covers full completion time and answer quality. Percentiles and failure accounting expose slow requests; call-chain budgets and quality-preserving fallback paths help manage timeout risk, and they still need validation under realistic load. See notes 1.6.",
    "w": {
      "0": "[Metric substitution] First-token latency measures the start of output, not full request completion.",
      "1": "[Metric substitution] A mean does not measure the slow-request completion time covered by the commitment.",
      "4": "[Unmeasured expansion] The known failure includes timeouts; untested extra reasoning has no demonstrated timing benefit."
    }
  },
  "q069": {
    "q": "An investment-explanation service meets its quality requirements on a model supporting effort. On the same evaluation set, lowering that model’s effort preserves quality and reduces total cost per successful task. A cheaper model fails the quality floor, while both passing configurations meet the deadline. Which optimization fits?",
    "o": [
      "Adopt the tested lower-effort setting and assess total cost per successful task",
      "Switch to the cheaper model tested against a per-call cost target; assess savings by call price",
      "Retain current effort and supply domain reference material with the explanation request",
      "Add routing and review agents to select models and revise each explanation"
    ],
    "e": "Cost optimization must preserve the quality floor and compare cost per successful task. The evidence supports tuning the current model rather than selecting by unit price. See notes 1.6.",
    "w": {
      "1": "[Metric substitution] Price per call omits the cost of failing the required quality floor.",
      "2": "[Unmeasured expansion] No evidence gap has been identified, so the added input has no demonstrated cost benefit.",
      "3": "[Overengineering] The tested within-model adjustment meets the goal without an established need for extra orchestration."
    }
  },
  "q070": {
    "q": "A hospital booking center uses Claude to organize nonclinical registration documents. Its goal is a shorter cycle from receipt to completed registration. Traces show generation is already quick; most waiting occurs in the manual queue for missing documents. Which change best addresses the goal?",
    "o": [
      "Move generation to a faster model tier while keeping the current missing-document queue",
      "Evaluate the first visible summary and accept efficiency gains from response timing",
      "Improve the final registration receipt so applicants can read the result more easily",
      "Assign missing-material requests and owners; track time from receipt of materials to registration"
    ],
    "e": "Efficiency concerns the complete process. The identified bottleneck calls for better document requests and handoffs rather than faster generation. See notes 1.6.",
    "w": {
      "0": "[Model substitution] The identified delay is in the business queue, which a model change leaves untouched.",
      "1": "[Metric substitution] Visible response timing omits the wait for documents and completed registration.",
      "2": "[Wrong-layer diagnosis] Final receipt wording occurs after the bottleneck and does not shorten the document queue."
    }
  }
});
