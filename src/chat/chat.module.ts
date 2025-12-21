import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatAgentsModule } from '../chat-agents/agents.module';
import { VectorSignalModule } from '../chat-retrieval/vector-signal.module';
import { RetrieverService } from '../chat-retrieval/retriever.service';
import { EmbeddingsService } from '../ai/embeddings.service';
import { ChromaService } from '../ai/chroma.service';
import { AnswerGeneratorService } from '../chat-llm/answer-generator.service';
import { ContextAssemblerService } from '../chat-retrieval/context-assembler.service';
import { LlmModule } from '../chat-llm/llm.module';
import { GoogleGenAiClient } from '../chat-llm/google-genai.client';

@Module({
  imports: [ChatAgentsModule, VectorSignalModule, LlmModule],
  providers: [
    ChatService,
    RetrieverService,
    EmbeddingsService,
    ChromaService,
    AnswerGeneratorService,
    {
      provide: 'LlmClient',
      useClass: GoogleGenAiClient,
    },
    ContextAssemblerService,
  ],
  exports: [ChatService],
})
export class ChatModule {}
