/* Domain 3：q004–q038；答案下标沿用 questions.js。 */
Object.assign(CONTENT_EN.questions, {
  "q004": {
    "q": "A university runs separate agents for admissions guidance and student-record corrections, both with the same administrative tools. Guidance needs public information; record correction needs write access. Which configuration preserves both services while limiting each agent to its role?",
    "o": [
      "Log roles and actions at the shared entry point and review access daily",
      "Move both agents to a model with stronger role reasoning and use the shared catalog",
      "Require approval for guidance-agent writes within the shared tool catalog",
      "Assign role-specific tools and permissions for queries and record corrections"
    ],
    "e": "The roles need different capabilities. Separate toolsets and execution permissions preserve necessary record updates while removing unrelated write paths from admissions guidance. See notes 3.1.",
    "w": {
      "0": "[Audit as prevention] Daily reports reveal completed actions; they do not impose role boundaries before execution.",
      "1": "[Model substitution] A model upgrade does not remove write paths from the guidance agent.",
      "2": "[Guarding excess capability] Approval leaves unrelated write capabilities with the guidance role instead of limiting its configuration."
    }
  },
  "q005": {
    "q": "An operations assistant repeatedly picks the wrong diagnostic tool. Replays show several entry points querying the same source, with descriptions that omit input scope. Execution permissions already match the role. Which tool-configuration change should the team prioritize?",
    "o": [
      "Assign an agent to each tool and add a coordinator to route calls",
      "Upgrade to a model with stronger tool selection using the existing definitions",
      "Add tool examples and include the entire call history in each request",
      "Consolidate duplicate entry points and clarify their inputs and use cases"
    ],
    "e": "Duplicate entry points and unclear descriptions are observed causes. Clarifying the tool boundaries addresses them directly; replaying the same cases tests whether selection improves. See notes 3.1.",
    "w": {
      "0": "[Overengineering] No independent planning is needed. Extra agents add routing work while inheriting the ambiguous descriptions.",
      "1": "[Model substitution] The evidence points to ambiguous tools. Replacing the model without evaluation skips that cause.",
      "2": "[Unmeasured expansion] More context leaves duplicate responsibilities intact and can add selection noise."
    }
  },
  "q006": {
    "q": "An insurance claims agent must inspect cases and submit approved payouts. Its toolset also includes product pricing and account deletion. Reviewers require the payout workflow to remain available with controls before execution; logging already exists. Which changes meet those requirements together? Select 2.",
    "o": [
      "Remove unrelated tools and their execution permissions",
      "Retain pricing and deletion tools, with approval from the duty officer",
      "Centralize payout-log reviews and investigate anomalies under existing permissions",
      "Authorize each required payout and obtain owner approval for high-risk payments",
      "Make every tool read-only and hand payout submission back to staff"
    ],
    "e": "Remove capabilities unrelated to claims, then control the writes the workflow actually needs. Authorization checks and approval are appropriate for necessary payouts, whereas approval alone would leave unrelated tools available. See notes 3.1.",
    "w": {
      "1": "[Guarding excess capability] Those actions are outside the claims task; approval retains capabilities that should be removed.",
      "2": "[Audit as prevention] Later review does not meet the requirement for pre-execution controls; existing logs do not restrict access.",
      "4": "[Wrong-layer diagnosis] Removing necessary writes breaks the required agent payout workflow instead of limiting unrelated capabilities."
    }
  },
  "q007": {
    "q": "A public-service portal lets applicants use an assistant to view their own grant documents. The identity service supports delegated access, and attachments must remain isolated between applicants. Which identity and authorization design best fits the document integration?",
    "o": [
      "Use an application account for attachment queries and state the applicant boundary in each system prompt",
      "Use the applicant’s delegated identity and authorize the attachment and operation before reading",
      "Reduce authorization round trips with a service account covering all attachments",
      "Read with an application account and audit ownership mismatches afterward"
    ],
    "e": "The request acts for the applicant. Delegation carries that identity, while execution checks whether the requested attachment and operation are permitted. Authentication alone does not authorize every document. See notes 3.2.",
    "w": {
      "0": "[Prompt as enforcement] A prompt cannot enforce attachment isolation when execution still uses application-wide access.",
      "2": "[Compliance shortcut] This explicitly trades the required applicant boundary for fewer authorization requests.",
      "3": "[Audit as prevention] An ownership audit after the read cannot prevent cross-applicant access."
    }
  },
  "q008": {
    "q": "A hospital runs an unattended overnight job that reads an approved equipment catalog, with no patient data or signed-in user. The application may perform this job, but credentials must stay outside model context. Which approach fits?",
    "o": [
      "Request delegated user access for each run and wait for a staff member to sign in",
      "Use a restricted service account with credentials in protected startup configuration read by the model",
      "Keep privileged access and audit for patient-record reads after each run",
      "Use a restricted service account with credentials supplied by trusted execution"
    ],
    "e": "The job acts for the application, so a restricted service account matches its approved catalog role. Trusted execution holds and supplies credentials without exposing them through prompts or tool results. See notes 3.2.",
    "w": {
      "0": "[Wrong-layer diagnosis] This is an authorized application task with no online user. Requiring staff login defeats unattended operation.",
      "1": "[Compliance shortcut] Protecting the configuration file does not keep credentials outside model context once the model reads it.",
      "2": "[Audit as prevention] A later audit cannot replace restricting the account before execution; the job needs no patient access."
    }
  },
  "q009": {
    "q": "A bank connects to a protected reporting service through remote MCP using the MCP 2025-11-25 authorization specification. The draft forwards the MCP access token to a downstream API and includes debug credentials in tool results. Which changes are required before release? Select 2.",
    "o": [
      "Keep token forwarding and use post-request audits to detect misuse",
      "Validate the MCP token audience and separately authorize downstream access",
      "Accept tokens issued for another service while supporting the legacy interface",
      "Move debug credentials into the system prompt and instruct the model to hide them",
      "Hold credentials in trusted execution and redact tool results and logs"
    ],
    "e": "The MCP server must validate its token audience rather than forward incoming tokens downstream. Credentials belong in trusted execution, with redaction for diagnostic output. These changes address both authorization boundaries and secret exposure. See notes 3.2.",
    "w": {
      "0": "[Audit as prevention] Audit records replace neither audience validation nor the prohibition on passing incoming tokens through.",
      "2": "[Compliance shortcut] Compatibility does not justify waiving audience restrictions for the protected resource.",
      "3": "[Prompt as enforcement] The credentials remain in model context; a concealment instruction is not a credential boundary."
    }
  },
  "q010": {
    "q": "A store inventory assistant reads a supplier document containing instructions to inspect another franchisee’s stock. The user is authenticated but authorized only for the current store. Where should the system stop the unauthorized read?",
    "o": [
      "Provide store rules before each tool call and ask the model to check the target resource",
      "At tool execution, authorize the user, store, and target resource before reading",
      "Read for the signed-in user and audit references to other stores afterward",
      "Choose a model better at spotting malicious text and retain the execution path"
    ],
    "e": "The supplier document cannot expand the user’s authority. Checking the store, resource, and operation on each call blocks unauthorized retrieval before data leaves the controlled service. See notes 3.2.",
    "w": {
      "0": "[Prompt as enforcement] Instructions in retrieved material are untrusted; a prompt does not enforce resource authorization.",
      "2": "[Audit as prevention] Authentication does not grant access to other stores, and later auditing cannot undo the read.",
      "3": "[Model substitution] Improved injection detection does not enforce the store boundary at execution."
    }
  },
  "q011": {
    "q": "A multi-tenant development platform enforces identity and resource authorization at tool execution. A disputed build-record read requires investigation, but logs contain only the agent reply and HTTP status. Which linked records best establish who requested the read, whether the gateway allowed it, and what was accessed?",
    "o": [
      "Link caller, tenant, target, and operation to the authorization decision and execution result",
      "Link login accounts to token issuance, expiry, and refresh events within each session",
      "Aggregate call counts, error rates, and duration by tenant and flag unusual traffic periods",
      "Link queries to database connection accounts, execution plans, and scanned rows for slow-query analysis"
    ],
    "e": "Accountability requires linking the business caller, tenant, and target to the authorization decision and execution outcome. Session logs identify logins, while a database account may represent the application rather than the requesting user. See notes 3.2.",
    "w": {
      "1": "[Wrong-layer diagnosis] Session records support identity investigations but omit the target and authorization decision for this read.",
      "2": "[Metric substitution] Tenant-level aggregates can flag unusual traffic but cannot attribute a particular read or its authorization decision.",
      "3": "[Wrong-layer diagnosis] Query diagnostics describe database execution; the connection account may not identify the requesting user and does not record the gateway decision."
    }
  },
  "q012": {
    "q": "An online course assistant meets its answer-quality target, but learners see nothing until a long response finishes. The product team wants to reduce that initial blank wait while still tracking completion time. Which change best matches this goal?",
    "o": [
      "Increase reasoning effort so the model checks more steps before answering",
      "Stream responses and measure first useful content separately from completion",
      "Route interactive requests to a faster, smaller model and accept releases by cost per call",
      "Submit course requests to Message Batches and deliver responses when ready"
    ],
    "e": "The immediate problem is that generated content remains invisible. Streaming addresses that wait. End-to-end completion still needs its own measurement; earlier visible output does not prove earlier task completion. See notes 3.3.",
    "w": {
      "0": "[Unmeasured expansion] Quality already meets the target; additional reasoning does not address the blank wait and may extend it.",
      "2": "[Model substitution] A cheaper model has not been shown to preserve quality or improve the required user experience.",
      "3": "[Data-shape mismatch] Batch delivery suits work that can wait, not a learner waiting for the first part of an interactive answer."
    }
  },
  "q013": {
    "q": "A retail operations team rewrites product descriptions offline. Requests are independent, downstream jobs consume completed results, and immediate delivery is unnecessary. API cost is the priority, and expired requests can be handled. Which processing approach fits best?",
    "o": [
      "Process with Message Batches and track completion and expiry for each request",
      "Increase reasoning effort and process synchronously to reduce later review",
      "Have multiple agents negotiate writing style before producing each description",
      "Send standard API requests concurrently and assess descriptions completed per hour"
    ],
    "e": "The requests are independent and can wait, matching asynchronous Message Batches and its 50% discount. Most batches finish within one hour, but that is not a guarantee; requests unfinished after 24 hours must be handled. See notes 3.3.",
    "w": {
      "1": "[Unmeasured expansion] No quality shortfall justifies extra reasoning, and it ignores the cost opportunity created by deferred delivery.",
      "2": "[Overengineering] Independent rewriting needs no negotiation; additional agents introduce unnecessary exchanges.",
      "3": "[Metric substitution] Concurrency can shorten waits without lowering call volume or obtaining the batch discount; throughput is not cost."
    }
  },
  "q014": {
    "q": "A procurement tool has sufficient evidence. Repeated offline evaluations show that a lightweight model meets the quality target on simple cases with lower p95 latency and cost per success than the current model. Only a higher-capability model meets the complex-case quality target, within the department’s cost and latency limits; routing by difficulty has also been evaluated on the same set. Which arrangements fit? Select 2.",
    "o": [
      "Route simple cases to the lightweight model and complex cases to the higher-capability model",
      "Keep the current model on complex cases and retrieve additional source passages for the comparisons",
      "Replay cases by difficulty after rollout, tracking quality, p95, and cost per successful task",
      "Move both case types to the lightweight model and standardize their output templates",
      "Choose one configuration by average call price and periodically total requests by category"
    ],
    "e": "The evaluation supports different models for the two case types within all required limits. Continuing the same evaluation after rollout checks whether changing traffic affects those benefits; model choice follows workload evidence. See notes 3.3.",
    "w": {
      "1": "[Unmeasured expansion] Evidence is already sufficient; adding candidates does not address the measured complex-case reasoning shortfall.",
      "3": "[Model substitution] Extending the lightweight model to complex cases contradicts the measured quality result; a common template has not been shown to close that gap.",
      "4": "[Metric substitution] Average call price and request counts omit quality by case type, tail latency, and cost per successful task."
    }
  },
  "q015": {
    "q": "A hospital scheduling assistant reads available clinic slots and a patient’s confirmed appointments in sequence. The reads are independent and do not modify shared data. Traces show these external waits dominate latency, while recommendation quality meets the target. Which optimization should be tested first?",
    "o": [
      "Increase reasoning effort so the model can plan the queries in more detail",
      "Stream progress updates and assess scheduling performance by time to first visible content",
      "Run the independent reads concurrently, then continue with both results",
      "Use a faster model while keeping the external reads in their original order"
    ],
    "e": "The application can run independent reads concurrently and combine their results. Measure the resulting end-to-end latency; concurrency does not itself reduce the number of calls. See notes 3.3.",
    "w": {
      "0": "[Unmeasured expansion] The traces already locate independent external waits; more reasoning does not remove their serialization.",
      "1": "[Metric substitution] Initial progress text excludes the waits for both lookups and does not measure when the scheduling recommendation is complete.",
      "3": "[Model substitution] The untested model change leaves the dominant source of delay untouched."
    }
  },
  "q016": {
    "q": "A code-migration assistant has steady HTTP success rates, yet developers report patches that sometimes omit required files. Its dashboard records request status and total duration without linking intermediate tool calls. Which observations should be added first?",
    "o": [
      "Link patch completeness and other task outcomes to model, tool, and retry traces",
      "Set an expected patch-length range and monitor the share of outputs within it",
      "Increase reasoning effort and generate longer explanations of the changes",
      "Break down HTTP success by tool and operation, increasing sampling during anomalous periods"
    ],
    "e": "Request success and task success are different. Linking patch completeness to execution traces makes it possible to investigate generation, tool use, and retries rather than infer success from HTTP status. See notes 3.4.",
    "w": {
      "1": "[Metric substitution] Patch length proves neither required-file coverage nor the absence of intermediate tool failures.",
      "2": "[Unmeasured expansion] Longer output does not reveal where the omission occurred in the unobserved execution path.",
      "3": "[Metric substitution] More frequent transport measurements still do not establish whether the patch fulfills the migration."
    }
  },
  "q017": {
    "q": "A municipal helpline uses a model and an existing rubric to assess large volumes of policy answers. Human spot checks find highly rated answers whose citations do not support their conclusions. The judge receives the cited source passages; full manual review is impractical. What should the team do?",
    "o": [
      "Keep the rubric and count high judge scores directly as task successes",
      "Use a larger judging model and keep the current interpretation of its scores",
      "Refine citation criteria and calibrate scores against human samples",
      "Expand retrieval context for each answer so the judge reads more material"
    ],
    "e": "Automated judging scales coverage but needs explicit criteria and human calibration. Refine the known citation-support failure and sample by scenario to test whether the scores track actual quality. See notes 3.4.",
    "w": {
      "0": "[Metric substitution] The observed disagreement means judge scores cannot be treated directly as verified task outcomes.",
      "1": "[Model substitution] An untested model change does not establish that grading bias has improved or remove the need for calibration.",
      "3": "[Unmeasured expansion] Insufficient evidence has not been established; more material does not calibrate the grading behavior."
    }
  },
  "q018": {
    "q": "A clinical documentation assistant has intermittent token spikes, and engineers suspect retrieval retries. Production data contains personal information; the hospital permits only risk-based sampling after redaction, with access and retention limits. Which observations fit these constraints? Select 2.",
    "o": [
      "Move documentation requests to a smaller model and review daily spending changes",
      "Temporarily retain full copies of raw records, prompts, and tool results for replay",
      "Link each retrieval retry span and its duration to input and output token usage",
      "Sample redacted inputs and outputs under the approved access and retention rules",
      "Build a usage baseline from final response length and monitor deviations"
    ],
    "e": "Spans linked to usage can test whether retries cause the extra token consumption. Content sampling must respect the approved privacy controls; diagnosis does not require unrestricted retention of production text. See notes 3.4.",
    "w": {
      "0": "[Model substitution] Changing models without tracing the retries does not establish that the suspected failure has been resolved.",
      "1": "[Compliance shortcut] Replay convenience does not justify breaching the explicit redaction and sampling requirements.",
      "4": "[Metric substitution] The final response length does not measure token use across repeated calls and retries."
    }
  },
  "q019": {
    "q": "A school’s financial-aid assistant counts successful model requests as completed answers. Students sometimes receive only a notice that application rules are being searched; logs include tool_use and some max_tokens stops. How should completion monitoring change?",
    "o": [
      "Determine completion by linking stop reasons, subsequent tool results, and answer outcomes",
      "Add more rules and conversation history to each request and track HTTP success",
      "Use a larger model for application questions and total successfully returned requests",
      "Count end_turn responses as completed answers and queue other stop reasons for review"
    ],
    "e": "tool_use calls for tool execution, max_tokens indicates a generation limit, and end_turn marks the model’s natural response ending. Monitoring must connect these signals to execution and the student’s actual outcome. See notes 3.4.",
    "w": {
      "1": "[Unmeasured expansion] Adding rules and history to the input neither verifies tool execution nor fixes the request-based completion metric.",
      "2": "[Model substitution] A model change does not turn request success into evidence of task completion.",
      "3": "[Metric substitution] A naturally ended response does not establish that the student received a satisfactory answer."
    }
  },
  "q020": {
    "q": "An insurance-policy assistant retrieves an exclusion clause, but the chunk says “this rider” without identifying the product. Source documents have product and clause headings; ingestion uses fixed-length chunks. Which change should address the incomplete evidence first?",
    "o": [
      "Upgrade the answer model to infer the product from the clause content",
      "Add a product-name field to the answer template and measure field completion",
      "Expand the candidate window so the model can assemble context from nearby clauses and heading passages",
      "Chunk at clause boundaries and retain product and section context for each passage"
    ],
    "e": "The chunk has lost its subject. Preserving structure and passage-level context makes the evidence interpretable before generation; retrieval and answer quality can then be evaluated. See notes 3.5.",
    "w": {
      "0": "[Model substitution] The evidence lacks referential context; a larger model cannot reliably restore the missing attribution.",
      "1": "[Metric substitution] A populated product field does not establish correct attribution or restore the missing subject in the evidence.",
      "2": "[Unmeasured expansion] More candidates do not guarantee the heading will return and leave the broken chunk boundary in place."
    }
  },
  "q021": {
    "q": "A laboratory-guideline search service already combines BM25 and vector retrieval. Offline tests find relevant testing conditions just beyond the current candidate cutoff. A moderate expansion meets retrieval and answer-quality targets within the p95 limit, while further expansion brings no gain. Which adjustment should be deployed?",
    "o": [
      "Upgrade the generator using guideline passages returned by the current cutoff",
      "Use the largest tested candidate pool to provide headroom for rare laboratory queries",
      "Expand to the moderate candidate pool and monitor retrieval and answer quality",
      "Rerank the candidates remaining after the current cutoff to improve their order"
    ],
    "e": "Local evaluation supports a moderate candidate expansion within quality and latency limits. Reranking after the cutoff cannot recover excluded passages, and the largest tested pool offers no additional benefit. See notes 3.5.",
    "w": {
      "0": "[Model substitution] The retrieval cutoff excludes the evidence; changing the generator leaves that omission in place.",
      "1": "[Unmeasured expansion] The largest pool has no measured quality benefit; the proposed headroom for rare queries is unsupported.",
      "3": "[Wrong-layer diagnosis] The failure is candidate coverage at the cutoff; reranking the surviving passages cannot recover excluded conditions."
    }
  },
  "q022": {
    "q": "A retailer publishes versioned product guides, but answers still cite retired specifications. The vector index was refreshed while the lexical index and chunk metadata were not. Source traceability must be retained. Which changes address the problem? Select 2.",
    "o": [
      "Keep the indexes and instruct the generator to use more cautious wording",
      "Update affected chunks and both indexes, removing retired versions",
      "Enable streaming and monitor the version rollout by time to first response",
      "Increase top-k for both indexes and favor newer passages during generation",
      "Maintain document IDs, versions, and update times; verify cited retrieval sources"
    ],
    "e": "Both indexes and their metadata must follow source changes, with retired content removed from candidates. Source identifiers and retrieval checks establish that current material is retrievable and citations remain traceable. See notes 3.5.",
    "w": {
      "0": "[Wrong-layer diagnosis] The failure concerns index versions; cautious wording does not make retired specifications current.",
      "2": "[Metric substitution] Earlier output does not establish that the answer cites the current version.",
      "3": "[Unmeasured expansion] A larger candidate set retains stale evidence and does not synchronize the indexes."
    }
  },
  "q023": {
    "q": "An engineering knowledge base is changing embedding models. Output dimensions match, but the provider does not guarantee compatible vector spaces. Production still queries the old index, and retrieval quality must be validated before cutover. Which migration plan fits?",
    "o": [
      "Defer migration, retain the old embedding model, and expand the query candidate pool",
      "Rebuild document embeddings with the new model and validate retrieval before cutover",
      "Mix new query vectors with old document vectors based on matching dimensions",
      "Keep the old embedding model and index, and switch to a larger answer model"
    ],
    "e": "Without a compatibility guarantee, query and document vectors need a compatible representation. Rebuild and validate the new index before cutover rather than infer semantic compatibility from dimensionality. See notes 3.5.",
    "w": {
      "0": "[Unmeasured expansion] No retrieval evaluation supports expanding the old system’s candidates, and this does not validate the planned migration.",
      "2": "[Data-shape mismatch] Equal dimensions do not establish a shared semantic space for comparing those representations.",
      "3": "[Model substitution] The answer-model upgrade lacks evaluation support and does not test retrieval with the new embedding model."
    }
  },
  "q024": {
    "q": "Policy retrieval has adequate candidate coverage, but the current reranker often puts applicable clauses below the context cutoff. On the same offline evaluation set, an alternative reranking model improves evidence selection and answer quality with unchanged candidate and output counts. Its added p95 latency and cost fit the budget. Which change is best supported?",
    "o": [
      "Increase generation effort so the model compares the supplied clauses more thoroughly",
      "Set a release threshold for the number of clauses cited and review citation coverage",
      "Switch to the alternative reranker and monitor production with the same acceptance criteria",
      "Keep the current reranker and expand the initial pool to provide more clauses for ranking"
    ],
    "e": "The alternative reranker improves the required outcomes at the same retrieval sizes and within budget. That evidence supports switching, with continued production checks against the original criteria. See notes 3.5.",
    "w": {
      "0": "[Unmeasured expansion] The applicable clauses are excluded from generation context; more generation effort does not fix their ranking before the cutoff.",
      "1": "[Metric substitution] Citation counts do not establish applicability and can reward additional irrelevant clauses.",
      "3": "[Unmeasured expansion] Candidate coverage already meets the target; expanding it has no demonstrated ranking benefit."
    }
  },
  "q025": {
    "q": "A retail finance assistant must total confirmed orders by store and join returns to deduct refunds. The records are in a controlled relational database, and the report requires exact results. Which data-access method fits this query?",
    "o": [
      "Use a stronger reasoning model with the same sampled order passages",
      "Perform filtering, joins, and aggregation through controlled SQL or an API",
      "Embed order rows and estimate totals from similar records",
      "Retrieve historical store summaries and calculate from their narrative figures"
    ],
    "e": "The task requires deterministic filtering, joins, and sums. A controlled database query or business API should calculate the result, which the model can then explain. See notes 3.6.",
    "w": {
      "0": "[Data-shape mismatch] Sampled order passages cannot support exact aggregation over all required orders and returns; a stronger model cannot supply omitted records.",
      "2": "[Data-shape mismatch] Semantic neighbors do not guarantee the required record set or replace exact aggregation.",
      "3": "[Data-shape mismatch] Historical narratives are not the requested order and return relations and cannot guarantee the report’s scope."
    }
  },
  "q026": {
    "q": "A university’s academic handbook is small and stable. Full-context answers already meet quality requirements, with room left for questions and output. A small team maintains the service, and students repeatedly query the same handbook. Which architecture is most appropriate next?",
    "o": [
      "Repeat the handbook in extra examples to increase attention to its rules",
      "Build a multi-agent retrieval workflow with separate chapter owners",
      "Build a vector index, maintain chunk updates, and retrieve relevant handbook passages",
      "Retain full context and evaluate prompt-caching eligibility and savings"
    ],
    "e": "The small, stable corpus already works in full context. Caching may reuse eligible stable-prefix processing, but minimum-length requirements, hit rates, and actual savings still need checking. See notes 3.6.",
    "w": {
      "0": "[Unmeasured expansion] Quality already meets the target; repeating the same material adds occupancy without new evidence.",
      "1": "[Overengineering] Full-context quality is established and the corpus is small; extra agents add work without a matching need.",
      "2": "[Overengineering] The current approach meets space and quality constraints; a new retrieval pipeline adds maintenance."
    }
  },
  "q027": {
    "q": "A securities operations assistant must identify the affected legal entity from an incident report, then retrieve that entity’s current settlement status. Reports use varied wording, status changes frequently, and the second step depends on the identified entity. Which access strategies fit? Select 2.",
    "o": [
      "Identify the entity from semantic evidence and carry its source into the next lookup",
      "Retrieve the entity with the closest name and read its latest settlement record",
      "Expand the offline settlement index and answer from more historical statuses",
      "Launch entity identification and status lookup together, then merge the results",
      "Query a live status tool for the confirmed entity and check the response timestamp"
    ],
    "e": "This is a dependent multi-step lookup: establish the entity, then query its current status. Semantic evidence handles wording variation, while a live tool supplies fresh state with a verifiable timestamp. See notes 3.6.",
    "w": {
      "1": "[Data-shape mismatch] A similar entity is not the target, so its record cannot establish the requested status.",
      "2": "[Data-shape mismatch] The query requires frequently changing current state, which an offline historical index cannot supply; more history does not resolve that mismatch.",
      "3": "[Wrong-layer diagnosis] The status lookup needs an entity that has not yet been established; parallel dispatch violates that dependency."
    }
  },
  "q028": {
    "q": "An equipment recall registry exposes an API keyed by unique serial number. Hospital staff must establish whether a particular device belongs to the current recall batch; similar serial numbers may belong to different batches. Which lookup should the assistant use?",
    "o": [
      "Look up the serial number exactly and verify the returned status and source",
      "Use the serial number as a semantic query and take the nearest registry record",
      "Use a stronger model to read past notices and compare similar serial numbers",
      "Query the registry by serial number and mark successful API responses as recall matches"
    ],
    "e": "A unique serial number calls for an exact lookup. The registry API identifies the target device; checking its returned status and source supports the current recall decision. See notes 3.6.",
    "w": {
      "1": "[Data-shape mismatch] A unique key requires equality; vector proximity does not establish the device’s identity.",
      "2": "[Data-shape mismatch] Similar identifiers in historical notices cannot establish the current batch membership of a unique device; changing models does not alter the exact-lookup requirement.",
      "3": "[Metric substitution] A successful API response establishes that the request was processed, not that the returned device belongs to the recall batch."
    }
  },
  "q029": {
    "q": "A municipal expense system must call another department’s validation function after approval. A stable API already exists, inputs and outputs are fixed, and only this application needs it. There is no independent planning. Which integration best minimizes additional maintenance?",
    "o": [
      "Wrap the API in an MCP server before connecting the single application",
      "Call the existing API and handle argument checks and failures in the application",
      "Deploy an agent in each department and negotiate every validation task",
      "Dispatch the call to specialist agents and have a coordinator select a result"
    ],
    "e": "A fixed operation, one consumer, and a stable interface favor a direct API call. Crossing a department boundary does not by itself require MCP or another planning agent. See notes 3.7.",
    "w": {
      "0": "[Overengineering] With no cross-client reuse requirement, the protocol server adds maintenance without addressing a gap.",
      "2": "[Overengineering] The validation endpoint already performs the required operation. Adding negotiation between agents creates maintenance work without a planning requirement.",
      "3": "[Overengineering] The existing interface performs the operation; multiple agents and result selection add no required function."
    }
  },
  "q030": {
    "q": "A financial group wants compatible clients to share report-query tools, reference material, and user-selected analysis templates. Each client supports the required MCP capabilities, but teams currently maintain separate adapters. Which interface design should be preferred?",
    "o": [
      "Assign planning agents to the clients and negotiate each query workflow",
      "Maintain per-client adapters and assess integration by cross-client connection success",
      "Copy the shared material into more prompts to reduce reliance on interfaces",
      "Share capabilities through MCP with authorization and compatibility checks"
    ],
    "e": "The compatible clients need shared access to several capability types, which a standard MCP interface supports. Authorization and compatibility remain responsibilities after the interface is introduced. See notes 3.7.",
    "w": {
      "0": "[Overengineering] The requirement is interface reuse, not independent planning or negotiated workflows.",
      "1": "[Metric substitution] Successful connections do not establish reduced adapter duplication or shared interfaces.",
      "2": "[Unmeasured expansion] Duplicating text does not standardize callable tools or solve multi-client integration maintenance."
    }
  },
  "q031": {
    "q": "A university delegates course-material accessibility work to a partner’s agent. The partner plans its own checks and reports progress rather than executing one fixed function. Access is restricted to agreed courses, while the department directory also contains other courses. Both parties need failure investigation and task recovery. Which design choices fit? Select 2.",
    "o": [
      "Feed message receipts into the task dashboard and assess delivery by receipt success",
      "Use a task-delegation boundary with agreed identity, status, and output format",
      "Agree on timeouts, retries, and result checks; budget for repeated exchanges",
      "Grant the partner inherited access to the department’s material directory for course access",
      "Treat the partner as a stateless lookup and accept a text response as delivery"
    ],
    "e": "The partner plans independently, so the integration should delegate a task outcome. The parties must agree on identity, state, deliverables, and recovery; these are engineering requirements, not assumed guarantees of an A2A protocol. See notes 3.7.",
    "w": {
      "0": "[Metric substitution] Delivered messages do not establish successful completion of the delegated remediation.",
      "3": "[Compliance shortcut] Inherited department-directory access covers courses outside the agreement, expanding the permitted scope for administrative convenience.",
      "4": "[Data-shape mismatch] The delegated work is a stateful task, so a simple lookup contract omits the required progress and recovery handling."
    }
  },
  "q032": {
    "q": "A retailer will host an inventory MCP service for remote store clients; it cannot run as a local subprocess at each store. Both sides support the MCP 2025-11-25 transport and authorization specifications, and inventory access requires caller and resource authorization. Which deployment fits?",
    "o": [
      "Use Streamable HTTP and verify client authorization and permission support",
      "Use the stdio message channel with the hosted service endpoint as its launch address",
      "Add inter-store agents to negotiate and manage each fixed inventory request",
      "Authenticate at the store portal and let inventory access follow client-supplied role fields"
    ],
    "e": "A remotely hosted service calls for supported Streamable HTTP and protected-HTTP authorization. stdio fits local subprocess use. Resource permissions still need enforcement after transport connectivity is established. See notes 3.7.",
    "w": {
      "1": "[Data-shape mismatch] The local subprocess pattern does not fit the required hosted service and prohibition on local startup.",
      "2": "[Overengineering] Remote access to a fixed capability does not require an additional agent-negotiation layer.",
      "3": "[Compliance shortcut] Client-supplied roles are not verified authorization decisions; portal login alone does not enforce the inventory resource boundary."
    }
  },
  "q033": {
    "q": "A developer-tools team wants reusable incident-review interaction templates that engineers explicitly select in the UI. A template may then refer to resources and tools. The client supports the three MCP server primitives. Which primitive should represent the template itself?",
    "o": [
      "Deploy a separate agent to plan the work and choose a template",
      "Expose it as tools and let the model decide when to invoke the template",
      "Expose it as prompts for users to select reusable interaction templates",
      "Expose it as resources and have the application select context automatically"
    ],
    "e": "Prompts provide reusable interaction templates under user control. Tools are model-controlled and resources are application-controlled. Referring to those capabilities does not change who selects the template. See notes 3.7.",
    "w": {
      "0": "[Overengineering] Template selection needs no additional planner, and delegating the choice changes the required user control.",
      "1": "[Data-shape mismatch] The required object is a user-selected template, not a model-selected callable function.",
      "3": "[Data-shape mismatch] Application-selected context is different from the user-selected interaction template required here."
    }
  },
  "q034": {
    "q": "A hospital equipment-research assistant uses a growing tool catalog but needs only a small subset per investigation. Preloading definitions increases context use and selection errors. The needed tools are discoverable through search. Which loading strategy should be preferred?",
    "o": [
      "Cache the full tool prefix and assess the loading strategy by its hit rate",
      "Use a larger model for the catalog and deploy the existing loading strategy",
      "Find and load definitions per task, checking discovery overhead and missed tools",
      "Preload the full catalog in business groups and add examples to guide tool selection"
    ],
    "e": "A large catalog with sparse per-task use favors on-demand discovery. Evaluation should include discovery latency and missed capabilities as well as the reduction in preloaded context. See notes 3.8.",
    "w": {
      "0": "[Metric substitution] A cache hit measures reused input processing, not the absence of interference in the model’s context.",
      "1": "[Model substitution] An untested model change leaves the overhead of irrelevant preloaded definitions in place.",
      "3": "[Unmeasured expansion] Additional examples retain the occupancy and distraction of definitions that most tasks do not need."
    }
  },
  "q035": {
    "q": "A public-service assistant maintains several procedure manuals, but each task needs the detailed steps from only one. Every request currently includes all manuals, making context and updates cumbersome. The client supports Agent Skills. How should procedural knowledge be organized?",
    "o": [
      "Expose Skill names and descriptions, then load relevant instructions and references",
      "Keep all manuals in context and add examples to help the model distinguish them",
      "Cache the full manual prefix and assess procedure selection by cache-hit rate",
      "Assign each manual to a persistent agent and ask all agents which one applies"
    ],
    "e": "Skills expose metadata for task selection, followed by relevant instructions and referenced files. Clear names and descriptions remain necessary so progressive loading finds the right procedure. See notes 3.8.",
    "w": {
      "1": "[Unmeasured expansion] Extra examples leave every request carrying the irrelevant manuals.",
      "2": "[Metric substitution] Cache reuse does not show that the right procedure was selected or that irrelevant context was reduced.",
      "3": "[Overengineering] The manuals are task-specific instructions; selecting one does not require multiple agents to negotiate."
    }
  },
  "q036": {
    "q": "A development-platform agent needs a small set of basic tools on every request and rarely uses its specialist tools. On-demand discovery reduces context use but adds search round trips to some requests. Authorization requirements are unchanged. Which adjustments fit? Select 2.",
    "o": [
      "Preload the tools needed on every request and discover specialist definitions as needed",
      "Set the release threshold by tool-search hit rate and aggregate results by task type",
      "Cache tool visibility from discovery as authorization for subsequent execution",
      "Measure discovery and execution latency separately; retain permissions and result sources",
      "Load additional specialist-tool examples with every request"
    ],
    "e": "Preloading common entry points avoids repeated discovery while rare definitions remain deferred. Measure discovery cost and execution outcomes separately, and preserve authorization regardless of the loading strategy. See notes 3.8.",
    "w": {
      "1": "[Metric substitution] Finding tools does not establish successful execution of the task.",
      "2": "[Compliance shortcut] Visibility during discovery does not authorize a resource operation; reusing it bypasses the unchanged execution-permission requirement.",
      "4": "[Unmeasured expansion] Repeatedly loading rare material may undo discovery savings without evidence that the extra context helps."
    }
  },
  "q037": {
    "q": "A university research assistant compares independent course collections. Investigations are lengthy, but the main task needs evidence summaries and applicable conditions. Delegation overhead is acceptable, yet compressed summaries sometimes lose attribution. Which context design fits best?",
    "o": [
      "Split retrieval across more subagents to reduce how much each one must compress",
      "Isolate subtask contexts and verify summaries that include sources and conditions",
      "Accumulate source material and intermediate replies in the main context",
      "Use a larger model to produce evidence summaries and let it choose the attribution format"
    ],
    "e": "Independent investigations suit isolated contexts, but their handoffs must retain evidence, sources, and conditions needed by the main task. Verify those summaries and account for delegation overhead. See notes 3.8.",
    "w": {
      "0": "[Overengineering] The loss occurs in handoff content; more agents do not establish summary requirements or verification.",
      "2": "[Unmeasured expansion] The main task needs selected evidence; accumulation adds context without fixing attribution lost during summarization.",
      "3": "[Model substitution] Attribution is being lost at handoff; the model upgrade and free-form attribution have not been shown to preserve required sources and conditions."
    }
  },
  "q038": {
    "q": "A finance agent uses on-demand discovery but often misses an installed reporting tool. Connectivity and execution permissions are working. Tool descriptions contain only internal abbreviations, while users ask about business purposes. Which improvements should come first? Select 2.",
    "o": [
      "Include the complete reporting manual on each request as a lookup reference",
      "Route discovery requests to a larger model using the existing abbreviated catalog",
      "Describe business purposes, inputs, and usage conditions in discovery metadata",
      "Keep discovery unchanged and improve the wording of returned reports",
      "Replay failed business requests and check each tool’s discovery and execution"
    ],
    "e": "Discovery depends on searchable names and descriptions. After adding business meaning, replay the requests that previously failed to establish whether the tool is found and used correctly. See notes 3.8.",
    "w": {
      "0": "[Unmeasured expansion] More material does not clarify the catalog metadata and adds context to every request.",
      "1": "[Model substitution] The evidence points to discovery metadata; a model upgrade leaves that mismatch intact.",
      "3": "[Wrong-layer diagnosis] The tool is missed before execution; changing its eventual output does not address discovery."
    }
  }
});
