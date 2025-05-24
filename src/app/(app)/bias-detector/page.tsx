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
import { detectBias, type BiasDetectorInput, type BiasDetectorOutput, type BiasItem } from "@/ai/flows/bias-detector";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  textToAnalyze: z.string().min(20, "Text to analyze must be at least 20 characters."),
});

type BiasDetectorFormValues = z.infer<typeof formSchema>;

const BiasSeverityBadge: React.FC<{ severity: BiasItem['severity'] }> = ({ severity }) => {
  let variant: "default" | "secondary" | "destructive" = "default";
  if (severity === "Medium") variant = "secondary";
  if (severity === "High") variant = "destructive";
  return <Badge variant={variant}>{severity}</Badge>;
};


export default function BiasDetectorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BiasDetectorOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<BiasDetectorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      textToAnalyze: "The new CEO, a young woman, surprisingly led the company to record profits. Meanwhile, the older board members were skeptical of her modern approach.",
    },
  });

  async function onSubmit(data: BiasDetectorFormValues) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const output = await detectBias(data);
      setResult(output);
      toast({
        title: "Analysis Complete",
        description: "Bias detection analysis finished successfully.",
      });
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
      toast({
        title: "Analysis Failed",
        description: e.message || "Could not run bias detection analysis.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-2">
      <PageHeader
        title="Bias Detector"
        description="Analyze text for potential biases related to gender, race, age, and other categories."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Text for Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="textToAnalyze"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text to Analyze</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the text you want to analyze for potential biases."
                        className="min-h-[150px] font-mono"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLoading ? "Analyzing..." : "Run Analysis"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isLoading || error || result) && (
        <ResultCard title="Analysis Report" isLoading={isLoading} error={error}>
          {result && (
            <>
              <ResultItem 
                label="Overall Assessment" 
                value={<pre className="whitespace-pre-wrap p-2 bg-muted rounded-md">{result.overallAssessment}</pre>} 
              />
              {result.detectedBiases && result.detectedBiases.length > 0 ? (
                <div className="mt-4">
                  <h3 className="font-semibold text-lg mb-2">Detected Biases:</h3>
                  {result.detectedBiases.map((bias, index) => (
                    <Card key={index} className="mb-4 p-4 bg-secondary/50">
                      <ResultItem label="Bias Category" value={<Badge variant="outline">{bias.biasCategory}</Badge>} />
                      <ResultItem label="Biased Statement" value={<pre className="whitespace-pre-wrap p-2 bg-muted rounded-md font-mono text-sm">{bias.biasedStatement}</pre>} />
                      <ResultItem label="Reasoning" value={<p className="text-sm">{bias.reasoning}</p>} />
                      <ResultItem label="Severity" value={<BiasSeverityBadge severity={bias.severity} />} />
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mt-4">No specific biases detected based on the analysis.</p>
              )}
            </>
          )}
        </ResultCard>
      )}
    </div>
  );
}
