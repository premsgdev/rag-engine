import { Injectable } from '@nestjs/common';
import { ChromaService } from '../ai/chroma.service';
import { EmbeddingsService } from '../ai/embeddings.service';
import { languageCode } from '../ai/language.types';
import { RetrievalResult } from './retrieval.types';

@Injectable()
export class RetrieverService {
  constructor(
    private readonly embeddings: EmbeddingsService,
    private readonly chroma: ChromaService,
  ) {}

  async retrieve(
    query: string,
    language: languageCode,
    topK = 5,
  ): Promise<RetrievalResult> {
    const embedding = await this.embeddings.embedSingle(query);
    const results = await this.chroma.query({
      collection: 'rag-documents',
      embedding: embedding,
      where: { language },
      nResults: topK,
    });

    return {
      chunks: results.map((r) => ({
        content: r.document,
        source: r.metadata?.source,
        distance: r.score,
      })),
    };
  }
}
