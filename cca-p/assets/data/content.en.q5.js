/* Domain 5: q100–q126; option indices match questions.js. */
Object.assign(CONTENT_EN.questions, {
  "q100": {
    "q": "A bank uses an assistant to summarize public research reports, but its collector inserts report text into task instructions and embedded instructions have redirected summaries in replay tests. Data and action limits are already enforced; the team is now fixing message construction and screening of external text. Which changes belong in this update? Select 2.",
    "o": [
      "Put reports in source-labeled tool_result messages, mark them untrusted, and JSON-encode them where possible",
      "Put reports in system messages and attach publisher labels to identify where the text came from",
      "Exempt reports from screening after checking their trusted publisher source, to shorten collection time",
      "Screen report text returned by tools and place application instructions in a subsequent user turn",
      "Screen user-entered search terms and place reports in tool_result messages marked as untrusted"
    ],
    "e": "External reports need an untrusted data boundary and screening. Keeping application instructions separate addresses the message-construction failure described here. See notes 5.1.",
    "w": {
      "1": "[Wrong-layer diagnosis] Publisher labels do not change the instructional role of a system message; report text still enters that trusted layer.",
      "2": "[Compliance shortcut] Exempting trusted publishers removes screening from external text that can carry the demonstrated injection. Publisher reputation does not give report text instructional authority.",
      "4": "[Wrong-layer diagnosis] The injected instructions are in the returned reports, not the search terms being screened."
    }
  },
  "q101": {
    "q": "A hospital equipment assistant produces JSON that passes its schema checks, but some records place disposal before purchase. The date fields have the expected types, and staff discover the problem after records are saved. Which control should be changed first?",
    "o": [
      "Validate date-field types before saving and pause writes for equipment records with invalid types",
      "Validate date relationships in a daily audit and compile equipment records that need correction",
      "Validate date relationships before saving and block equipment records that violate business rules",
      "Validate date relationships through system instructions asking the model to correct them before saving"
    ],
    "e": "The schema already checks field types. A business-rule check before persistence addresses the missing relationship between the dates. See notes 5.1.",
    "w": {
      "0": "[Wrong-layer diagnosis] Field types already pass; another type check will not detect the contradictory dates.",
      "1": "[Audit as prevention] A daily audit runs after persistence and cannot prevent the invalid write.",
      "3": "[Prompt as enforcement] This rule can be checked in code; asking the model to review it leaves the write path unenforced."
    }
  },
  "q102": {
    "q": "A retailer drafts customer emails from internal service materials. Some drafts expose confidential supplier discount terms that the assistant still needs for its task, and emails are currently sent immediately. Which change best controls this disclosure risk?",
    "o": [
      "Screen drafts for restricted terms before sending and return flagged emails for review",
      "Screen archived emails for restricted terms and return flagged messages for review",
      "Check citation links before sending and return emails with inaccessible references for review",
      "Block incoming customer queries naming restricted terms during retrieval and return them for review"
    ],
    "e": "The exposure occurs when generated content leaves the system. Screening the draft and withholding flagged messages addresses that release point. See notes 5.1.",
    "w": {
      "1": "[Audit as prevention] By archival time the customer has received the message; review cannot undo that disclosure.",
      "2": "[Metric substitution] Accessible references do not establish that internal terms are suitable for customer disclosure.",
      "3": "[Wrong-layer diagnosis] The model can include restricted terms even when the customer never asks for them."
    }
  },
  "q103": {
    "q": "A software platform screens tool results for injection while retaining its sandbox and execution limits. On the same replay set, a candidate screening model misses fewer attacks and meets false-positive and latency requirements; longer prompts do not improve misses. Which change should the next release adopt?",
    "o": [
      "Expand screening prompts with more examples, retaining the model, sandbox, and execution limits",
      "Switch the response-generation model tier, retaining the screener, sandbox, and execution limits",
      "Increase the screener's reasoning effort, retaining the model, sandbox, and execution limits",
      "Switch to the validated screening model, retaining sandbox controls, permissions, and monitoring"
    ],
    "e": "The evaluation targets screening misses and supports this particular model change. Retaining execution controls preserves the other defenses. See notes 5.1.",
    "w": {
      "0": "[Unmeasured expansion] The replay results do not support further prompt expansion; more examples lack a demonstrated benefit here.",
      "1": "[Model substitution] The comparison concerns the screening model, not a change to the response generator.",
      "2": "[Unmeasured expansion] No result in the scenario supports increasing reasoning effort on the existing screener."
    }
  },
  "q104": {
    "q": "A university assistant converts public course descriptions into a fixed structure. Code can check the fields and credit ranges, and the generator already meets content requirements. The remaining work is validation before delivery, with no need for autonomous planning. Which implementation fits?",
    "o": [
      "Add a validation agent that plans field checks and stops delivery when checks fail",
      "Chain field and value checks, returning failures for correction or withholding delivery",
      "Retain the generator’s ability to edit validation rules, with maintainer confirmation before each edit",
      "Switch to a model with stronger structured-data capabilities and keep the delivery flow"
    ],
    "e": "Fixed, codable rules can run as checks after generation. A planning component adds no needed behavior to this validation step. See notes 5.1.",
    "w": {
      "0": "[Overengineering] There is no planning requirement; an agent adds avoidable control complexity.",
      "2": "[Guarding excess capability] The task needs conversion and fixed checks, not a generator that can edit the rules. Confirmation preserves that unnecessary capability.",
      "3": "[Model substitution] The gap is enforcement before delivery, which a generator change does not implement."
    }
  },
  "q105": {
    "q": "A public archive needs an assistant to run scripts that convert public images. Tools and permissions have already been scoped to the task, yet a script writes outside its intended output directory after passing input screening. Which changes retain scripted conversion and test the defenses? Select 2.",
    "o": [
      "Record actual script write locations and audit directory changes after conversion",
      "Restrict writable locations in an isolated environment and validate target parameters at execution",
      "Summarize input-screening pass rates and count passing conversions as successful directory isolation",
      "Constrain the output directory in script instructions and ask the model to stop if its path self-check fails before execution",
      "Create adversarial cases that attempt out-of-scope writes and verify blocking and actual file state"
    ],
    "e": "Required scripts need environment and parameter constraints. Adversarial tests must inspect actual effects to establish whether those boundaries hold. See notes 5.1.",
    "w": {
      "0": "[Audit as prevention] An audit after conversion can trace a write but cannot prevent it.",
      "2": "[Metric substitution] The input-screening pass rate does not measure the boundary on file writes.",
      "3": "[Prompt as enforcement] A model's path check does not constrain where the environment can write."
    }
  },
  "q106": {
    "q": "A civic assistant answers whether a public venue is open today using a notice from last season. A live announcement service is available, and the user needs today's status rather than a summary of usual hours. What should the assistant do first?",
    "o": [
      "Check the publisher of the old notice and answer using that institution's usual schedule",
      "Expand the old notice's context with previous years' opening records for the venue",
      "Check the date and applicable period of the live notice and update the answer",
      "Inspect the notice link in the answer and release it if that link is accessible"
    ],
    "e": "Today's status requires timely evidence. Even an authentic old notice may no longer apply, so the available live source needs a date and applicability check. See notes 5.2.",
    "w": {
      "0": "[Wrong-layer diagnosis] An authentic publisher does not resolve the notice's age.",
      "1": "[Unmeasured expansion] Additional historical records do not establish whether the venue is open today.",
      "3": "[Metric substitution] Link availability does not establish that the notice remains applicable."
    }
  },
  "q107": {
    "q": "An educational publisher uses an assistant to tag practice questions by topic. Identical inputs sometimes receive conflicting tags. The model, prompt, and tool versions are fixed, and the team wants to measure variation in this configuration, not compare new ones. Which evaluation fits?",
    "o": [
      "Add repeated-run samples for identical inputs, record pass rates and disagreements, and inspect traces",
      "Add inputs across topics, run each once, and check and record the resulting pass rate",
      "Switch model tiers on fixed inputs and compare the pass rates of their first outputs",
      "Repeat fixed inputs and report reliability from agreement in the wording of the outputs"
    ],
    "e": "Repeated runs of the same inputs and configuration expose variation. Pass rates need actual acceptance checks, while self-reported confidence is not a calibrated probability. See notes 5.2.",
    "w": {
      "1": "[Data-shape mismatch] One run per input confounds differences between inputs with variation across repeated runs.",
      "2": "[Model substitution] Changing tiers changes the configuration under investigation and skips measurement of its repeatability.",
      "3": "[Metric substitution] Agreement in wording does not measure classification accuracy and can miss contradictory classifications expressed in similar language."
    }
  },
  "q108": {
    "q": "A software company's bug-investigation agent keeps searching after it stops finding new leads, and costs rise with each loop. The team needs a per-task spending boundary and a way to identify which calls consume it; existing permissions are appropriate. Which changes address both needs? Select 2.",
    "o": [
      "Configure task budgets, iteration caps, and stop conditions that end the loop at its boundary",
      "Expand search candidates and historical context to cover more potential leads",
      "After a task ends, correlate its tokens, retries, tool calls, and duration records to locate abnormal consumption",
      "Configure task-cost alerts and handle overspending in an audit after the loop finishes",
      "Switch to a model with a lower per-call price and retain the loop's current running conditions"
    ],
    "e": "Budgets and stop conditions bound further consumption. Correlated measurements explain where that consumption comes from; both are needed here. See notes 5.2.",
    "w": {
      "1": "[Unmeasured expansion] The loop has stopped finding new leads, and broader searches add no consumption boundary.",
      "3": "[Audit as prevention] Handling cost after the loop finishes cannot stop overspending while it runs.",
      "4": "[Model substitution] A lower call price does not bound total task consumption when the loop remains unchanged."
    }
  },
  "q109": {
    "q": "An insurer's investigation agent must choose its next evidence-gathering step from the leads it finds; a fixed sequence cannot cover case variation. Replays show early evidence-classification errors propagating through otherwise functioning tools. How should the workflow change while retaining adaptive investigation?",
    "o": [
      "Expand historical context on every investigation round so later steps can read more prior conclusions",
      "Retain adaptive agent planning, validate stage handoffs, and recover from accepted checkpoints",
      "Retain adaptive agent planning and review stage conclusions and traces when the case is archived",
      "Add agents to analyze the same intermediate conclusion in parallel and combine their next-step proposals"
    ],
    "e": "The task requires adaptive planning. Checking intermediate results before downstream use and recovering from accepted checkpoints addresses error propagation without removing that capability. See notes 5.2.",
    "w": {
      "0": "[Unmeasured expansion] More history carries the bad classification forward without checking it.",
      "2": "[Audit as prevention] An archival audit happens after later evidence gathering has relied on the error.",
      "3": "[Overengineering] The agents share the same faulty intermediate result; extra orchestration adds no handoff validation."
    }
  },
  "q110": {
    "q": "A hospital's knowledge service summarizes retrieved research papers, and all citation links open successfully. Reviewers find that some claims are absent from the cited passages. The team now needs to assess factual support. Which check should take priority?",
    "o": [
      "Check each citation’s source and publication details and record whether journal and author information is complete",
      "Record the number of citations in each summary and compare citation density across summaries",
      "Add more papers on the topic to retrieval and retain the current summary acceptance process",
      "Expand the source context around each claim’s cited passage and check factual support and contradictions"
    ],
    "e": "A citation can exist and be accessible without supporting a claim. Comparing claims with the original passages reveals gaps that require correction or an explicit statement of uncertainty. See notes 5.2.",
    "w": {
      "0": "[Metric substitution] Complete source and publication metadata measures citation metadata quality, not whether the passage supports the claim.",
      "1": "[Metric substitution] Citation density measures presentation, not agreement between claims and source text.",
      "2": "[Unmeasured expansion] More papers do not repair the missing claim-by-claim support check."
    }
  },
  "q111": {
    "q": "A shop uses an assistant to organize internal tags for public products. Errors are reversible and do not affect consumer decisions; volume is high and no item-by-item advance review is required. Which review approach best monitors errors while limiting waiting time?",
    "o": [
      "After tags are applied, sample them for human review, route anomalies, and record outcomes",
      "Approve routine tags individually and send anomalous ones to a second reviewer",
      "After tags are applied, check generation times and direct slower outputs to human reviewers",
      "Expand tag examples and historical records while retaining the current human monitoring setup"
    ],
    "e": "For reversible, low-risk work without mandatory advance review, random sampling plus targeted anomaly review covers routine errors and suspicious outputs without queuing every item. See notes 5.3.",
    "w": {
      "1": "[Overengineering] The scenario does not require item-by-item approval; layered review adds waiting and staff workload.",
      "2": "[Metric substitution] Response time does not measure tag accuracy, and slow output is not an established error signal here.",
      "3": "[Unmeasured expansion] More examples do not establish the requested human error-monitoring process."
    }
  },
  "q112": {
    "q": "A bank's account-migration task has an owner's approval, but the customer corrects the destination account before execution. The new account passes authorization and parameter checks; the existing approval is bound to the old account version. What should happen next?",
    "o": [
      "Present the approver’s current authority status and retain the task’s existing approval after checking it",
      "Record the destination change and have the original approver review it after migration",
      "Present the revised action for review and execute after approval of that version",
      "Ask the model whether the account change belongs to the same task and execute if it agrees"
    ],
    "e": "Authorization establishes that the new account can be used, but does not extend approval of the old action to a changed destination. The revised action needs its own approval. See notes 5.3.",
    "w": {
      "0": "[Wrong-layer diagnosis] The approver's authority does not resolve the change in the approved action's version.",
      "1": "[Audit as prevention] Review after migration does not approve the changed destination before execution.",
      "3": "[Prompt as enforcement] The model's judgment that the task is similar does not enforce approval of the new parameters."
    }
  },
  "q113": {
    "q": "A hospital assistant drafts individualized treatment recommendations for patients. Evidence links and an AI disclosure at the start of each session are already in place. The hospital must now assign the review role before publication. Which arrangement fits?",
    "o": [
      "Have support staff familiar with the system review the recommendations before showing them to patients",
      "Have clinical staff sample recommendations already shown to patients and update procedures from the findings",
      "Have the same model reassess its confidence in the recommendations and display those above an internal threshold",
      "Have qualified medical professionals in the relevant field check evidence and model confidence scores and approve recommendations before release"
    ],
    "e": "Individual treatment recommendations directly affect patients and require review by qualified professionals in the relevant field before release. Evidence links and AI disclosure do not remove that requirement. See notes 5.3.",
    "w": {
      "0": "[Wrong-layer diagnosis] Familiarity with the system does not establish the medical expertise needed to review individualized treatment advice.",
      "1": "[Audit as prevention] Sampling advice after patients see it does not provide review before release.",
      "2": "[Metric substitution] Self-reported confidence does not establish that qualified medical professionals have reviewed the advice."
    }
  },
  "q114": {
    "q": "A hosting platform's recovery agent has failed repeatedly, and an on-call engineer is taking over. Some recovery actions have already run, and the engineer needs to continue handling the incident without conflicting automated actions. Which arrangements are needed together? Select 2.",
    "o": [
      "Keep the recovery loop running and log the engineer's actions for an audit after the incident",
      "Pause automated execution, assign the responsible engineer, and specify a response deadline",
      "Expand diagnostic context with past incident records in the recovery loop",
      "Hand over the objective, evidence, action history, and pending state so the engineer can continue",
      "Hand over the final error message and recommendation so the engineer can reconstruct the action history"
    ],
    "e": "Takeover needs both a pause in conflicting automation and an actionable account of the current state. Ownership and a deadline establish who responds; evidence and action history let that person continue. See notes 5.3.",
    "w": {
      "0": "[Audit as prevention] A later audit cannot prevent automated actions from conflicting with the engineer's work.",
      "2": "[Unmeasured expansion] Adding context to an ongoing loop does not implement the takeover already required.",
      "4": "[Wrong-layer diagnosis] A final message omits completed actions and pending state, which can lead the engineer to repeat work."
    }
  },
  "q115": {
    "q": "An admissions assistant's recommendations receive individual review before decisions are finalized. The school wants to improve its review queue while retaining that release requirement. A new interface is said to reduce reviewer workload; which operational measures best check whether waiting and missed errors have worsened?",
    "o": [
      "Use recommendation throughput, generation time, and response length to assess the revised interface",
      "Use review waiting time, reviewer change rates, and missed errors in follow-up checks to assess the revised interface",
      "Use queue automation rates, model-call counts, and cost per call to assess the revised interface",
      "Use reviewers’ review counts, logged-in time, and pages processed daily to assess the revised interface"
    ],
    "e": "Waiting time captures queue cost, while changes and missed errors describe review effectiveness. Approval counts or automation rates alone do not answer whether the review works. See notes 5.3.",
    "w": {
      "0": "[Metric substitution] Generation measures do not capture human queue delays or missed review errors.",
      "2": "[Metric substitution] Automation and call costs do not directly measure waiting time or review quality.",
      "3": "[Metric substitution] Activity counts show workload but do not reveal whether reviewers miss errors."
    }
  },
  "q116": {
    "q": "A hospital plans to process PHI through the Claude API and has signed a BAA. HIPAA readiness has not yet been configured for the organization, and a proposed API feature has only been checked for availability to ordinary accounts. Which additional checks are needed before launch? Select 2.",
    "o": [
      "Check organization-level health-data settings, enable the required configuration, and retain applicable customer controls",
      "Check progress on the API organization's ZDR request and make approval a prerequisite for BAA use",
      "Check feature call success and list reliably operating features as eligible for PHI",
      "Check ordinary-account enablement and list enabled features as eligible for PHI",
      "Check BAA eligibility for the proposed feature and scope PHI processing to its coverage"
    ],
    "e": "The relevant Claude API conditions include a BAA, organizational HIPAA readiness, and eligible features. General availability does not establish BAA coverage, and ZDR is not an additional BAA prerequisite. See notes 5.4.",
    "w": {
      "1": "[Overengineering] ZDR is a separate retention arrangement; adding this approval gate is not required for BAA use.",
      "2": "[Metric substitution] Call stability does not measure eligibility to process PHI.",
      "3": "[Metric substitution] Ordinary account availability does not establish feature eligibility under the BAA."
    }
  },
  "q117": {
    "q": "A retailer uses a Claude API model that supports inference_geo. The project requires both inference and data at rest to stay in the US, and inference_geo is already set to us. What should the team check next to complete its location review?",
    "o": [
      "Recheck the actual inference_geo value and enter that setting in the storage-scope inventory",
      "Check API round-trip latency and infer the location of stored data from its distribution",
      "Check the organization's billing address and enter that attribute in the storage-location inventory",
      "Check workspace geo for storage and endpoint processing, and complete the location inventory"
    ],
    "e": "inference_geo controls inference, while workspace geo governs storage and endpoint processing. The inference setting does not establish the storage location. See notes 5.4.",
    "w": {
      "0": "[Metric substitution] An inference-region setting does not measure the location of data at rest; using it in the storage inventory conflates two separate scopes.",
      "1": "[Metric substitution] Network latency does not establish where the service stores data at rest.",
      "2": "[Metric substitution] A billing address does not measure the data-storage region and cannot establish that location for the inventory."
    }
  },
  "q118": {
    "q": "A government agency plans to deploy an assistant through Amazon Bedrock in AWS GovCloud, a FedRAMP High path listed in the FAQ. Procurement now needs to determine whether this deployment can enter the agency's operating environment. Which materials should it examine next?",
    "o": [
      "Check the intended cloud service's authorization scope and the agency's ATO for this deployment",
      "Check the model product page for a High designation and enter its version in the operating approval inventory",
      "Check the service’s Class letter and list higher-sorting entries as approved for agency operation",
      "Check the post-launch service audit plan and confirm deployment boundaries during operational reviews"
    ],
    "e": "FedRAMP authorization applies to cloud services, with models deployed as software components. The service's scope and the agency's ATO still need review for this deployment. See notes 5.4.",
    "w": {
      "1": "[Metric substitution] A product-page High designation and model version do not establish authorization of the intended cloud service or agency deployment.",
      "2": "[Metric substitution] Class describes assessment-documentation depth, not an ordered security rating or agency operating permission.",
      "3": "[Audit as prevention] An operational audit does not establish authorization scope and ATO before launch."
    }
  },
  "q119": {
    "q": "A university research assistant uses student records with names replaced, while the university retains a re-identification key. The GDPR-governed project sends full records by default for possible future research, and its rights-request process does not include this dataset. Which changes are needed together? Select 2.",
    "o": [
      "Defer rights requests for this dataset until the project ends to reduce interruptions to research",
      "Send fields needed for the current purpose and set corresponding retention and access limits",
      "Measure the name-replacement rate and use completion to assess data governance",
      "Manage re-identifiable records as personal data and handle rights requests under the applicable conditions",
      "State the records' purpose in research instructions and ask the model to control subsequent data uses"
    ],
    "e": "Re-identifiable records remain personal data. Purpose limitation, minimization, storage and access controls, and applicable rights handling still apply after pseudonymization. See notes 5.4.",
    "w": {
      "0": "[Compliance shortcut] Deferring all requests for research convenience bypasses the requirement to handle personal-data rights requests under the applicable conditions.",
      "2": "[Metric substitution] The name-replacement rate does not cover purpose, retention, or data-subject rights.",
      "4": "[Prompt as enforcement] Natural-language instructions do not enforce purpose and access controls in the data-processing system."
    }
  },
  "q120": {
    "q": "The Anthropic account team has enabled ZDR for a technology company’s API organization. During an operational incident investigation, a customer finds that responses from an existing feature path were retained. The incident file contains only the organization’s enablement record, with no review of that path’s retention conditions. What should the team investigate first?",
    "o": [
      "Check organizational ZDR enablement status and mark the path as non-retaining once enablement is confirmed",
      "State non-retention in the feature’s system prompt and inspect whether the model returns that statement",
      "Check feature/model ZDR eligibility and retention exceptions; document coverage of the incident path",
      "Check the feature’s request success rate and mark stable requests as meeting retention requirements"
    ],
    "e": "The organization’s enablement record does not establish retention conditions for the incident path. Check feature and model eligibility and exceptions, including safety flags and legal holds, before assessing whether the retention fits the applicable arrangement. See notes 5.4.",
    "w": {
      "0": "[Metric substitution] Organizational enablement does not establish feature eligibility or retention exceptions, so it cannot establish non-retention for the incident path.",
      "1": "[Prompt as enforcement] A model's statement cannot change the service's actual retention behavior.",
      "3": "[Metric substitution] Request success does not measure the retention scope for prompts and responses."
    }
  },
  "q121": {
    "q": "A healthcare organization has configured access controls and the applicable BAA arrangements for its ePHI assistant. Its security team finds that system activity is recorded but nobody has established a process for examining it. Which change addresses this audit-control gap?",
    "o": [
      "Add human approval for every access and incorporate it into the existing access process",
      "Assign a process to examine system activity records after access and track how anomalies are handled",
      "Retain the assistant’s ability to erase system activity records, with administrator confirmation before deletion",
      "Compile system activity records and mark audit work complete once the records are archived"
    ],
    "e": "Audit controls include both recording and examining activity. Access controls and records exist here; the missing element is a process that examines activity and handles findings. See notes 5.4.",
    "w": {
      "0": "[Overengineering] No new approval layer is required; adding one still leaves existing activity records unexamined.",
      "2": "[Guarding excess capability] Examining audit records does not require an assistant to erase them; confirmation preserves an unnecessary deletion capability.",
      "3": "[Metric substitution] Archiving measures record storage, not whether activity has been examined and anomalies addressed."
    }
  },
  "q122": {
    "q": "A bank uses an assistant to organize application materials before human review. Overall accuracy is high, but speakers of one language report more misclassifications, and that group has too few evaluation samples for a stable error estimate. How should the team expand its evaluation first?",
    "o": [
      "Expand the overall random sample, pool that group's results, and calculate overall accuracy",
      "Increase document context in each request so the model has more background when assigning scores",
      "Expand representative group samples; use error rates, denominators, and uncertainty to assess performance",
      "Add evaluation agents to rescore existing samples and combine their ratings"
    ],
    "e": "The diagnosed gap is sparse coverage of a particular group. Targeted representative samples and group-level denominators and uncertainty address it; a pooled score may hide the difference. See notes 5.5.",
    "w": {
      "0": "[Metric substitution] Pooled accuracy still does not answer the question about the language group's error rate.",
      "1": "[Unmeasured expansion] The identified gap is evaluation coverage, not insufficient request context.",
      "3": "[Overengineering] Extra scoring agents do not supply representative material for the underrepresented group."
    }
  },
  "q123": {
    "q": "A public employment service uses an assistant to summarize consultation materials. Staff suspect that demographic cues in names affect evaluative wording. Qualifications and work-history facts can be held constant, and the team wants to isolate the name cue. Which test design fits?",
    "o": [
      "Expand paired historical cases differing only in names, keep qualifications and work history fixed, and review repeated outputs",
      "Add real cases with different names and compare average summary scores between the groups",
      "Hold names and qualifications fixed, vary history length, and have people review differences across repeated runs",
      "Keep qualifications and history fixed and tabulate the groups’ self-reported fairness scores"
    ],
    "e": "Paired tests hold task-relevant facts constant and change the cue under investigation. Repeated runs and human inspection help distinguish cue-related differences from ordinary variation. See notes 5.5.",
    "w": {
      "1": "[Data-shape mismatch] Real cases can differ in work history and other variables, so group averages do not isolate the name cue.",
      "2": "[Data-shape mismatch] This design manipulates history length rather than the name cue under investigation.",
      "3": "[Metric substitution] Self-reported fairness does not measure actual output changes caused by the names."
    }
  },
  "q124": {
    "q": "A language-learning platform uses a model to score practice feedback. Experts find that a preference for formal language in the rubric lowers scores for dialect expression, although formality is not a learning objective. Which changes repair the evaluator and check effects on other learners? Select 2.",
    "o": [
      "Expand scoring samples and assess the revision using the pooled mean score",
      "Rewrite feedback-generation prompts to use formal language before submitting outputs to the existing evaluator",
      "Revise irrelevant style preferences in the rubric and scoring prompts, calibrating against expert reviews",
      "Adjust the completion check for evaluation jobs and release once all scoring jobs finish",
      "Test the revision on both the affected group and the overall population, recording group sample sizes and differences"
    ],
    "e": "The identified defect is a task-irrelevant rubric preference. Correcting it and calibrating against expert judgment needs follow-up checks on both the affected group and the overall population. See notes 5.5.",
    "w": {
      "0": "[Metric substitution] A pooled mean can hide differences for dialect speakers; a larger sample does not change that measurement gap.",
      "1": "[Wrong-layer diagnosis] The defect is in the evaluation criterion; adapting generated content to it preserves the inappropriate preference.",
      "3": "[Metric substitution] Scoring-job completion does not measure whether the style preference is fixed or whether group performance has changed."
    }
  },
  "q125": {
    "q": "A retailer is launching a consumer chatbot. Users can start a new conversation from a product page without visiting registration, and the help center already describes its use of AI. Where should the team place the notice to meet the session-level disclosure requirement?",
    "o": [
      "Show the AI notice at first account registration and retain a record in the account profile",
      "Show the AI notice in each session's closing receipt and provide a help-center link",
      "Show the AI notice in the help center and track how often the explanation is read",
      "Show the AI notice as each session begins, with access to the related explanation"
    ],
    "e": "Consumer chatbots need an AI disclosure at least at the start of each session. Registration and help pages do not cover the direct entry path, and a closing notice arrives after the interaction. See notes 5.5.",
    "w": {
      "0": "[Wrong-layer diagnosis] Registration does not cover new sessions started through the direct entry path.",
      "1": "[Wrong-layer diagnosis] A closing receipt arrives after the required start-of-session disclosure point.",
      "2": "[Metric substitution] Help-page readership does not establish that users receive a notice in each session."
    }
  },
  "q126": {
    "q": "A public housing department uses an assistant to organize case materials. Qualified staff review final decisions and AI involvement is disclosed, but an applicant reports incorrect household data. The page explains the recommendation without allowing corrections or appeals. Which path should the department add first?",
    "o": [
      "Route requests for explanations to human support staff who show the recommendation and source materials",
      "Accept data corrections, route the appeal to a human reviewer, and record ownership and the outcome",
      "Collect objections in later operational audits and summarize recurring complaint themes each quarter",
      "Show the applicant the model's self-assessed fairness score and a page explaining the score"
    ],
    "e": "The applicant needs a way to correct data and request human reconsideration. Existing explanations and disclosure do not provide that action path; ownership and outcomes should be recorded. See notes 5.5.",
    "w": {
      "0": "[Wrong-layer diagnosis] Support staff explain the text and show materials, but still provide no process for corrections or appeals.",
      "2": "[Audit as prevention] A later complaint summary does not handle the individual appeal about incorrect data.",
      "3": "[Metric substitution] A model's fairness score does not establish that the reported data error has been corrected and reviewed."
    }
  }
});
