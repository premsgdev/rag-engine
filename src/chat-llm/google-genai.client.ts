import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import {
  LlmClient,
  LlmGenerateOptions,
  LlmStreamOptions,
} from './llm.interface';

@Injectable()
export class GoogleGenAiClient implements LlmClient {
  private readonly client: GoogleGenAI;
  private readonly chat_model = 'gemini-2.5-flash';

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }

    this.client = new GoogleGenAI({ apiKey });
  }
  async generateText(options: LlmGenerateOptions): Promise<string> {
    const response = await this.client.models.generateContent({
      model: this.chat_model,
      contents: options.prompt,
    });
    return response.text ?? '';
  }

  async generateStream(options: LlmStreamOptions): Promise<void> {
    const stream = await this.client.models.generateContentStream({
      model: this.chat_model,
      contents: [
        {
          role: 'user',
          parts: [{ text: options.prompt }],
        },
      ],
    });
    for await (const chunk of stream) {
      const text = chunk.text;
      console.log(text);
      if (text) {
        options.onToken(text);
      }
    }
  }
}
