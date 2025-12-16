import fs from 'fs';
import path from 'path';
import { Injectable } from '@nestjs/common';
import { PDFParse } from 'pdf-parse';

import { TextSplitterService } from '../ai/text-splitter.service';
import { EmbeddingsService } from '../ai/embeddings.service';
import { ChromaService } from '../ai/chroma.service';
import { RedisService } from '../redis/redis.service';

type TextChunk = {
  content: string;
  hash: string;
};


@Injectable()
export class IngestService {
  private documentsDir = path.join(process.cwd(), 'data/documents');
  

  constructor(
    private readonly textSplitter: TextSplitterService,
    private readonly embeddings: EmbeddingsService,
    private readonly chroma: ChromaService,
    private readonly redis: RedisService,
  ) {}

  async ingestAll(): Promise<void> {
    console.log('called ingestAll'); 
    const files = (await fs.readdirSync(this.documentsDir)).filter(file => file.endsWith('.pdf'));

    console.log(`📄 Found ${files.length} PDF files`);
    for (const file of files) {
      console.log('working on ',file);
      await this.ingestFile(path.join(this.documentsDir, file));
    }
  }

  private async ingestFile(filePath: string): Promise<void> {
    console.log(`📄 Ingesting ${filePath}`);

    const buffer = fs.readFileSync(filePath);

    // ---- PDF parsing (new API) ----
    const parser = new PDFParse({ data: buffer });
    const { text } = await parser.getText();

    // ---- Text splitting ----
    const chunks = await this.textSplitter.split(text);

    // ---- Deduplicate via Redis ----
    const newChunks: TextChunk[] = [];
    for (const chunk of chunks) {
      const exists = await this.redis
        .getClient()
        .get(`chunk:${chunk.hash}`);

      if (!exists) {
        newChunks.push(chunk);
      }
    }

    if (newChunks.length === 0) {
      console.log('⚠️ No new chunks found, skipping');
      return;
    }

    // ---- Embeddings ----
    const contents = newChunks.map((c) => c.content);
    const embeddings = await this.embeddings.embed(contents);

    // ---- Store in ChromaDB ----
    await this.chroma.addVectors(
      'documents',
      embeddings,
      contents,
      newChunks.map((c) => c.hash),
    );

    // ---- Mark chunks as processed ----
    for (const chunk of newChunks) {
      await this.redis
        .getClient()
        .set(`chunk:${chunk.hash}`, '1');
    }

    console.log(`✅ Ingested ${newChunks.length} chunks`);
  }
}
