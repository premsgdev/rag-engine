import { Injectable } from '@nestjs/common';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import crypto from 'crypto';
import { languageCode } from './language.types';

@Injectable()
export class TextSplitterService {
  private splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 100,
  });

  async split(text: string, language: languageCode) {
    const chunks = await this.splitter.createDocuments([text]);

    return chunks.map((chunk) => ({
      content: chunk.pageContent,
      hash: this.hash(chunk.pageContent),
      language
    }));
  }

  private hash(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex');
  }
}
