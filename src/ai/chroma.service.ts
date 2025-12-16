import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ChromaService {
  private baseUrl = 'http://localhost:8000';

  async addVectors(
    collection: string,
    embeddings: number[][],
    documents: string[],
    ids: string[],
  ) {
    await axios.post(`${this.baseUrl}/api/v1/collections/${collection}/add`, {
      embeddings,
      documents,
      ids,
    });
  }
}
