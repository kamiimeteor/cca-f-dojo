/* Domain 6: q127–q153; option indices match questions.js. */
Object.assign(CONTENT_EN.questions, {
  "q127": {
    "q": "A retailer is scoping a shift-handover assistant, and regional managers have listed the summary fields they want. Night staff also handle return exceptions that day staff never see, but only managers have attended discovery meetings. What should the next meeting prioritize?",
    "o": [
      "Have frontline shift staff demonstrate exception handling step by step, recording the actual steps and handoff points",
      "Add a night-shift exception agent that automatically fills gaps in handover summaries",
      "Ask regional managers to describe night-shift exception practices and make a manager the requirements acceptance owner",
      "Measure how often the managers' fields appear in trial-visit records, and close discovery once coverage reaches the target"
    ],
    "e": "Discovery must include the people doing the work, particularly those handling exceptions. Having them walk through real cases reveals missing steps and handoff points. See notes 6.1.",
    "w": {
      "1": "[Overengineering] Adding an agent before the exception workflow is understood does not uncover the steps night staff actually take.",
      "2": "[Wrong-layer diagnosis] A manager's account is still secondhand; naming an acceptance owner does not capture how night staff handle exceptions.",
      "3": "[Metric substitution] Coverage of listed fields cannot establish that omitted night-shift tasks have been discovered."
    }
  },
  "q128": {
    "q": "A university is planning an assistant for course-appeal files. Central administration defines completeness as filling every field, while faculty reviewers require a source for each claim. They agree to measure completeness but give opposite scores to the same file. What should the architect do first?",
    "o": [
      "Ask both groups to expand the reference material by adding previous appeal files to the model input",
      "Convene both groups to judge representative cases together and define passing conditions and dispute handling",
      "Designate central administration as criteria owner and judge each file by whether every field is filled",
      "Record the disputed cases, list both completeness definitions in the requirements, and keep whichever one sees more use"
    ],
    "e": "A shared metric name does not settle differences in meaning. Judging representative cases together turns the competing interpretations into explicit passing conditions. See notes 6.1.",
    "w": {
      "0": "[Unmeasured expansion] The disagreement is about acceptance criteria; more input files will not resolve it.",
      "2": "[Metric substitution] Field completeness is one group's proxy and does not capture the faculty's source requirement.",
      "3": "[Metric substitution] Post-launch usage does not show which definition reflects task completion, so the disagreement over criteria remains."
    }
  },
  "q129": {
    "q": "A hospital research office wants an assistant to screen outpatient records for potential clinical-study participants, and its demonstration used synthetic cases. The data owner has not confirmed which real fields may be used for recruitment screening or how long they may be retained. The project manager wants to move to a prototype using production data. Which discovery actions are needed? Select 2.",
    "o": [
      "Expand the prototype context with each department's historical outpatient records to observe screening performance",
      "Check the intended purpose and access scope of the proposed fields, and have the data owner confirm retention boundaries",
      "Instruct the model to identify sensitive fields before screening and determine whether to retain the original text",
      "Register unresolved data-use constraints and their risks, and restrict the prototype to synthetic cases until they are confirmed",
      "Add audit logs after outpatient-record reads, and have the data owner confirm field usage in periodic reviews of each department’s access"
    ],
    "e": "A demonstration on synthetic cases does not establish permitted use, access, or retention for real records. Discovery should have the data owner confirm those boundaries and register open constraints and risks, limiting the prototype's data until they are settled. See notes 6.1.",
    "w": {
      "0": "[Compliance shortcut] Using real outpatient records would cross a data boundary whose permitted purpose and scope have not been established.",
      "2": "[Prompt as enforcement] Permitted use and retention require explicit controls outside the model’s instructions.",
      "4": "[Audit as prevention] Reviewing reads after they occur does not establish the permitted scope before data is used."
    }
  },
  "q130": {
    "q": "A municipal archive wants an agent to route numbered filing bundles. Discovery establishes that routing depends entirely on an identifier prefix, the rule table is complete, and staff need no free-text explanation. What should the procurement scope review recommend?",
    "o": [
      "Choose a stronger model to recognize identifier prefixes and write the rule table's routing conditions into its prompt",
      "Retrieve similar bundles that were already routed and send each new bundle to the department of its closest match",
      "Use a routing program driven by the rule table and leave generative features for a later iteration to assess if a need arises",
      "Build a multi-agent workflow scoped by identifier range, with a coordinator agent selecting the destination department"
    ],
    "e": "Discovery includes deciding whether an LLM is needed. The task is fully determined by known rules, so procurement should scope a conventional program. See notes 6.1.",
    "w": {
      "0": "[Model substitution] Discovery found no capability gap requiring a model; a stronger model with the rules in its prompt has no supporting basis.",
      "1": "[Data-shape mismatch] Routing follows an exact prefix rule, not similarity to prior bundles.",
      "3": "[Overengineering] Complete deterministic rules do not call for agent coordination."
    }
  },
  "q131": {
    "q": "An insurance operations lead expects a document assistant to reduce review effort and wants that benefit in the project proposal. The team has neither measured current review work nor run a pilot. Finance requires forecasts to be distinguished from measured results and wants this discovery document to include both the baseline sampling plan and the pilot acceptance criteria. How should discovery document the benefit?",
    "o": [
      "List the vendor’s summarization benchmark results and fill the proposal's expected benefit from them",
      "Record the operations lead's effort estimate and delivery risks, and enter the estimate as the benefit once the business confirms it",
      "Run a pilot at one branch and accept the benefit based on the number of files processed during the pilot",
      "Log the time saving as a hypothesis and accept it on baseline and pilot results scored the agreed way"
    ],
    "e": "An unverified benefit belongs in the hypothesis register. A baseline and a pilot measured the agreed way let finance distinguish expectations from findings. See notes 6.1.",
    "w": {
      "0": "[Metric substitution] Summarization benchmark scores do not measure review-effort savings in this workflow.",
      "1": "[Metric substitution] Finance requires the baseline sampling plan and pilot acceptance criteria in this document; this option records only the estimate and delivery risks, and business confirmation gives the benefit no path to verification.",
      "2": "[Metric substitution] Files processed measures throughput, not whether review effort fell, so it cannot be used to accept the benefit."
    }
  },
  "q132": {
    "q": "A software company is scoping a meeting assistant. Sales prefers more detailed answers, while the data owner has set a maximum retention period for customer records. With a tight schedule, the product manager plans to rank these together in one backlog. Which requirement decisions are appropriate? Select 2.",
    "o": [
      "Classify the retention limit as a hard constraint, have storage enforce expiry, and include it in release acceptance tests",
      "Put the retention limit in the assistant’s prompt and instruct the model to clear customer records itself when the period expires",
      "Add access logging for customer records and pass overdue records to auditors after the deadline",
      "Treat answer detail as a negotiable preference, settle this release's trade-offs using representative task cases, and move remaining detail requests to a later iteration",
      "Rank retention duration in the feature backlog and let sales extend it according to customer demand"
    ],
    "e": "Discovery should distinguish hard boundaries from negotiable preferences. The retention limit needs enforcement and an acceptance check, while answer detail can be negotiated using user cases. See notes 6.1.",
    "w": {
      "1": "[Prompt as enforcement] Retention must be enforced by storage or execution controls, not by a prompt.",
      "2": "[Audit as prevention] Audit handling after the deadline does not enforce the retention limit when it is due.",
      "4": "[Compliance shortcut] Sales preferences cannot relax the retention ceiling already established as a hard boundary."
    }
  },
  "q133": {
    "q": "A bank’s ADR selected centralized processing for customer explanations under the data boundaries then in force. A new internal constraint requires partitioned processing, and the revised design has been assessed and approved. Auditors still need to understand why the original choice was reasonable. How should the decision record change?",
    "o": [
      "Rewrite the original ADR around partitioned processing, retaining the current approver and latest assessment attachments",
      "Create a linked ADR that marks the supersession, keeping the previous decision in the history with updated status",
      "Build a decision Q&A agent so auditors can ask at any time why the original option was chosen",
      "Keep the original ADR, track deployment success after the partitioned rollout, and mark the migration complete there once the agreed targets are met"
    ],
    "e": "A changed constraint calls for a new decision record while preserving the context of the old one. Linked ADRs with explicit status make the decision history traceable. See notes 6.2.",
    "w": {
      "0": "[Wrong-layer diagnosis] Overwriting the decision removes the original constraints and rationale needed for historical review.",
      "2": "[Overengineering] Auditors need a traceable record; a Q&A agent adds a component without recording how the decisions relate.",
      "3": "[Metric substitution] Deployment success does not show whether the context and relationship of the decisions are recorded."
    }
  },
  "q134": {
    "q": "A software company compared single-agent and multi-agent designs for technical due diligence. On the same task set, the multi-agent design addressed gaps across specialties while staying within agreed cost and latency limits. The board is deciding whether to fund a pilot and is concerned about maintenance ownership. How should the architect present the recommendation?",
    "o": [
      "List the team responsible for each specialist role, and request approval of full rollout funding based on the number of roles",
      "Propose a stronger single model instead and describe that tier's expected quality to the board",
      "Recommend approving a pilot of the collaborating-agent design, reporting measured gains on the same task set, operating staff needs, and a review point before expansion",
      "Walk the board through the new design’s interfaces and call order, then explain the message fields and sequence diagrams in detail"
    ],
    "e": "A more complex design can be justified by evidence. The board needs that evidence framed around benefits, costs, operating effort, and the scope of the approval sought. See notes 6.2.",
    "w": {
      "0": "[Metric substitution] The count of specialist roles does not communicate measured benefits or maintenance costs, and naming teams does not justify skipping the pilot.",
      "1": "[Model substitution] The assessment supports the multi-agent design; no evidence establishes that a stronger single model addresses the gap.",
      "3": "[Wrong-layer diagnosis] Implementation detail does not directly answer the board’s investment and maintenance questions."
    }
  },
  "q135": {
    "q": "A government procurement team is reviewing an assistant that uses several systems. Legal reviewers need to establish whether submitted material reaches external processors and how each location handles retention and access. The feature demonstration is complete; this meeting concerns data boundaries. Which materials should the architect provide? Select 2.",
    "o": [
      "Present a cross-component data-flow diagram showing document sources, each vendor processing point, storage locations, and exception paths",
      "Submit the interface connectivity test report showing that calls between the systems succeeded",
      "Submit each vendor’s security certifications and privacy policies to show the external processors’ compliance credentials",
      "Add restrictive system-prompt clauses instructing the model to choose exportable fields by document category",
      "Submit verification results for expiry settings and permission configuration at each storage location, listing processing steps still to be confirmed and their owners"
    ],
    "e": "Legal review needs inspectable data paths and control records. The diagram describes processing, including external vendors, while configuration checks and open items show how far the boundaries have been established. See notes 6.2.",
    "w": {
      "1": "[Metric substitution] Successful calls do not establish destinations, retention, or access limits.",
      "2": "[Metric substitution] Vendor credentials describe general compliance capability, not where this system’s material actually flows or how each location controls retention and access.",
      "3": "[Prompt as enforcement] Permitted exports require execution controls; instructions alone do not enforce the boundary."
    }
  },
  "q136": {
    "q": "A retailer plans to switch the model used for product descriptions. The candidate meets the quality, cost, and latency requirements on the same tasks and offers a better overall trade-off than the current setup. Procurement approves the switch but wants future reviewers to understand why the status quo lost and when to revisit the choice. What belongs in the ADR?",
    "o": [
      "List the candidate model version, general benchmark rank, and price, making a ranking drop the review condition",
      "Agree in the ADR to follow the vendor's newest model and switch as soon as a new version ships",
      "Record only the winning model's task evaluation and residual risks, leaving the status-quo option out of the ADR",
      "List the task-based grounds for switching, the comparison with the current setup, residual risks, and review triggers"
    ],
    "e": "Task evidence can justify a model switch. The ADR should also preserve rejected alternatives, including the status quo, along with consequences and review triggers. See notes 6.2.",
    "w": {
      "0": "[Metric substitution] General rankings do not capture the task-specific comparison already available.",
      "1": "[Model substitution] Switching to each new version without task evaluation abandons the evidence-based comparison behind this decision.",
      "2": "[Wrong-layer diagnosis] Recording only the winner leaves later reviewers unable to see why the status quo lost."
    }
  },
  "q137": {
    "q": "A hospital’s facilities department is integrating an assistant that looks up medical-supply inventory. The business case and data boundaries are agreed. During implementation review, engineers cannot tell who takes over after an inventory-interface failure or which requests should enter the retry path. What should the architect emphasize?",
    "o": [
      "Provide the inventory-interface contract and failure paths, listing retry rules, escalation recipients, and acceptance cases per failure type",
      "Write retry conditions into the prompt and let the assistant decide on its own whether to retry when the interface fails",
      "Present the approved investment and rollout brief, restating this release’s benefits, budget, and launch timeline",
      "Collect interface-failure cases after launch, then settle takeover staff, retry conditions, and acceptance cases from failure counts"
    ],
    "e": "Engineers need actionable interfaces, failure paths, and acceptance methods. Writing retry rules, escalation recipients, and acceptance cases into the contract answers the implementation questions. See notes 6.2.",
    "w": {
      "1": "[Prompt as enforcement] Retry behavior belongs in the interface contract and calling code, not in instructions the assistant interprets.",
      "2": "[Wrong-layer diagnosis] The gap concerns engineering failure paths; the investment brief does not specify retries or handoffs.",
      "3": "[Wrong-layer diagnosis] Settling takeover staff and acceptance cases from post-launch failure counts leaves implementers without a failure-handling contract now."
    }
  },
  "q138": {
    "q": "An education platform has defined service indicators, target values, and measurement windows for its tutoring assistant, currently for internal management. An account manager wants to turn this into a customer SLA. The customer asks what happens when a target is missed. What must the agreement add?",
    "o": [
      "Attach target-approval records, and archive the internal objectives once they are signed",
      "Add uptime results for each measurement window and define fulfilment of the agreement as meeting the uptime target",
      "Add the agreed consequences of meeting or missing targets, specifying how they are triggered and handled",
      "Develop internal task-quality scoring rules and agree that the education team will report quality trends regularly"
    ],
    "e": "An SLO sets a target or range for an indicator. An SLA also specifies agreed consequences for meeting or missing objectives; those consequences need not be financial. See notes 6.3.",
    "w": {
      "0": "[Wrong-layer diagnosis] Internal sign-off does not establish consequences agreed with the customer.",
      "1": "[Metric substitution] Uptime measures availability only; making it the fulfilment standard neither defines consequences nor reflects answer quality.",
      "3": "[Wrong-layer diagnosis] Scoring rules and trend reports refine measurement, but the customer is asking about agreed consequences."
    }
  },
  "q139": {
    "q": "A securities research service determines breaches using the share of qualifying tasks in an agreed window, with the denominator and exceptions specified. At the end of a window, a customer reports a failed task and support wants to declare a breach for the entire window. Scores for the remaining tasks are available. How should the service owner decide?",
    "o": [
      "Calculate the qualifying proportion for the whole window under the contract’s denominator and exceptions, and determine from it whether a breach occurred",
      "Treat the customer's failed task as severe, and declare a breach for the whole window",
      "Switch to the cumulative qualifying proportion since launch, which has more samples and a steadier result",
      "Measure the share of customers who complained in the window and have the support lead check it and determine whether a breach occurred"
    ],
    "e": "The incident needs attention, but the breach decision follows the agreed window, denominator, exceptions, and scoring method. A single case or a different aggregate cannot determine that result. See notes 6.3.",
    "w": {
      "1": "[Metric substitution] Severity informs incident handling, but the breach criterion is the qualifying proportion across the window.",
      "2": "[Metric substitution] A cumulative figure changes the measurement window specified in the agreement.",
      "3": "[Metric substitution] The proportion of complaining customers has a different denominator and measures a different outcome."
    }
  },
  "q140": {
    "q": "A retail chain’s product assistant varies its wording across repeated trials, and some responses need staff corrections. After a successful demonstration, the brand lead wants to promise stores identical answers with no intervention. Which steps should the rollout discussion take? Select 2.",
    "o": [
      "Expand the model input with sample store conversations so every answer follows the same exemplars",
      "Have the brand lead go through the recorded demonstration cases and approve the store commitment once the wording differences seem acceptable",
      "Present error types and wording differences across multiple runs and negotiate measurable service objectives with the brand team",
      "Switch to a model tier known for stable output and promise stores consistent answers on that basis",
      "Agree the conditions for staff takeover and run a store pilot, using its results to set the scope of further rollout"
    ],
    "e": "Outputs can vary across runs. Measured variation supports realistic objectives, while takeover conditions and a pilot make intervention and rollout limits explicit. See notes 6.3.",
    "w": {
      "0": "[Unmeasured expansion] No missing-sample problem has been identified; more exemplars do not support a promise of identical results.",
      "1": "[Metric substitution] Reviewing recorded demonstrations checks only whether the wording is acceptable; it sets up no measurement of factual errors or service quality, so it cannot support the store commitment.",
      "3": "[Model substitution] A tier's reputation cannot establish zero variability for these tasks."
    }
  },
  "q141": {
    "q": "A hospital training team receives staff edits to an assistant’s answers, with inputs and release versions attached. Some edits conflict with the current training procedure. The product manager wants to include the feedback in the next regression suite. How should the material be handled?",
    "o": [
      "Load all original answers and staff edits into the retrieval knowledge base for the assistant to consult",
      "Have the training lead check the wording and format of each staff edit, and adopt the edited answers as the new regression criteria",
      "Rank edited cases by submitter seniority and make the senior employee’s version the reference answer",
      "Have the domain owner verify disputed edits against the procedure before de-identified cases enter the regression suite with versions and criteria"
    ],
    "e": "User edits are feedback to verify. Once the domain owner checks expectations against the procedure and sensitive details are removed, the cases can enter regression testing with versions and explicit criteria. See notes 6.3.",
    "w": {
      "0": "[Unmeasured expansion] Loading both disputed accounts into retrieval does not establish which expectation matches the current procedure.",
      "1": "[Metric substitution] Checking wording does not verify content against the current procedure, so conflicting edits would become regression criteria.",
      "2": "[Metric substitution] Seniority does not verify consistency with the current procedure and cannot determine whether an edit is correct."
    }
  },
  "q142": {
    "q": "A municipal query assistant has stable aggregate scores, but reviewed complaints show frequent errors when residents use old place names. Such queries are rare in the existing evaluation set. The owner wants to understand the affected group without losing visibility into routine queries. How should feedback evaluation change?",
    "o": [
      "Keep monitoring the overall pass rate, and extend the trend window before judging the old-place-name problem",
      "Expand old-place-name cases while retaining routine samples, and report qualifying proportions and fixes by task group",
      "Expand model context with municipal place-name change records and have the model compare them for each query",
      "Build a new regression set from complaint cases alone and report service quality from its pass rate"
    ],
    "e": "Verified clusters of complaints call for evaluation by task group while retaining representative routine samples. This reveals local failures and checks whether fixes affect existing behavior. See notes 6.3.",
    "w": {
      "0": "[Metric substitution] Pooled scores can continue to conceal the confirmed failure in one query type.",
      "2": "[Unmeasured expansion] The current task is to establish impact; a need to enlarge generation context has not been diagnosed.",
      "3": "[Metric substitution] Complaint-only results lose representative coverage of ordinary tasks."
    }
  },
  "q143": {
    "q": "An enterprise knowledge assistant’s customer agreement currently covers availability alone, while customer success receives persistent reports of factual errors. Both parties have agreed on task-based scoring. In a pilot, the current model tier misses their newly negotiated quality floor, while a higher-tier candidate meets it under the same scoring and stays within cost and latency constraints. What should the renewal proposal include?",
    "o": [
      "Add quality indicators, a floor, and sampling rules, accept quality on the jointly agreed task scoring, and upgrade to the assessed higher-tier model",
      "Specify the candidate model version and its sample test results as the agreement’s quality commitment",
      "Keep the renewal terms to availability only and have customer success handle factual errors case by case",
      "Set a customer-satisfaction target, and use satisfaction and renewal trends to assess quality"
    ],
    "e": "Availability and answer correctness are separate dimensions. The agreement needs a negotiated quality floor and measurement method. The current tier misses the floor while the higher-tier candidate meets it under the same scoring, so the upgrade has task evidence behind it; a model version is still not a quality indicator. See notes 6.3.",
    "w": {
      "1": "[Metric substitution] A model version does not measure factual errors; quality criteria remain necessary after a model switch.",
      "2": "[Metric substitution] Availability does not measure factual correctness, and handling complaints case by case sets no measurable quality floor.",
      "3": "[Metric substitution] Satisfaction trends do not measure factual correctness on task samples."
    }
  },
  "q144": {
    "q": "A university's course-catalog assistant team must reproduce the previous release’s acceptance results for an internal audit. The archive holds only architecture diagrams and result screenshots; prompts and dependencies have changed several times since, and the screenshots identify no run configuration. The original evaluation data is still available. What should be added first?",
    "o": [
      "Add more screenshots of successful answers to the acceptance pack, labeling the course type each one shows",
      "Ask the original developers to recall the run steps from memory and write them up as reproduction notes",
      "Compile that release’s prompt and dependency versions, evaluation data, configuration, and run commands, with the original screenshots as the comparison target",
      "Check dependencies in the current environment, and rerun the original evaluation samples with the latest configuration"
    ],
    "e": "Reproducibility requires a result linked to prompt, configuration, dependency, and evaluation versions, plus a runnable procedure. The original screenshots can serve as the comparison target but do not supply that setup, and neither do diagrams or recollection. See notes 6.4.",
    "w": {
      "0": "[Metric substitution] More screenshots are still only examples of results; adding them to the acceptance pack does not supply the configuration and procedure needed to reproduce a run.",
      "1": "[Wrong-layer diagnosis] Recollection cannot recover the release-linked prompt, dependency, and configuration versions, so the conditions for reproduction are still missing.",
      "3": "[Wrong-layer diagnosis] The latest configuration may not match the previous release’s accepted run; checking today’s environment does not reconstruct its original conditions."
    }
  },
  "q145": {
    "q": "A bank’s compliance-training assistant is assessed by domain experts and a model grader, which often disagree on the same cases. The task description omits boundary conditions, and the grader’s input omits criteria already agreed by the team. The project manager wants a stable acceptance method first. Which guidance should be added? Select 2.",
    "o": [
      "Expand grading context with past training conversations so the grader can infer standards from them",
      "Specify case boundaries and reference solutions, arrange independent expert scoring, and use disagreements to refine the criteria",
      "Upgrade the grading model, and have it judge subsequent cases and explain its scores using the existing task description",
      "Tally votes from experts and graders and adopt the majority outcomes as acceptance criteria",
      "Expand grading context with the agreed criteria, instruct the model to apply them, and check reference cases"
    ],
    "e": "Task descriptions and criteria should support consistent expert judgments. Reference solutions check task solvability and grader configuration, while supplying the omitted criteria fixes the identified input gap. See notes 6.4.",
    "w": {
      "0": "[Unmeasured expansion] Past conversations do not supply the missing agreed criteria; their volume does not resolve the gap.",
      "2": "[Model substitution] A stronger grader cannot recover requirements missing from the task and criteria.",
      "3": "[Metric substitution] Vote totals do not validate the criteria or the grader configuration."
    }
  },
  "q146": {
    "q": "A retailer has changed the return fields of its inventory lookup tool. The implementation uses the new contract, but the support manual still shows old fields and prompt variables. The release owner needs store support to troubleshoot this version, and existing acceptance results predate the change. How should the release package be prepared?",
    "o": [
      "Keep the old manual, and attach a field-change log with regression results from before the change",
      "Synchronize release contracts, prompt variables, and operating instructions, and attach regression results for the matching version",
      "Merge the old and new manuals into one comparison manual, marking the differences field by field",
      "Have implementers explain new fields verbally during troubleshooting and pause manual updates until the next scheduled release"
    ],
    "e": "Changes to prompts or tool contracts require synchronized documentation and regression testing. Support staff must be able to map the documented fields to the running version. See notes 6.4.",
    "w": {
      "0": "[Metric substitution] The old manual and pre-change regression results describe the previous version, not acceptance of behavior under the new contract.",
      "2": "[Wrong-layer diagnosis] A comparison manual is not tied to the release version and has no matching regression results, so support still cannot confirm the running behavior.",
      "3": "[Wrong-layer diagnosis] Verbal explanations do not provide traceable guidance tied to the release version."
    }
  },
  "q147": {
    "q": "A hospital’s internal directory assistant depends on another department’s updates, and a known update delay remains unresolved. The business owner has approved a limited trial, with directory administrators checking recent staff changes. The handover currently describes only normal lookups. What should be added?",
    "o": [
      "Have the receiving team search the directory by name similarity to infer recent staff changes",
      "Note the update delay and trial scope in the risk register, and let the receiving team's owner decide case by case whether checks are needed",
      "Track lookup success in regular reports and treat the risk as controlled while the normal-response rate meets the agreed target",
      "Document the delay's impact and trial scope in the handover, with directory administrators as owners of the temporary checks on recent changes"
    ],
    "e": "An unresolved risk needs documented impact, temporary controls, and named owners for the checks. Approval for a limited trial does not remove the risk, and the receiver needs the same operating boundaries. See notes 6.4.",
    "w": {
      "0": "[Data-shape mismatch] Name similarity finds lookalike entries; it cannot produce updates the source department has not supplied.",
      "1": "[Compliance shortcut] The trial was approved on condition that administrators check recent changes; making the checks optional bypasses that condition.",
      "2": "[Metric substitution] A normal response does not establish current accuracy, so a target response rate does not show the risk is controlled."
    }
  },
  "q148": {
    "q": "A municipal case assistant’s runbook is about to go to an outsourced on-call team. To make troubleshooting easier, the draft pastes a service-account key into the setup steps and copies several production log excerpts containing residents’ names and ID numbers as examples. How should the implementation guidance handle the runbook?",
    "o": [
      "Remove the key, describe the credential request process and required permissions, and review and de-identify example logs before including them",
      "Remove only the ID numbers from the logs, keep the key, enable access logging on the runbook, and have the security owner check access periodically",
      "Build a troubleshooting Q&A agent that retrieves the raw logs and key to answer on-call questions",
      "Have on-call staff rehearse troubleshooting with the runbook and use average resolution time to accept it for release"
    ],
    "e": "A runbook should explain how to obtain credentials and which permissions are needed, not contain the secret itself. Copied log excerpts must be reviewed and de-identified before inclusion. See notes 6.4.",
    "w": {
      "1": "[Audit as prevention] Access records only support later review; the key and personal data have already been distributed.",
      "2": "[Overengineering] A new Q&A agent does not remove the plaintext credential or unredacted logs and widens their exposure.",
      "3": "[Metric substitution] Resolution time measures usability, not whether credentials and personal data are protected."
    }
  },
  "q149": {
    "q": "A software vendor is handing an internal ticket assistant to customer operations. The code is deployed and the documents have been sent. The customer’s acceptance condition is that its on-call team can operate independently, but the vendor has performed every demonstration. What should happen before handover is accepted? Select 2.",
    "o": [
      "Count delivered documents and successful deployments, and have the project owner sign off the takeover as complete",
      "Expand the on-call assistant’s historical context with vendor meeting notes to support future troubleshooting",
      "Have the receiving team run the versioned evaluations and complete a rollback rehearsal, recording pass proportions and unresolved issues",
      "With the vendor only observing, have the receiving team handle a simulated alert, check monitoring logs, and confirm owners and escalation paths",
      "Add more vendor-led rehearsals and consider the customer team ready once the vendor passes the agreed number in a row"
    ],
    "e": "Handover requires the receiving team to run evaluations, handle alerts, and rehearse rollback, with clear ownership and escalation. Deployment and document delivery alone do not establish that capability. See notes 6.5.",
    "w": {
      "0": "[Metric substitution] Document counts and deployment success do not measure independent operational capability, and a sign-off does not show it either.",
      "1": "[Unmeasured expansion] More historical input does not demonstrate that the receiving team can operate the service.",
      "4": "[Metric substitution] The vendor’s results do not measure independent operation by the customer’s on-call team."
    }
  },
  "q150": {
    "q": "After a release, a university notification assistant wrote incorrect notices to an external scheduling system. Operations restored the previous code version, but course administrators can still see the notices. The handover manual covers only code rollback. How should the recovery procedure be completed?",
    "o": [
      "Check the restored version identifier and confirm recovery is complete once it matches the pre-release version",
      "Check this release’s external notices against the write logs, complete the business corrections, and verify each withdrawal",
      "Calculate similarity between incorrect and valid notices, and send the least similar records for business correction",
      "Revise the rollback wording in the assistant’s prompt, instructing the model to undo external notices when code is restored"
    ],
    "e": "Code recovery and handling external side effects are separate tasks. The procedure must identify the writes from this release, complete the business corrections, and verify them. See notes 6.5.",
    "w": {
      "0": "[Metric substitution] A matching version establishes code recovery, not resolution of external notices.",
      "2": "[Data-shape mismatch] Identifying writes from this incident requires record linkage; similarity does not determine the affected set.",
      "3": "[Prompt as enforcement] Undoing business writes requires an explicit execution procedure; prompt wording does not enforce reversal when code is restored."
    }
  },
  "q151": {
    "q": "A financial firm is gradually expanding a customer-records assistant. Monitoring confirms that it has crossed the agreed quality boundary. The preapproved response is to stop expansion and use manual processing until review is complete, while marketing wants to keep the rollout schedule. What should the service owner do?",
    "o": [
      "Keep the expansion schedule and hand complained-about requests to manual processing afterward",
      "Pause quality-alert escalation until the rollout ends and judge service health by whether uptime meets its target",
      "Pause expansion and move to the plan’s manual fallback until the service owner has completed the review",
      "Stop adding new channels while already-enabled channels keep processing automatically pending review"
    ],
    "e": "Crossing an agreed operational boundary triggers the approved fallback or rollback plan, and expansion stays paused until the service owner completes the review. The rollout schedule does not change the gate. See notes 6.5.",
    "w": {
      "0": "[Audit as prevention] The plan requires stopping expansion once the boundary is crossed; handing requests to manual processing after complaints is after-the-fact handling, not the required control.",
      "1": "[Compliance shortcut] The approved plan requires stopping expansion after the breach; pausing escalation to protect the rollout bypasses that control.",
      "3": "[Compliance shortcut] The plan requires switching to manual processing after the breach; stopping only new channels while existing ones keep running automatically bypasses that approved requirement."
    }
  },
  "q152": {
    "q": "A retailer’s assistant has passed its pilot for organizing internal staff-training material. Sales now wants it to generate personalized product suggestions for customers using a new customer-data source. Neither activity is within the approved scope. Where should the architecture owner take this request next?",
    "o": [
      "Reuse the original pilot’s acceptance results, move to monitoring, and widen the rollout scope",
      "Start prompt optimization by connecting the new customer data and sales scripts to the model input",
      "Extend the architecture with a recommendation agent and keep the project’s existing success criteria and risk register unchanged",
      "Return to discovery and design to redefine success criteria, data constraints, and risks for the external use"
    ],
    "e": "A material change in goals or data boundaries requires renewed discovery and design. Evidence from the original pilot applies to its original scope. See notes 6.5.",
    "w": {
      "0": "[Metric substitution] Acceptance of internal training tasks does not evaluate external recommendations or the new data scope.",
      "1": "[Compliance shortcut] The new customer data is not approved for this use; connecting it first crosses the approved data boundary.",
      "2": "[Overengineering] Adding a component before defining the new task’s criteria does not establish the required design."
    }
  },
  "q153": {
    "q": "A hospital is preparing a new release of an administrative-explanation assistant. The business team likes the new format, but regression cases omit required clauses. Trace review confirms that the new template leaves out policy passages supplied by the previous version. The release gate requires those clauses to be retained. Which actions should the release owner arrange? Select 2.",
    "o": [
      "Pause the new release’s rollout, log the failing version and cases in the release history, and keep the repair hypothesis open for review",
      "Expand input context by restoring the missing policy passages into the prompt template, then rerun all agreed regression and release checks",
      "Expand model input with past administrative explanations so it can infer required clauses from historical outputs",
      "Switch to a higher-tier model for explanations and reschedule the release around its overall capability",
      "Release the business-approved format, and log the missing clauses in the risk register for a later iteration"
    ],
    "e": "An improvement does not excuse regression in required behavior. Pause rollout and fix the diagnosed omission; restoring the policy passages to the prompt template must still be followed by regression and release checks. See notes 6.5.",
    "w": {
      "2": "[Unmeasured expansion] The missing policy passages have been identified; past outputs are not a reliable way to restore that evidence.",
      "3": "[Model substitution] A higher-tier model does not restore the policy input known to be missing.",
      "4": "[Compliance shortcut] The release gate requires those clauses; releasing with a known omission and only logging it as a risk bypasses that requirement."
    }
  }
});
