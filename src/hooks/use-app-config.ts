"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type LLMProvider } from "@/lib/llm-config";

export interface AppConfig {
  llmProvider: LLMProvider;
  ollamaBaseUrl: string;
  apiEndpoint: string;
  apiKey: string;
  modelName: string;
  temperature: number;
  maxTokens?: number;
  setLLMProvider: (provider: LLMProvider) => void;
  setOllamaBaseUrl: (url: string) => void;
  setApiEndpoint: (url: string) => void;
  setApiKey: (key: string) => void;
  setModelName: (name: string) => void;
  setTemperature: (temp: number) => void;
  setMaxTokens: (tokens: number) => void;
}

export const useAppConfig = create<AppConfig>()(
  persist(
    (set) => ({
      llmProvider: "ollama",
      ollamaBaseUrl: "http://127.0.0.1:11434",
      apiEndpoint: "",
      apiKey: "",
      modelName: "llama2",
      temperature: 0.7,
      maxTokens: 2000,
      setLLMProvider: (provider) => set({ llmProvider: provider }),
      setOllamaBaseUrl: (url) => set({ ollamaBaseUrl: url }),
      setApiEndpoint: (url) => set({ apiEndpoint: url }),
      setApiKey: (key) => set({ apiKey: key }),
      setModelName: (name) => set({ modelName: name }),
      setTemperature: (temp) => set({ temperature: temp }),
      setMaxTokens: (tokens) => set({ maxTokens: tokens }),
    }),
    {
      name: "llm-exploit-lab-config-v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
