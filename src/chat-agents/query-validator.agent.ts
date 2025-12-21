import { Inject, Injectable } from '@nestjs/common';
import {
  ValidateQueryInput,
  ValidateQueryResult,
} from './query-validator.types';
import { buildQueryValidatorPrompt } from '../chat-llm/prompts/query-validator.prompt';
import type { LlmClient } from '../chat-llm/llm.interface';
import { extractJson } from '../chat-llm/utils/json-extractor';

@Injectable()
export class QueryValidatorAgent {
  constructor(@Inject('LlmClient') private readonly llm: LlmClient) {}

  async validate(input: ValidateQueryInput): Promise<ValidateQueryResult> {
    const prompt = buildQueryValidatorPrompt(input);
    const response = await this.llm.generateText({
      prompt,
    });
    try {
      const json = extractJson(response);
      return JSON.parse(json) as ValidateQueryResult;
    } catch (e) {
      console.log(e);
      return {
        valid: false,
        confidence: 0,
        reason: 'Failed to validate query using document evidence',
        needsClarification: true,
      };
    }
  }
}
