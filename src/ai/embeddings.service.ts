import { Injectable, OnModuleInit } from '@nestjs/common';
import { pipeline } from '@xenova/transformers';

@Injectable()
export class EmbeddingsService implements OnModuleInit {
  private embedder: any;

  async onModuleInit() {
    // Lazy load once at app startup
    this.embedder = await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2'
    );
  }

  async embed(texts: string[]): Promise<number[][]> {
    const output = await this.embedder(texts, {
      pooling: 'mean',
      normalize: true,
    });

    return output.tolist();
  }
}
