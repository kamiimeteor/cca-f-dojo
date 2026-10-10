/* Domain 7: q178–q190; option indices match questions.js. */
Object.assign(CONTENT_EN.questions, {
  "q178": {
    "q": "A newly hired software engineer clones a repository with shared Claude Code settings for an initial maintenance assignment. Personal preferences set during onboarding should affect only this engineer's work in this repository, leaving colleagues and other projects unchanged; no mandatory organizational policy is involved. Where should these preferences go?",
    "o": [
      "Store them in ~/.claude/settings.json as the engineer’s personal settings",
      "Store them in .claude/settings.local.json as personal overrides for this project",
      "Store them in .claude/settings.json as preferences maintained with the repository",
      "Store them in managed-settings.json as preferences maintained by an administrator"
    ],
    "e": "Local settings fit preferences that belong to one person in one project. User settings span projects, project settings are shared, and managed settings serve organizational policy. See notes 7.1.",
    "w": {
      "0": "[Wrong-layer diagnosis] User settings affect the engineer’s other projects, exceeding the requested scope.",
      "2": "[Wrong-layer diagnosis] Project settings put personal preferences in the shared team configuration.",
      "3": "[Wrong-layer diagnosis] Managed settings distribute organizational policy rather than an individual’s project preferences."
    }
  },
  "q179": {
    "q": "A financial institution is introducing Claude Code in a regulated environment. Its internal controls require centrally distributed restrictions on an approved list of operations tools, which members cannot remove by editing repository configuration. Acceptance reviewers also need to identify the configuration layer supplying the effective restrictions. Which approach fits?",
    "o": [
      "Put the restrictions in the organization CLAUDE.md and check the source of the managed file",
      "Put the restrictions in project settings and check the reviewed repository version",
      "Put the restrictions in user settings and check synchronization across developers",
      "Put the restrictions in managed settings and check their effective source with /status"
    ],
    "e": "Managed policy is the appropriate layer for organizational enforcement. Verify the effective source; distributing personal or project settings does not establish the same boundary, and CLAUDE.md supplies context. See notes 7.1.",
    "w": {
      "0": "[Prompt as enforcement] Loading instructions does not enforce the tool permissions described in them.",
      "1": "[Wrong-layer diagnosis] Project settings support sharing, but ordinary project settings can be overridden by individuals.",
      "2": "[Wrong-layer diagnosis] Synchronizing personal settings does not create an organization-managed enforcement layer."
    }
  },
  "q180": {
    "q": "A university's teaching platform uses Claude Code in CI to check its course catalog, with each job checking out the repository into a fresh working directory. The jobs need an approved read-only MCP server whose connection definition contains no credentials. How should that definition be registered for review and distribution with the course code so different runners receive the same definition?",
    "o": [
      "Register it with project scope and maintain the definition in the root .mcp.json",
      "Register it with local scope and maintain the definition in the current user's ~/.claude.json",
      "Register it with user scope and maintain the definition in the current user's ~/.claude.json",
      "Register it with project scope and maintain the server definition in .claude/settings.json"
    ],
    "e": "Project-scoped MCP definitions are shared through the repository’s root .mcp.json. Local and user registrations belong to an individual and do not distribute the definition with the repository. See notes 7.1.",
    "w": {
      "1": "[Wrong-layer diagnosis] Local scope is specific to one person and project; it does not make the registration team-shared.",
      "2": "[Wrong-layer diagnosis] User scope makes the registration available across one person’s projects, not across the team through the repository.",
      "3": "[Wrong-layer diagnosis] Shared MCP server definitions belong in the root .mcp.json, not the general project settings file."
    }
  },
  "q181": {
    "q": "A hospital software team investigates a denied MCP read. Managed settings contain a matching allow rule, project settings contain a matching deny rule, and the permission lists are merged normally. The caller and target are correct, and the project deny must remain. How should the team interpret the denial?",
    "o": [
      "After checking the source of the managed allow, attribute the denial to the read tool’s own response",
      "After checking rule matches, send the call through the manual confirmation associated with ask",
      "After checking the merged list, apply its deny-first decision order to reject the call",
      "After checking the model tier, retry tool selection with a more capable model"
    ],
    "e": "Ordinary configuration precedence does not override the permission-list decision order. Matching deny rules are evaluated before ask and allow, so a lower-scope deny can block a higher-scope allow. See notes 7.1.",
    "w": {
      "0": "[Wrong-layer diagnosis] The managed allow does not supersede the merged deny; the facts do not point to a rejection by the tool service.",
      "1": "[Wrong-layer diagnosis] A matching deny takes precedence over ask and does not become a confirmation request because of a higher-scope allow.",
      "3": "[Model substitution] The matching permission rule determines the result. A stronger model does not change that decision order."
    }
  },
  "q182": {
    "q": "A context inspection at the start of an inventory task in a retailer's monorepo finds lengthy store-frontend conventions already loaded. Maintainers are reorganizing repository documentation so sessions start with a short shared baseline and load module details when the relevant code is read; execution permissions are configured separately. Which changes fit? Select 2.",
    "o": [
      "Add complete copies of module conventions to the root CLAUDE.md for tasks to read",
      "Maintain common conventions in the root CLAUDE.md for repository review and distribution",
      "Maintain common conventions in the personal ~/.claude/CLAUDE.md for new teammates to use",
      "Maintain details in module-level CLAUDE.md files and add them to context when the module is read",
      "Add persistent agents to module directories to explain their development conventions on each task"
    ],
    "e": "A project CLAUDE.md shares the common baseline, while subdirectory CLAUDE.md files provide details on demand as relevant content is read. This avoids loading every module’s details at startup. See notes 7.1.",
    "w": {
      "0": "[Unmeasured expansion] Full copies in the root load unrelated module detail at startup, contrary to the requested on-demand behavior.",
      "2": "[Wrong-layer diagnosis] A personal user file is not distributed to teammates with the repository.",
      "4": "[Overengineering] The file-loading mechanism already supports this requirement; persistent agents add coordination with no identified need."
    }
  },
  "q183": {
    "q": "A component library has an accepted deterministic formatter. The team wants Claude Code to run it after every file change made with Edit or Write, with no semantic judgment needed. How should this step be wired?",
    "o": [
      "Configure a PreToolUse command hook matching Edit|Write to run the formatter",
      "Configure a PostToolUse command hook matching Edit|Write to run the formatter",
      "Configure a PostToolUse command hook to call a formatting agent that plans the changes",
      "Configure a PostToolUse command hook to append the complete formatting example set to the session"
    ],
    "e": "A PostToolUse hook with type: command and matcher: Edit|Write runs the existing formatter after edits. A fixed check does not need the model to decide whether to perform it. See notes 7.2.",
    "w": {
      "0": "[Wrong-layer diagnosis] PreToolUse runs before the edit, so the formatter cannot process the content that this tool call has yet to write.",
      "2": "[Overengineering] The accepted script handles this deterministic task; an additional planning agent adds unnecessary orchestration.",
      "3": "[Unmeasured expansion] Appending examples increases context without executing the required formatting step."
    }
  },
  "q184": {
    "q": "A public-sector open-source project will use claude -p in CI to review contributed branches and save JSON results. Reviews only need source access, but contributors can change project hooks and MCP definitions, and the runner’s existing credentials can publish artifacts. Which preparations directly address these execution risks? Select 2.",
    "o": [
      "Inspect all branch hook scripts and MCP definitions, loading them after approval by the duty owner",
      "Keep the runner’s publishing credentials and inspect tool logs for anomalies after completion",
      "Limit runner credentials and available tools, retaining only the capabilities needed for source review",
      "Set --allowedTools to read tools and manage the tool boundary as a complete allowlist",
      "Add a read-only convention to CLAUDE.md for the review process to follow"
    ],
    "e": "Ordinary -p execution can load project hooks and MCP without a trust dialog, so executable configuration needs prior review. Remove publishing capability from the review runner; --allowedTools grants automatic approval and is not a complete tool boundary. See notes 7.2.",
    "w": {
      "1": "[Audit as prevention] Reviewing logs afterward leaves publishing credentials available during a read-only review.",
      "3": "[Wrong-layer diagnosis] The flag controls automatic approval, not the complete set of available tools. Treating it as a full allowlist misreads its role.",
      "4": "[Prompt as enforcement] A context instruction cannot constrain hook execution or the permissions carried by runner credentials."
    }
  },
  "q185": {
    "q": "A platform team uses Claude Code to investigate intermittent build-cache misses while keeping an implementation plan in the main conversation. Search transcripts are crowding that context, but the handoff only needs findings and file locations. How should further exploration run?",
    "o": [
      "Use an ordinary subagent for independent search and return the full transcript with file locations",
      "Keep the complete search transcript in the main session and add a subagent to review its summary and file locations",
      "Expand the search in the main session and read more records before preparing an investigation summary",
      "Use an ordinary subagent to search all relevant material independently and return a transcript summary with file locations"
    ],
    "e": "An ordinary subagent can keep lengthy search work in its own context and return a traceable summary. Configure its tool permissions separately; context isolation alone does not restrict access. See notes 7.2.",
    "w": {
      "0": "[Unmeasured expansion] Returning the full transcript puts the search material back into the crowded main context, beyond what the handoff needs.",
      "1": "[Overengineering] The main session still holds the full search process. A summary-review agent adds orchestration without isolating that context.",
      "2": "[Unmeasured expansion] The observed constraint is main-session context, with no identified information gap that calls for more search records there."
    }
  },
  "q186": {
    "q": "An internal tool needs a button-label change. The target file and acceptance assertion are already known, and behavior and interfaces will stay the same. Which workflow fits the size of the change while providing material for merge review?",
    "o": [
      "Make the targeted text edit, run relevant checks, and provide the diff and test output",
      "Split the feature among several agents and combine their changes and check results",
      "Supply the full repository background for the main session to read before making the edit",
      "Write a complete planning document under repository standards and have the owner review it before editing and running tests"
    ],
    "e": "A small, explicit change can proceed directly to implementation and verification without a separate planning stage. Reviewers can inspect the diff and relevant test output to confirm scope and results. See notes 7.2.",
    "w": {
      "1": "[Overengineering] A single specified label change does not need independent agents; their coordination adds work without a task decomposition need.",
      "2": "[Unmeasured expansion] The target and assertion are known, so a complete repository background addresses no demonstrated information gap.",
      "3": "[Overengineering] The file, assertion, and scope are already known. A full planning document is unnecessary for this small change."
    }
  },
  "q187": {
    "q": "A municipal booking service times out intermittently; the current summary shows a gateway error but omits upstream stages of the same request. The on-call engineer has bounded the incident window and can supply redacted upstream logs and recent deployment records. Which preparations support testable hypotheses? Select 2.",
    "o": [
      "Expand the input to complete service log histories so the analysis covers more possible relationships",
      "Expand the input with redacted logs from each stage along the request path, matching timestamps to changes released during that period",
      "Use a stronger model to analyze the existing gateway summary in greater depth",
      "Aggregate error counts by service and use their ranking to identify this request’s failure source",
      "Annotate original log lines and request identifiers, asking for facts, hypotheses, and open checks separately"
    ],
    "e": "The missing upstream stages are a specific evidence gap, so adding relevant records within the incident window is justified. Source lines and request identifiers support verification, and separating facts from hypotheses guides subsequent tests. See notes 7.3.",
    "w": {
      "0": "[Unmeasured expansion] Complete histories expand beyond the known request and time window without targeting the missing evidence.",
      "2": "[Model substitution] A stronger model cannot recover absent upstream evidence from the gateway summary.",
      "3": "[Metric substitution] Error counts measure frequency rather than establishing the causal source of this request’s failure."
    }
  },
  "q188": {
    "q": "A hospital scheduling system intermittently omits rows from an export. A proposed fix has run in an isolated environment and its new test passes, but the assertion only checks that the download request succeeds. What is the best next acceptance step?",
    "o": [
      "Check repeated downloads, using a stable request success rate across runs as the acceptance criterion",
      "Check added tests and covered source lines, using growth in both measures as the acceptance criterion",
      "Check that export-content assertions catch missing rows on the old code, using passing reruns and regressions on the fix as the acceptance criterion",
      "Check a stronger model's patch analysis, using its assessment that missing rows are fixed as the acceptance criterion"
    ],
    "e": "The assertion must exercise the original failure. Confirm that it catches missing content in the old implementation, then run it and relevant regressions against the fix. A successful request does not establish export completeness. See notes 7.3.",
    "w": {
      "0": "[Metric substitution] Download success measures the request outcome; repeatedly measuring it still misses the content defect.",
      "1": "[Metric substitution] Test counts and covered source lines do not establish that assertions can detect missing export rows.",
      "3": "[Model substitution] Changing the review model does not validate the target behavior, and no evaluation supports that switch."
    }
  },
  "q189": {
    "q": "A payment-platform troubleshooting assistant holds administrator credentials and normally reads logs. It occasionally needs to execute a specified rollback, but account administration and other writes are outside its role. Which changes preserve necessary rollback while restricting production actions? Select 2.",
    "o": [
      "Make routine diagnosis read-only, remove unrelated writes, and add an authorized entry point limited to rollback commands",
      "Send account-administration writes to the owner for individual confirmation before execution",
      "Send anomalous production write logs to the owner for review after execution",
      "Submit the rollback command, target, impact, and recovery plan to the duty owner for confirmation before execution",
      "Add a convention to CLAUDE.md to check role scope before writing"
    ],
    "e": "Use read-only access for diagnosis and remove unrelated writes. Necessary rollback can have a narrowly authorized execution path with prior review of the command, target, impact, and recovery conditions. Confirmation belongs on required operations, not surplus administrator capabilities. See notes 7.3.",
    "w": {
      "1": "[Guarding excess capability] Account administration is explicitly unnecessary; confirmation retains a capability that should be removed.",
      "2": "[Audit as prevention] Post-write records and notifications do not constrain production actions before execution, and administrator access remains.",
      "4": "[Prompt as enforcement] An instruction does not change the capabilities of administrator credentials or enforce the role boundary."
    }
  },
  "q190": {
    "q": "A release team enables the sandbox in an ordinary execution mode, leaving autoAllowBashIfSandboxed at its default of true. Required git push commands run inside the sandbox and are not excluded commands. The team requires confirmation before these commands run. Which configuration fits?",
    "o": [
      "Add a content-specific ask rule to the permission list matching Bash(git push *) calls",
      "Add a whole-tool Bash ask rule to the permission list covering sandboxed command calls",
      "Add a pre-push confirmation convention to CLAUDE.md that asks for a target-branch check",
      "Add push-log verification to a post-execution hook and send the record to the release owner for confirmation"
    ],
    "e": "With default sandbox auto-approval in ordinary execution modes, a whole-tool Bash ask does not guarantee a prompt. A content-specific ask such as Bash(git push *) still requests confirmation. See notes 7.3.",
    "w": {
      "1": "[Wrong-layer diagnosis] Whole-tool Bash ask has an auto-approval exception under the stated sandbox conditions, so it cannot guarantee push confirmation.",
      "2": "[Prompt as enforcement] A convention in CLAUDE.md does not change execution approval rules.",
      "3": "[Audit as prevention] Verification after the push does not meet the requirement to request confirmation before execution."
    }
  }
});
