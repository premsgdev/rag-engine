export interface AnswerGenerationInput {
  query: string;
  context: string;
}

export interface AnswerGenerator {
  generateStream(
    input: AnswerGenerationInput,
    onToken: (token: string) => void,
  ): Promise<void>;
}
