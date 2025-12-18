import { Injectable, OnModuleInit } from '@nestjs/common';
import { ChromaClient, Collection } from 'chromadb-client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChromaService implements OnModuleInit{
  private client!: ChromaClient;
  private collection = new Map<string, Collection>();

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.client = new ChromaClient({ path: this.configService.get<string>('CHROMA_URL') });
  }

  async getCollection(name: string): Promise<Collection> {
    if (!this.collection.has(name)) {
      const collection = await this.client.getOrCreateCollection({ name });
      this.collection.set(name, collection);
    }
    return this.collection.get(name)!;
  }
  async upsertChunks(
    params: {
      collection: string;
      embeddings: number[][];
      documents: string[];
      ids: string[];
      metadatas?: Record<string, any>[];
    }
  ): Promise<void> {
    const collection = await this.getCollection(params.collection);
    await collection.upsert({
      ids: params.ids,
      embeddings: params.embeddings,
      documents: params.documents,
      metadatas: params.metadatas,
    });
  }
}