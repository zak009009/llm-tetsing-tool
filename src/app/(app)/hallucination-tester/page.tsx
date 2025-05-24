'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/page-header";
import { ResultCard, ResultItem } from "@/components/result-card";
import { testHallucination, type HallucinationTesterInput, type HallucinationTesterOutput } from "@/ai/flows/hallucination-tester";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  originalPrompt: z.string().min(10, "Original prompt must be at least 10 characters."),
  llmContext: z.string().optional(),
});

type HallucinationFormValues = z.infer<typeof formSchema>;

export default function HallucinationTesterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<HallucinationTesterOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<HallucinationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      originalPrompt: "Explain the process of photosynthesis in simple terms.",
      llmContext: "Photosynthesis is a process used by plants, algae, and some bacteria to convert light energy into chemical energy.",
    },
  });

  async function onSubmit(data: HallucinationFormValues) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const output = await testHallucination(data);
      setResult(output);
      toast({
        title: "Test Complete",
        description: "Hallucination test finished successfully.",
      });
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
      toast({
        title: "Test Failed",
        description: e.message || "Could not run hallucination test.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-2">
      <PageHeader
        title="Hallucination Tester"
        description="Test if an LLM's response contains fabricated or unverified information (hallucinations)."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Test Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="originalPrompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the prompt for the LLM to respond to."
                        className="min-h-[100px] font-mono"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="llmContext"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LLM Context (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide any context the LLM should use when responding to the prompt."
                        className="min-h-[100px] font-mono"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLoading ? "Testing..." : "Run Test"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isLoading || error || result) && (
        <ResultCard title="Test Results" isLoading={isLoading} error={error}>
          {result && (
            <>
              <ResultItem
                label="Hallucination Detected"
                value={
                  <Badge variant={result.isHallucinating ? "destructive" : "default"}>
                    {result.isHallucinating ? "Yes" : "No"}
                  </Badge>
                }
              />
              <ResultItem label="LLM Response to Original Prompt" value={<pre className="whitespace-pre-wrap p-2 bg-muted rounded-md">{result.llmResponseToOriginalPrompt}</pre>} />
              <ResultItem label="Analysis" value={<pre className="whitespace-pre-wrap p-2 bg-muted rounded-md">{result.analysis}</pre>} />
            </>
          )}
        </ResultCard>
      )}
    </div>
  );
}
