export interface RetrievedChunk {
  content: string;
  source?: string;
  distance: number;
}

export interface RetrievalResult {
  chunks: RetrievedChunk[];
}
