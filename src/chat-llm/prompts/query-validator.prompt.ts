import { ValidateQueryInput } from '../../chat-agents/query-validator.types';

export function buildQueryValidatorPrompt(input: ValidateQueryInput): string {
  const snippetsText =
    input.snippets.length > 0
      ? input.snippets.map((s, i) => `${i + 1}. "${s}"`).join('\n')
      : 'No relevant document snippets were found.';

  return `You are a strict validation system for a Retrieval-Augmented Generation (RAG) application.

        The system has access ONLY to documents written in language: ${input.language}

        User question:
        "${input.query}"

        Retrieved document snippets:
        ${snippetsText}

        Your task:
        - Decide if the question can be answered using ONLY the document snippets above
        - Do NOT use external knowledge
        - Do NOT guess
        - If snippets are irrelevant or insufficient, reject the question
        - If the question is vague, request clarification

        Respond ONLY in valid JSON using this schema:

        {
        "valid": boolean,
        "confidence": number,        // value between 0 and 1
        "reason": string | null,
        "needsClarification": boolean
        }

        Rules:
        - If snippets do not contain enough information, set valid=false
        - If snippets are unrelated, set valid=false
        - If question is vague, set needsClarification=true
        - Do NOT include markdown
        - Do NOT include explanations outside JSON
        - If the question is ambiguous AND the snippets clearly refer to a specific named entity,
          set:
            valid = false
            needsClarification = true
            reason = "Did you mean <specific entity name>?"

        - If snippets are unrelated, set:
            valid = false
            needsClarification = false

        - If snippets clearly answer the question, set:
            valid = true

        - Do NOT answer the question
        - Do NOT explain documents
        - ONLY decide validity and clarification
        `;
}
