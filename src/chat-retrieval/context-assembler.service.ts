import { Injectable } from '@nestjs/common';
import { RetrievedChunk } from './retrieval.types';

@Injectable()
export class ContextAssemblerService {
  private readonly MAX_CONTEXT_CHARS = 4000;

  assemble(chunks: RetrievedChunk[]) {
    let context = '';
    const sources = new Set<string>();
    for (const chunk of chunks) {
      if (context.length >= this.MAX_CONTEXT_CHARS) {
        break;
      }

      const text = chunk.content.trim();
      if (!text) continue;

      context += `\n---\n${text}\n`;

      if (chunk.source) {
        sources.add(chunk.source);
      }
    }

    return {
      context: context.trim(),
      sources: Array.from(sources),
    };
  }
}
