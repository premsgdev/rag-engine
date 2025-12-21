export interface ChromaQueryParams {
  collection: string;
  embedding: number[];
  where?: Record<string, any>;
  nResults: number;
}

export interface ChromaQueryResult {
  id: string;
  document: string;
  metadata: Record<string, any>;
  score: number;
}
