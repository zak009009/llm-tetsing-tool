import { LLMService } from "./llm-service";
import { LLMConfig } from "./llm-config";

let serverConfig = {
  llmService: null as LLMService | null,
  isConnected: false,
  connectionError: null as string | null,
};

export function getServerConfig() {
  return serverConfig;
}

export function updateServerConfig(config: {
  llmService?: LLMService | null;
  isConnected?: boolean;
  connectionError?: string | null;
}) {
  serverConfig = {
    ...serverConfig,
    ...config,
  };
}

export async function initializeLLMService(config: LLMConfig) {
  try {
    // Validate Ollama configuration
    if (config.provider === "ollama") {
      if (!config.baseUrl) {
        throw new Error("Ollama base URL is required");
      }
      if (!config.model) {
        throw new Error("Ollama model name is required");
      }
    }

    const llmService = new LLMService(config);

    // Test the connection immediately
    const testPrompt =
      "Test connection - respond with 'OK' if you can read this.";
    try {
      const response = await llmService.generateResponse(testPrompt);
      const isConnected = response.content.toLowerCase().includes("ok");

      if (!isConnected) {
        throw new Error("Failed to get valid response from LLM service");
      }

      updateServerConfig({
        llmService,
        isConnected: true,
        connectionError: null,
      });

      return llmService;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("ECONNREFUSED")) {
          throw new Error(
            `Could not connect to ${config.provider}. Please make sure the service is running and accessible at ${config.baseUrl}`
          );
        }
        throw error;
      }
      throw new Error("Failed to test LLM service connection");
    }
  } catch (error) {
    updateServerConfig({
      llmService: null,
      isConnected: false,
      connectionError:
        error instanceof Error
          ? error.message
          : "Failed to initialize LLM service",
    });
    throw error;
  }
}
