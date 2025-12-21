/**
 * Extracts a JSON object from an LLM response.
 *
 * Handles common LLM output patterns:
 * - ```json ... ``` fenced blocks
 * - ``` ... ``` fenced blocks
 * - Raw JSON objects
 *
 * Throws an error if no JSON can be safely extracted.
 */
export function extractJson(llmOutput: string): string {
  if (!llmOutput || typeof llmOutput !== 'string') {
    throw new Error('LLM output is empty or not a string');
  }

  const trimmed = llmOutput.trim();

  /**
   * 1️⃣ Case: JSON wrapped in markdown code fences
   * Example:
   * ```json
   * { "key": "value" }
   * ```
   */
  const fencedJsonMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);

  if (fencedJsonMatch?.[1]) {
    return fencedJsonMatch[1].trim();
  }

  /**
   * 2️⃣ Case: Raw JSON object in the text
   * Example:
   * { "key": "value" }
   */
  const rawJsonMatch = trimmed.match(/\{[\s\S]*\}/);

  if (rawJsonMatch?.[0]) {
    return rawJsonMatch[0].trim();
  }

  /**
   * 3️⃣ No valid JSON found
   * We fail explicitly so the caller can fail closed.
   */
  throw new Error('No valid JSON found in LLM output');
}
