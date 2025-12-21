import fs from 'fs';
import path from 'path';
import { Injectable } from '@nestjs/common';
import { PDFParse } from 'pdf-parse';

import { TextSplitterService } from '../ai/text-splitter.service';
import { EmbeddingsService } from '../ai/embeddings.service';
import { ChromaService } from '../ai/chroma.service';
import { RedisService } from '../redis/redis.service';
import { languageCode, SUPPORTED_LANGUAGES } from '../ai/language.types';
import { TextChunk } from '../ai/chunks.type';

@Injectable()
export class IngestService {
  private documentsDir = path.join(process.cwd(), 'data/documents');
  private collectionName = 'rag-documents';

  constructor(
    private readonly textSplitter: TextSplitterService,
    private readonly embeddings: EmbeddingsService,
    private readonly chroma: ChromaService,
    private readonly redis: RedisService,
  ) {}

  async ingestAll(): Promise<void> {
    console.log('base directory ', this.documentsDir);

    for (const language of SUPPORTED_LANGUAGES) {
      await this.ingestLanguage(language);
    }
  }

  private async ingestLanguage(language: languageCode): Promise<void> {
    const langDir = path.join(this.documentsDir, language);
    if (!fs.existsSync(langDir)) {
      console.warn('Directory not found for language: ', language);
      return;
    }
    const files = (await fs.readdirSync(langDir)).filter((file) =>
      file.toLocaleLowerCase().endsWith('.pdf'),
    );

    console.log(`Found ${files.length} PDF files for language ${language}`);
    for (const file of files) {
      console.log('working on ', file);
      await this.ingestFile(path.join(langDir, file), language);
    }
  }

  private async ingestFile(
    filePath: string,
    language: languageCode,
  ): Promise<void> {
    console.log(`Ingesting ${filePath}`);

    const buffer = fs.readFileSync(filePath);

    const parser = new PDFParse({ data: buffer });
    const { text } = await parser.getText();

    const chunks = await this.textSplitter.split(text, language);
    console.log(` chunks length :-  ${chunks.length}`);
    const newChunks: TextChunk[] = [];
    for (const chunk of chunks) {
      const exists = await this.redis.getClient().get(`chunk:${chunk.hash}`);

      if (!exists) {
        newChunks.push(chunk);
      }
    }

    if (newChunks.length === 0) {
      console.log('No new chunks found, skipping');
      return;
    }

    const contents = newChunks.map((c) => c.content);
    const embeddings = await this.embeddings.embed(contents);
    console.log(` embeddings length :-  ${embeddings.length}`);

    try {
      await this.chroma.upsertChunks({
        collection: this.collectionName,
        embeddings,
        documents: newChunks.map((c) => c.content),
        ids: newChunks.map((c) => c.hash),
        metadatas: newChunks.map((c) => ({
          language: c.language,
          source: filePath,
        })),
      });
    } catch (error) {
      throw new Error(`Error adding vectors to Chroma: ${error}`);
    }

    for (const chunk of newChunks) {
      await this.redis.getClient().set(`chunk:${chunk.hash}`, '1');
    }

    console.log(`Ingested ${newChunks.length} chunks`);
  }
}
