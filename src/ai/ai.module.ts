import { Module } from '@nestjs/common';
import { TextSplitterService } from './text-splitter.service';
import { EmbeddingsService } from './embeddings.service';
import { ChromaService } from './chroma.service';

@Module({
  providers: [TextSplitterService, EmbeddingsService, ChromaService],
  exports: [TextSplitterService, EmbeddingsService, ChromaService],
})
export class AiModule {}
