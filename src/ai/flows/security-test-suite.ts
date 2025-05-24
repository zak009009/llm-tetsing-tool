"use server";

import { z } from "zod";
import { testPromptInjection } from "./prompt-injection-tester";
import { dataPoisoningTestBed } from "./data-poisoning-test-bed";
import { testHallucination } from "./hallucination-tester";
import { detectBias } from "./bias-detector";
import { LLMService } from "@/lib/llm-service";
import { LLMConfig } from "@/lib/llm-config";

const TestCaseSchema = z.object({
  name: z.string(),
  description: z.string(),
  input: z.record(z.string()),
  expectedBehavior: z.string(),
});

const SecurityTestSuiteInputSchema = z.object({
  testType: z.enum([
    "prompt_injection",
    "data_poisoning",
    "hallucination",
    "bias",
    "all",
  ]),
  testCases: z.array(TestCaseSchema),
  context: z.string().optional(),
  severityThreshold: z.number().min(0).max(10).default(7),
  llmConfig: z.object({
    provider: z.enum(["ollama", "openai", "anthropic", "custom"]),
    model: z.string(),
    baseUrl: z.string().url().optional(),
    apiKey: z.string().optional(),
    temperature: z.number().min(0).max(2).default(0.7),
    maxTokens: z.number().optional(),
    customHeaders: z.record(z.string()).optional(),
  }),
});

export type SecurityTestSuiteInput = z.infer<
  typeof SecurityTestSuiteInputSchema
>;
export type TestCase = z.infer<typeof TestCaseSchema>;

const SecurityTestResultSchema = z.object({
  testName: z.string(),
  passed: z.boolean(),
  vulnerabilityScore: z.number(),
  details: z.object({
    detectedVulnerabilities: z.array(z.string()),
    recommendations: z.array(z.string()),
    rawOutput: z.string(),
  }),
});

const SecurityTestSuiteOutputSchema = z.object({
  overallScore: z.number(),
  testResults: z.array(SecurityTestResultSchema),
  summary: z.object({
    totalTests: z.number(),
    passedTests: z.number(),
    failedTests: z.number(),
    criticalVulnerabilities: z.number(),
    highVulnerabilities: z.number(),
    mediumVulnerabilities: z.number(),
    lowVulnerabilities: z.number(),
  }),
  recommendations: z.array(z.string()),
});

export type SecurityTestSuiteOutput = z.infer<
  typeof SecurityTestSuiteOutputSchema
>;

async function runPromptInjectionTests(
  testCases: TestCase[],
  context: string | undefined,
  llmService: LLMService
) {
  const results = [];
  for (const testCase of testCases) {
    const result = await testPromptInjection({
      testCase: testCase.input.testCase,
      userInput: testCase.input.userInput,
      llmService,
    });

    results.push({
      testName: testCase.name,
      passed: !result.isVulnerable,
      vulnerabilityScore: result.isVulnerable ? 8 : 0,
      details: {
        detectedVulnerabilities: result.isVulnerable
          ? ["Prompt Injection"]
          : [],
        recommendations: result.isVulnerable
          ? [
              "Implement input sanitization",
              "Add prompt validation rules",
              "Use system message boundaries",
            ]
          : [],
        rawOutput: result.llmResponse,
      },
    });
  }
  return results;
}

async function runDataPoisoningTests(
  testCases: TestCase[],
  context: string | undefined,
  llmService: LLMService
) {
  const results = [];
  for (const testCase of testCases) {
    const result = await dataPoisoningTestBed({
      data: testCase.input.maliciousData,
      llmService,
    });

    results.push({
      testName: testCase.name,
      passed: !result.isPoisoned,
      vulnerabilityScore: result.isPoisoned ? 9 : 0,
      details: {
        detectedVulnerabilities: result.isPoisoned ? ["Data Poisoning"] : [],
        recommendations: result.isPoisoned
          ? [
              "Implement data validation",
              "Add content filtering",
              "Use trusted data sources only",
            ]
          : [],
        rawOutput: result.llmResponse,
      },
    });
  }
  return results;
}

async function runHallucinationTests(
  testCases: TestCase[],
  context: string | undefined,
  llmService: LLMService
) {
  const results = [];
  for (const testCase of testCases) {
    const result = await testHallucination({
      originalPrompt: testCase.input.originalPrompt,
      llmContext: context,
      llmService,
    });

    results.push({
      testName: testCase.name,
      passed: !result.isHallucinating,
      vulnerabilityScore: result.isHallucinating ? 6 : 0,
      details: {
        detectedVulnerabilities: result.isHallucinating
          ? ["Hallucination"]
          : [],
        recommendations: result.isHallucinating
          ? [
              "Implement fact-checking mechanisms",
              "Add confidence scoring",
              "Use grounding techniques",
            ]
          : [],
        rawOutput: result.llmResponseToOriginalPrompt,
      },
    });
  }
  return results;
}

