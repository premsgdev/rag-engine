import { Injectable } from '@nestjs/common';
import type { ChatRequest, ChatResponse } from './chat.types';
import { QueryValidatorAgent } from '../chat-agents/query-validator.agent';
import { VectorSignalService } from '../chat-retrieval/vector-signal.service';
import { RetrieverService } from '../chat-retrieval/retriever.service';
import { AnswerGeneratorService } from '../chat-llm/answer-generator.service';
import { ContextAssemblerService } from '../chat-retrieval/context-assembler.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly queryValidator: QueryValidatorAgent,
    private readonly vectorSignal: VectorSignalService,
    private readonly retriever: RetrieverService,
    private readonly answerGenerator: AnswerGeneratorService,
    private readonly contextAssembler: ContextAssemblerService,
  ) {}

  async ask(request: ChatRequest): Promise<ChatResponse> {
    return {
      answer: '',
      confidence: 0,
      sources: [],
    };
  }

  async chatStream(
    request: ChatRequest,
    onToken: (token: string) => void,
  ): Promise<void> {
    const signal = await this.vectorSignal.checkSignal(
      request.question,
      request.language,
    );
    console.log(signal);
    if (!signal.hasSignal) {
      onToken('No relevant information found in the documents.');
      return;
    }
    const validationResult = await this.queryValidator.validate({
      query: request.question,
      language: request.language,
      snippets: signal.snippets,
    });
    if (!validationResult.valid) {
      if (validationResult.needsClarification) {
        onToken(validationResult.reason ?? 'Can you clarify your question?');
        return;
      }
      onToken( 
        validationResult.reason ??
          'This question cannot be answered from the available documents.',
      );
      return;
    }

    const retrieval = await this.retriever.retrieve(
      request.question,
      request.language,
    );
    if (retrieval.chunks.length === 0) {
      onToken(
        'I could not retrieve enough information to answer this question.',
      );
      return;
    }
    const { context, sources } = this.contextAssembler.assemble(
      retrieval.chunks,
    );

    if (!context) {
      onToken('The retrieved documents do not contain usable information.');
      return;
    }
    try {
      await this.answerGenerator.generateAnswerStream(
        context,
        request.question,
        (token) => onToken(token),
      );
    } catch (e) {
      onToken('The system is temporarily busy. Please try again in a moment.');
    }
  }
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
