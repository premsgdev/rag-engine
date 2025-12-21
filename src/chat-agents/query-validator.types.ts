import { languageCode } from '../ai/language.types';

export interface ValidateQueryInput {
  query: string;
  language: languageCode;
  snippets: string[];
}

export interface ValidateQueryResult {
  valid: boolean;
  confidence: number;
  reason: string | null;
  needsClarification: boolean;
}
