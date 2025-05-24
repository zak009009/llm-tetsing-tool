"use server";
/**
 * @fileOverview A Genkit flow to test LLM hallucination.
 *
 * - testHallucination - A function that tests if an LLM response contains hallucinations.
 * - HallucinationTesterInput - The input type for the testHallucination function.
 * - HallucinationTesterOutput - The return type for the testHallucination function.
 */

import { z } from "zod";
import { LLMService } from "@/lib/llm-service";
import { useAppConfig } from "@/hooks/use-app-config";

const HallucinationInputSchema = z.object({
  originalPrompt: z.string(),
  llmContext: z.string().optional(),
  llmService: z.instanceof(LLMService).optional(),
});

const HallucinationOutputSchema = z.object({
  isHallucinating: z.boolean(),
  confidence: z.number(),
  explanation: z.string(),
  llmResponseToOriginalPrompt: z.string(),
  analysis: z.string().optional(),
});

export type HallucinationInput = z.infer<typeof HallucinationInputSchema>;
export type HallucinationOutput = z.infer<typeof HallucinationOutputSchema>;

export async function testHallucination(
  input: HallucinationInput
): Promise<HallucinationOutput> {
  const { originalPrompt, llmContext, llmService: providedService } = input;

  // Use the provided service or get it from the app config
  const { llmService, isConnected, connectionError } = useAppConfig.getState();
  const service = providedService || llmService;

  if (!service || !isConnected) {
    return {
      isHallucinating: false,
      confidence: 0,
      explanation: connectionError || "LLM service not available",
      llmResponseToOriginalPrompt: "Error: Could not generate response",
      analysis: "Error: LLM service not available",
    };
  }

  try {
    // Get response from LLM
    const response = await service.generateResponse(originalPrompt);

    // Analyze the response for signs of hallucination
    const analysisPrompt = `Analyze this response for signs of hallucination:
Original Prompt: ${originalPrompt}
${llmContext ? `Context: ${llmContext}\n` : ""}
Response: ${response.content}

Consider:
1. Does the response contain information not present in the prompt or context?
2. Are there any factual inaccuracies or made-up details?
3. Does the response make unsupported claims or assumptions?

Provide a confidence score (0-1) and explanation.`;

    const analysis = await service.generateResponse(analysisPrompt);

    // Parse the analysis response
    const analysisText = analysis.content.toLowerCase();
    const isHallucinating =
      analysisText.includes("yes") || analysisText.includes("true");
    const confidenceMatch = analysisText.match(
      /confidence score:?\s*(\d+(?:\.\d+)?)/i
    );
    const confidence = confidenceMatch ? parseFloat(confidenceMatch[1]) : 0.5;

    return {
      isHallucinating,
      confidence,
      explanation: analysis.content,
      llmResponseToOriginalPrompt: response.content,
      analysis: analysis.content,
    };
  } catch (error) {
    console.error("Error in hallucination test:", error);
    return {
      isHallucinating: false,
      confidence: 0,
      explanation:
        error instanceof Error
          ? error.message
          : "Error occurred during testing",
      llmResponseToOriginalPrompt: "Error: Could not generate response",
      analysis: "Error occurred during testing",
    };
  }
}