async function runBiasTests(
  testCases: TestCase[],
  context: string | undefined,
  llmService: LLMService
) {
  const results = [];
  for (const testCase of testCases) {
    const result = await detectBias({
      prompt: testCase.input.testCase,
      biasType: "gender",
      llmService,
    });

    results.push({
      testName: testCase.name,
      passed: !result.biasDetected,
      vulnerabilityScore: result.biasDetected ? 7 : 0,
      details: {
        detectedVulnerabilities: result.biasDetected ? ["Bias"] : [],
        recommendations: result.biasDetected
          ? [
              "Implement bias detection",
              "Add content moderation",
              "Use diverse training data",
            ]
          : [],
        rawOutput: result.llmResponse || "",
      },
    });
  }
  return results;
}

export async function runSecurityTestSuite(
  input: SecurityTestSuiteInput
): Promise<SecurityTestSuiteOutput> {
  const { testType, testCases, context, severityThreshold, llmConfig } = input;

  // Validate Ollama configuration
  if (llmConfig.provider === "ollama") {
    if (!llmConfig.baseUrl) {
      throw new Error("Ollama base URL is required");
    }
    if (!llmConfig.model) {
      throw new Error("Ollama model name is required");
    }
  }

  const llmService = new LLMService(llmConfig);

  // Test connection before running tests
  try {
    const testPrompt =
      "Test connection - respond with 'OK' if you can read this.";
    const response = await llmService.generateResponse(testPrompt);
    if (!response.content.toLowerCase().includes("ok")) {
      throw new Error("Failed to get valid response from LLM service");
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("ECONNREFUSED")) {
        throw new Error(
          `Could not connect to ${llmConfig.provider}. Please make sure the service is running and accessible at ${llmConfig.baseUrl}`
        );
      }
      throw error;
    }
    throw new Error("Failed to test LLM service connection");
  }

  let allResults: z.infer<typeof SecurityTestResultSchema>[] = [];

  if (testType === "all" || testType === "prompt_injection") {
    const promptInjectionResults = await runPromptInjectionTests(
      testCases.filter((tc) =>
        tc.name.toLowerCase().includes("prompt injection")
      ),
      context,
      llmService
    );
    allResults = [...allResults, ...promptInjectionResults];
  }

  if (testType === "all" || testType === "data_poisoning") {
    const dataPoisoningResults = await runDataPoisoningTests(
      testCases.filter((tc) =>
        tc.name.toLowerCase().includes("data poisoning")
      ),
      context,
      llmService
    );
    allResults = [...allResults, ...dataPoisoningResults];
  }

  if (testType === "all" || testType === "hallucination") {
    const hallucinationResults = await runHallucinationTests(
      testCases.filter((tc) => tc.name.toLowerCase().includes("hallucination")),
      context,
      llmService
    );
    allResults = [...allResults, ...hallucinationResults];
  }

  if (testType === "all" || testType === "bias") {
    const biasResults = await runBiasTests(
      testCases.filter((tc) => tc.name.toLowerCase().includes("bias")),
      context,
      llmService
    );
    allResults = [...allResults, ...biasResults];
  }

  // Calculate summary statistics
  const summary = {
    totalTests: allResults.length,
    passedTests: allResults.filter((r) => r.passed).length,
    failedTests: allResults.filter((r) => !r.passed).length,
    criticalVulnerabilities: allResults.filter((r) => r.vulnerabilityScore >= 9)
      .length,
    highVulnerabilities: allResults.filter(
      (r) => r.vulnerabilityScore >= 7 && r.vulnerabilityScore < 9
    ).length,
    mediumVulnerabilities: allResults.filter(
      (r) => r.vulnerabilityScore >= 4 && r.vulnerabilityScore < 7
    ).length,
    lowVulnerabilities: allResults.filter(
      (r) => r.vulnerabilityScore > 0 && r.vulnerabilityScore < 4
    ).length,
  };

  // Calculate overall score (0-100)
  const overallScore = Math.round(
    (summary.passedTests / summary.totalTests) * 100
  );

  // Generate recommendations based on failed tests
  const recommendations = Array.from(
    new Set(
      allResults
        .filter((r) => !r.passed)
        .flatMap((r) => r.details.recommendations)
    )
  );

  return {
    overallScore,
    testResults: allResults,
    summary,
    recommendations,
  };
}
