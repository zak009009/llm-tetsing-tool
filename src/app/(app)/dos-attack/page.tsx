'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/page-header";
import { ResultCard, ResultItem } from "@/components/result-card";
import { dosAttackSimulator, type DosAttackSimulatorInput, type DosAttackSimulatorOutput } from "@/ai/flows/dos-attack-simulator";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  attackType: z.enum(['SYN_FLOOD', 'HTTP_FLOOD']),
  targetUrl: z.string().url("Please enter a valid URL for the target."),
  requestRate: z.coerce.number().int().positive("Request rate must be a positive integer."),
  duration: z.coerce.number().int().positive("Duration must be a positive integer (seconds)."),
});

type DosAttackFormValues = z.infer<typeof formSchema>;

export default function DosAttackPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DosAttackSimulatorOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<DosAttackFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      attackType: "HTTP_FLOOD",
      targetUrl: "https://example.com/api/llm", // Placeholder
      requestRate: 100,
      duration: 60,
    },
  });

  async function onSubmit(data: DosAttackFormValues) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      // The AI flow 'simulates' and returns a report, it doesn't perform the actual attack.
      const output = await dosAttackSimulator(data);
      setResult(output);
      toast({
        title: "Simulation Complete",
        description: "DoS attack simulation analysis finished.",
      });
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
      toast({
        title: "Simulation Failed",
        description: e.message || "Could not run DoS attack simulation.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-2">
      <PageHeader
        title="DoS Attack Simulator"
        description="Simulate denial-of-service attacks against an LLM endpoint to evaluate its rate limiting and resource management capabilities. The AI will generate a report based on the simulated parameters."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Simulation Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="attackType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attack Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select attack type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SYN_FLOOD">SYN Flood</SelectItem>
                        <SelectItem value="HTTP_FLOOD">HTTP Flood</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/api/llm" {...field} />
                    </FormControl>
                    <FormDescription>The URL of the LLM endpoint to simulate attacking.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="requestRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Request Rate (requests/second)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (seconds)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="60" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLoading ? "Simulating..." : "Run Simulation"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isLoading || error || result) && (
        <ResultCard title="Simulation Report" isLoading={isLoading} error={error}>
          {result && (
            <>
              <ResultItem label="Success Rate" value={`${result.successRate.toFixed(2)}%`} />
              <ResultItem label="Average Response Time" value={`${result.averageResponseTime.toFixed(2)} ms`} />
              <ResultItem label="Error Rate" value={`${result.errorRate.toFixed(2)}%`} />
              <ResultItem label="Attack Summary" value={<pre className="whitespace-pre-wrap p-2 bg-muted rounded-md">{result.attackSummary}</pre>} />
            </>
          )}
        </ResultCard>
      )}
    </div>
  );
}
