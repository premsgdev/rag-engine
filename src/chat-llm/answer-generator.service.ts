import { Inject, Injectable } from '@nestjs/common';
import type { LlmClient } from './llm.interface';

@Injectable()
export class AnswerGeneratorService {
  constructor(
    @Inject('LlmClient')
    private readonly llm: LlmClient,
  ) {}

  async generateAnswerStream(
    context: string,
    question: string,
    onToken: (token: string) => void,
  ): Promise<void> {
    const prompt = this.buildPrompt(context, question);

    await this.llm.generateStream({
      model: 'gemini-2.5-flash',
      prompt,
      onToken,
    });
  }

  private buildPrompt(context: string, question: string): string {
    return `
            You are a careful assistant.

            Answer the question using ONLY the context below.
            If the answer is not present in the context, say:
            "I do not have enough information in the provided documents."

            --- CONTEXT ---
            ${context}
            --- END CONTEXT ---

            Question:
            ${question}

            Answer:
            `.trim();
  }
}
