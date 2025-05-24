'use server';
/**
 * @fileOverview A Genkit flow to detect biases in text.
 *
 * - detectBias - A function that analyzes text for potential biases.
 * - BiasDetectorInput - The input type for the detectBias function.
 * - BiasDetectorOutput - The return type for the detectBias function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BiasDetectorInputSchema = z.object({
  textToAnalyze: z.string().describe("The text to be analyzed for biases."),
});
export type BiasDetectorInput = z.infer<typeof BiasDetectorInputSchema>;

const BiasItemSchema = z.object({
  biasCategory: z.string().describe("The category of bias detected (e.g., Gender, Racial, Political, Ageism, Cultural)."),
  biasedStatement: z.string().describe("The specific statement or phrase identified as potentially biased."),
  reasoning: z.string().describe("Explanation why this statement is considered biased."),
  severity: z.enum(["Low", "Medium", "High"]).describe("The assessed severity of the detected bias."),
});
export type BiasItem = z.infer<typeof BiasItemSchema>;

const BiasDetectorOutputSchema = z.object({
  detectedBiases: z.array(BiasItemSchema).describe("An array of detected biases, if any. Each item includes the bias category, the biased statement, reasoning, and severity."),
  overallAssessment: z.string().describe("A summary conclusion about biases in the text. If no biases are detected, this should state so clearly."),
});
export type BiasDetectorOutput = z.infer<typeof BiasDetectorOutputSchema>;

export async function detectBias(input: BiasDetectorInput): Promise<BiasDetectorOutput> {
  return biasDetectorFlow(input);
}

const biasDetectionPrompt = ai.definePrompt({
  name: 'biasDetectionPrompt',
  input: {schema: BiasDetectorInputSchema},
  output: {schema: BiasDetectorOutputSchema},
  prompt: `You are an AI ethics and safety expert. Your task is to meticulously analyze the following "Text to Analyze" for any potential biases. 
Consider a wide range of biases, including but not limited to: gender, racial, ethnic, national origin, political affiliation, religious, ageism, disability, socio-economic status, sexual orientation, confirmation bias, stereotypical bias, and cultural bias.

Text to Analyze:
\`\`\`
{{{textToAnalyze}}}
\`\`\`

For each distinct instance of potential bias you identify, you must provide:
1.  biasCategory: The specific category of the bias (e.g., "Gender Bias", "Racial Stereotype", "Political Polarization", "Ageism").
2.  biasedStatement: The exact quote or phrase from the text that exhibits the bias.
3.  reasoning: A clear explanation of why this statement is considered biased, referencing the context if necessary.
4.  severity: An assessment of the bias's potential harm or impact, categorized as "Low", "Medium", or "High".

If no biases are detected in the text, the "detectedBiases" array should be empty, and the "overallAssessment" should explicitly state that no significant biases were found.

Finally, provide an "overallAssessment" that summarizes your findings. This should be a concise conclusion about the presence and nature of biases in the text.

Output your findings strictly in the specified JSON format.
`,
});

const biasDetectorFlow = ai.defineFlow(
  {
    name: 'biasDetectorFlow',
    inputSchema: BiasDetectorInputSchema,
    outputSchema: BiasDetectorOutputSchema,
  },
  async (input) => {
    const {output} = await biasDetectionPrompt(input);
    return output!;
  }
);
