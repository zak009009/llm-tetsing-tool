import { z } from "zod";

export const LLMProviderSchema = z.enum([
  "ollama",
  "openai",
  "anthropic",
  "custom",
]);
export type LLMProvider = z.infer<typeof LLMProviderSchema>;

export const OllamaModelSchema = z.object({
  name: z.string(),
  contextWindow: z.number().optional(),
  temperature: z.number().min(0).max(2).default(0.7),
});

export const LLMConfigSchema = z.object({
  provider: LLMProviderSchema,
  model: z.string(),
  baseUrl: z.string().url().optional(),
  apiKey: z.string().optional(),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().optional(),
  customHeaders: z.record(z.string()).optional(),
});

export type LLMConfig = z.infer<typeof LLMConfigSchema>;

export const defaultConfig: LLMConfig = {
  provider: "ollama",
  model: "llama2",
  baseUrl: "http://localhost:11434",
  temperature: 0.7,
};
