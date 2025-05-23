'use server';

/**
 * @fileOverview Simulates denial-of-service attacks against the LLM.
 *
 * - dosAttackSimulator - A function that simulates DoS attacks and evaluates LLM's rate limiting and resource management.
 * - DosAttackSimulatorInput - The input type for the dosAttackSimulator function.
 * - DosAttackSimulatorOutput - The return type for the dosAttackSimulator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DosAttackSimulatorInputSchema = z.object({
  attackType: z.enum(['SYN_FLOOD', 'HTTP_FLOOD']).describe('The type of DoS attack to simulate.'),
  targetUrl: z.string().url().describe('The URL of the LLM endpoint to attack.'),
  requestRate: z.number().int().positive().default(10).describe('The number of requests per second to send.'),
  duration: z.number().int().positive().default(60).describe('The duration of the attack in seconds.'),
});
export type DosAttackSimulatorInput = z.infer<typeof DosAttackSimulatorInputSchema>;

const DosAttackSimulatorOutputSchema = z.object({
  successRate: z.number().describe('The percentage of successful requests during the attack.'),
  averageResponseTime: z.number().describe('The average response time in milliseconds.'),
  errorRate: z.number().describe('The percentage of requests that resulted in an error.'),
  attackSummary: z.string().describe('A summary of the attack and its impact on the LLM.'),
});
export type DosAttackSimulatorOutput = z.infer<typeof DosAttackSimulatorOutputSchema>;

export async function dosAttackSimulator(input: DosAttackSimulatorInput): Promise<DosAttackSimulatorOutput> {
  return dosAttackSimulatorFlow(input);
}

const dosAttackSimulatorPrompt = ai.definePrompt({
  name: 'dosAttackSimulatorPrompt',
  input: {schema: DosAttackSimulatorInputSchema},
  output: {schema: DosAttackSimulatorOutputSchema},
  prompt: `You are a DevOps engineer tasked with simulating a denial-of-service attack against an LLM endpoint.

  Attack Type: {{{attackType}}}
  Target URL: {{{targetUrl}}}
  Request Rate: {{{requestRate}}} requests per second
  Duration: {{{duration}}} seconds

  Analyze the results of the simulated attack and provide a summary of the attack, including the success rate, average response time, and error rate. Also, describe the attack's impact on the LLM's performance and identify any potential vulnerabilities.

  The success rate should be the percentage of requests that received a valid response (HTTP status code 200).
  The average response time should be the average time it took for the LLM to respond to a request in milliseconds.
  The error rate should be the percentage of requests that resulted in an error (HTTP status code 500 or other errors).
  The attack summary should be a brief explanation of what happened during the attack and any identified vulnerabilities.
  `,
});

const dosAttackSimulatorFlow = ai.defineFlow(
  {
    name: 'dosAttackSimulatorFlow',
    inputSchema: DosAttackSimulatorInputSchema,
    outputSchema: DosAttackSimulatorOutputSchema,
  },
  async input => {
    const {output} = await dosAttackSimulatorPrompt(input);
    return output!;
  }
);
