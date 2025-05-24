import { config } from 'dotenv';
config();

// import '@/ai/flows/dos-attack-simulator.ts'; // Removed
import '@/ai/flows/data-poisoning-test-bed.ts';
import '@/ai/flows/prompt-injection-tester.ts';
import '@/ai/flows/hallucination-tester.ts'; // Added
import '@/ai/flows/bias-detector.ts'; // Added
