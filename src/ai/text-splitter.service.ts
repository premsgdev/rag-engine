import { Injectable } from '@nestjs/common';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import crypto from 'crypto';

@Injectable()
export class TextSplitterService {
  private splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 100,
  });

  async split(text: string) {
    const chunks = await this.splitter.createDocuments([text]);

    return chunks.map((chunk) => ({
      content: chunk.pageContent,
      hash: this.hash(chunk.pageContent),
    }));
  }

  private hash(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex');
  }
}
