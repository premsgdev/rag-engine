import { languageCode } from '../ai/language.types';

export interface ChatRequest {
  question: string;
  language: languageCode;
}

export interface ChatResponse {
  answer: string;
  confidence: number;
  sources?: string[];
}
