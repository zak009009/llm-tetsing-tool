'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type LLMProvider = 'ollama' | 'external_api' | 'genkit_default';

export interface AppConfig {
  llmProvider: LLMProvider;
  ollamaBaseUrl: string;
  apiEndpoint: string;
  apiKey: string;
  modelName: string;
  setLLMProvider: (provider: LLMProvider) => void;
  setOllamaBaseUrl: (url: string) => void;
  setApiEndpoint: (url: string) => void;
  setApiKey: (key: string) => void;
  setModelName: (name: string) => void;
}

export const useAppConfig = create<AppConfig>()(
  persist(
    (set) => ({
      llmProvider: 'genkit_default',
      ollamaBaseUrl: 'http://localhost:11434',
      apiEndpoint: '',
      apiKey: '',
      modelName: 'gemini-2.0-flash', // Default based on current genkit.ts
      setLLMProvider: (provider) => set({ llmProvider: provider }),
      setOllamaBaseUrl: (url) => set({ ollamaBaseUrl: url }),
      setApiEndpoint: (url) => set({ apiEndpoint: url }),
      setApiKey: (key) => set({ apiKey: key }),
      setModelName: (name) => set({ modelName: name }),
    }),
    {
      name: 'llm-exploit-lab-config-v1', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage),
    }
  )
);
