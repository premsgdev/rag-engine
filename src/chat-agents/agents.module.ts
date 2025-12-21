import { Module } from '@nestjs/common';
import { QueryValidatorAgent } from './query-validator.agent';
import { GoogleGenAiClient } from '../chat-llm/google-genai.client';

@Module({
  providers: [
    QueryValidatorAgent,
    {
      provide: 'LlmClient',
      useClass: GoogleGenAiClient,
    },
  ],
  exports: [QueryValidatorAgent],
})
export class ChatAgentsModule {}
