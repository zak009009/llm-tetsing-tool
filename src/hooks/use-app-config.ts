"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type LLMProvider } from "@/lib/llm-config";
import { LLMService } from "@/lib/llm-service";

export interface AppConfig {
  llmProvider: LLMProvider;
  baseUrl: string;
  apiKey: string;
  modelName: string;
  temperature: number;
  maxTokens?: number;
  customHeaders?: Record<string, string>;
  llmService: LLMService | null;
  isConnected: boolean;
  connectionError: string | null;
  setLLMProvider: (provider: LLMProvider) => void;
  setBaseUrl: (url: string) => void;
  setApiKey: (key: string) => void;
  setModelName: (name: string) => void;
  setTemperature: (temp: number) => void;
  setMaxTokens: (tokens: number) => void;
  setCustomHeaders: (headers: Record<string, string>) => void;
  testConnection: () => Promise<boolean>;
  updateLLMService: () => void;
}

export const useAppConfig = create<AppConfig>()(
  persist(
    (set, get) => ({
      llmProvider: "ollama",
      baseUrl: "http://127.0.0.1:11434",
      apiKey: "",
      modelName: "llama2",
      temperature: 0.7,
      maxTokens: 2000,
      customHeaders: {},
      llmService: null,
      isConnected: false,
      connectionError: null,

      setLLMProvider: (provider) => {
        set({ llmProvider: provider });
        get().updateLLMService();
      },
      setBaseUrl: (url) => {
        set({ baseUrl: url });
        get().updateLLMService();
      },
      setApiKey: (key) => {
        set({ apiKey: key });
        get().updateLLMService();
      },
      setModelName: (name) => {
        set({ modelName: name });
        get().updateLLMService();
      },
      setTemperature: (temp) => {
        set({ temperature: temp });
        get().updateLLMService();
      },
      setMaxTokens: (tokens) => {
        set({ maxTokens: tokens });
        get().updateLLMService();
      },
      setCustomHeaders: (headers) => {
        set({ customHeaders: headers });
        get().updateLLMService();
      },

      updateLLMService: () => {
        const state = get();
        try {
          const service = new LLMService({
            provider: state.llmProvider,
            model: state.modelName,
            baseUrl: state.baseUrl,
            apiKey: state.apiKey,
            temperature: state.temperature,
            maxTokens: state.maxTokens,
            customHeaders: state.customHeaders,
          });
          set({ llmService: service, connectionError: null });
        } catch (error) {
          set({
            llmService: null,
            connectionError:
              error instanceof Error
                ? error.message
                : "Failed to initialize LLM service",
          });
        }
      },

      testConnection: async () => {
        const state = get();
        if (!state.llmService) {
          set({
            isConnected: false,
            connectionError: "LLM service not initialized",
          });
          return false;
        }

        try {
          const testPrompt =
            "Test connection - respond with 'OK' if you can read this.";
          const response = await state.llmService.generateResponse(testPrompt);
          const isConnected = response.content.toLowerCase().includes("ok");
          set({
            isConnected,
            connectionError: isConnected ? null : "Invalid response from LLM",
          });
          return isConnected;
        } catch (error) {
          set({
            isConnected: false,
            connectionError:
              error instanceof Error ? error.message : "Connection test failed",
          });
          return false;
        }
      },
    }),
    {
      name: "llm-exploit-lab-config-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        llmProvider: state.llmProvider,
        baseUrl: state.baseUrl,
        apiKey: state.apiKey,
        modelName: state.modelName,
        temperature: state.temperature,
        maxTokens: state.maxTokens,
        customHeaders: state.customHeaders,
      }),
    }
  )
);
