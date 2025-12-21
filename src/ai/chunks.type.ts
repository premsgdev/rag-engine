import { languageCode } from './language.types';

export type TextChunk = {
  content: string;
  hash: string;
  language: languageCode;
};
