import { Injectable } from '@nestjs/common';
import { ChromaService } from '../ai/chroma.service';
import { EmbeddingsService } from '../ai/embeddings.service';
import { VectorSignalResult } from './vector-signal.types';
import { languageCode } from '../ai/language.types';

@Injectable()
export class VectorSignalService {
  private readonly MIN_SIMILARITY_SCORE = 0.2;
  constructor(
    private readonly embeddings: EmbeddingsService,
    private readonly chroma: ChromaService,
  ) {}

  async checkSignal(
    query: string,
    language: languageCode,
  ): Promise<VectorSignalResult> {
    const embedding = await this.embeddings.embedSingle(query);

    const results = await this.chroma.query({
      collection: 'rag-documents',
      embedding: embedding,
      //where: { language },
      nResults: 3,
    });

    if (results.length === 0) {
      return {
        hasSignal: false,
        topScore: 0,
        snippets: [],
      };
    }
    const scores = results.map((r) => r.score);
    const topScore = Math.max(...scores);

    return {
      hasSignal: true,
      topScore,
      snippets: results.map((r) => r.document.slice(0, 300)),
    };
  }
}
