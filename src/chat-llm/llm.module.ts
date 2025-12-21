import { Module } from '@nestjs/common';
import { GoogleGenAiClient } from './google-genai.client';
import { AnswerGeneratorService } from './answer-generator.service';

@Module({
  providers: [
    AnswerGeneratorService,
    {
      provide: 'LlmClient',
      useClass: GoogleGenAiClient,
    },
  ],
  exports: [AnswerGeneratorService],
})
export class LlmModule {}
