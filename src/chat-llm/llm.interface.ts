export interface LlmGenerateOptions {
  prompt: string;
}

export interface LlmStreamOptions {
  model: string;
  prompt: string;
  onToken: (token: string) => void;
}

export interface LlmClient {
  generateText(prompt: LlmGenerateOptions): Promise<string>;
  generateStream(options: LlmStreamOptions): Promise<void>;
}
