/* 三道种子题的英文内容；答案下标沿用 questions.js。 */
Object.assign(CONTENT_EN.questions, {
  "q001": {
    "q": "A retailer’s support agent only handles ticket lookups and composes responses, but its configuration also includes refund and account-deletion tools. What should you do first to apply least privilege?",
    "o": [
      "Add detailed call logs while retaining refund and account-deletion tools",
      "Require confirmation before refunds and account deletion, keeping the tool configuration",
      "Remove refund and deletion tools; retain ticket lookup and response drafting",
      "Use a larger model so it can better judge which tools it should avoid"
    ],
    "e": "Refunds and account deletion are outside this agent’s responsibilities. Removing those tools eliminates the unnecessary capabilities from its configuration. See notes 3.1.",
    "w": {
      "0": "[Audit as prevention] Logs help investigate past actions, but do not prevent the agent from calling tools outside its responsibilities.",
      "1": "[Guarding excess capability] A confirmation dialog adds an approval step but retains capabilities the task does not need. Remove those tools instead.",
      "3": "[Model substitution] A larger model does not have fewer permissions. Model judgement cannot replace restrictions in the tool configuration."
    }
  },
  q002: {
    "q": "A financial assistant repeatedly reads the same long system instructions and policy documents while user questions change. The team must retain the complete policies and reduce repeated input-processing costs; the model supports caching a prefix of this length. Which measures fit? Select 2.",
    "o": [
      "Split policies by topic and load the matching modules for each inquiry",
      "Place system instructions and complete policies first, with the changing user question at the end",
      "Move requests to a model with a lower token price and retain the current policy submission structure",
      "Enable prompt caching on the stable prefix so its input processing is reused",
      "Arrange the complete policies as example conversations and send them through the existing request flow"
    ],
    "e": "A stable leading segment creates an identical cacheable prefix. Enabling caching reuses its input processing while retaining the complete policies. See notes 2.5.",
    "w": {
      "0": "[Compliance shortcut] Selecting modules by topic leaves other policy text out of the request, contrary to the full-policy requirement.",
      "2": "[Model substitution] The cheaper model lacks task-quality and total-cost evaluation support and does not address repeated-prefix processing.",
      "4": "[Wrong-layer diagnosis] Example conversations change presentation, but the existing flow still processes the same input without enabling caching."
    }
  },
  "q003": {
    "q": "After a healthcare team reloads its knowledge base, the retrieval-assisted bot begins making factual errors while expressing high certainty. The team has kept the model release fixed, and measured response times are steady. Where should troubleshooting begin?",
    "o": [
      "Switch to a model stronger at factual answers, keeping the reloaded knowledge base",
      "Check document ingestion and indexing, then inspect retrieval of updated content",
      "Raise temperature to generate more varied answers from the same retrieved material",
      "Shorten user questions to make room for retrieved content"
    ],
    "e": "The errors began after the document refresh. Check ingestion, chunking, indexing and retrieval to verify that the model receives relevant, current evidence, then investigate other components as the evidence warrants. See notes 4.4.",
    "w": {
      "0": "[Model substitution] The model version is unchanged. The document update is the first relevant lead; replacing the model skips that investigation.",
      "2": "[Wrong-layer diagnosis] Raising temperature does not repair ingestion or retrieval problems introduced by the document refresh.",
      "3": "[Wrong-layer diagnosis] The evidence points to the document refresh; shortening questions does not repair indexing or retrieval."
    }
  },
});
