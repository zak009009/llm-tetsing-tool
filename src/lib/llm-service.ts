import { LLMConfig, LLMProvider } from "./llm-config";

export interface LLMResponse {
  content: string;
  model: string;
  provider: LLMProvider;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export class LLMService {
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
  }

  async generateResponse(prompt: string): Promise<LLMResponse> {
    switch (this.config.provider) {
      case "ollama":
        return this.generateOllamaResponse(prompt);
      case "openai":
        return this.generateOpenAIResponse(prompt);
      case "anthropic":
        return this.generateAnthropicResponse(prompt);
      case "custom":
        return this.generateCustomResponse(prompt);
      default:
        throw new Error(`Unsupported LLM provider: ${this.config.provider}`);
    }
  }

  private async generateOllamaResponse(prompt: string): Promise<LLMResponse> {
    const response = await fetch(`${this.config.baseUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.config.model,
        prompt,
        temperature: this.config.temperature,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.response,
      model: this.config.model,
      provider: "ollama",
    };
  }

  private async generateOpenAIResponse(prompt: string): Promise<LLMResponse> {
    if (!this.config.apiKey) {
      throw new Error("OpenAI API key is required");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
        ...this.config.customHeaders,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [{ role: "user", content: prompt }],
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      model: this.config.model,
      provider: "openai",
      usage: {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
      },
    };
  }

  private async generateAnthropicResponse(
    prompt: string
  ): Promise<LLMResponse> {
    if (!this.config.apiKey) {
      throw new Error("Anthropic API key is required");
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.config.apiKey,
        "anthropic-version": "2023-06-01",
        ...this.config.customHeaders,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [{ role: "user", content: prompt }],
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.content[0].text,
      model: this.config.model,
      provider: "anthropic",
      usage: {
        promptTokens: data.usage.input_tokens,
        completionTokens: data.usage.output_tokens,
        totalTokens: data.usage.input_tokens + data.usage.output_tokens,
      },
    };
  }

  private async generateCustomResponse(prompt: string): Promise<LLMResponse> {
    if (!this.config.baseUrl) {
      throw new Error("Custom provider base URL is required");
    }

    const response = await fetch(this.config.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.config.customHeaders,
      },
      body: JSON.stringify({
        prompt,
        model: this.config.model,
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
      }),
    });

    if (!response.ok) {
      throw new Error(`Custom API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.response || data.content || data.text || data.output,
      model: this.config.model,
      provider: "custom",
    };
  }
}
