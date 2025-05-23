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
import { toast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppConfig, type LLMProvider } from "@/hooks/use-app-config";
import { useEffect } from "react";

const formSchema = z.object({
  llmProvider: z.custom<LLMProvider>(),
  ollamaBaseUrl: z.string().url().optional().or(z.literal('')),
  apiEndpoint: z.string().url().optional().or(z.literal('')),
  apiKey: z.string().optional(),
  modelName: z.string().min(1, "Model name is required."),
});

type ConfigurationFormValues = z.infer<typeof formSchema>;

export default function ConfigurationPage() {
  const {
    llmProvider,
    ollamaBaseUrl,
    apiEndpoint,
    apiKey,
    modelName,
    setLLMProvider,
    setOllamaBaseUrl,
    setApiEndpoint,
    setApiKey,
    setModelName,
  } = useAppConfig();

  const form = useForm<ConfigurationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      llmProvider,
      ollamaBaseUrl,
      apiEndpoint,
      apiKey,
      modelName,
    },
  });

  const watchedProvider = form.watch("llmProvider");

  useEffect(() => {
    form.reset({
      llmProvider,
      ollamaBaseUrl,
      apiEndpoint,
      apiKey,
      modelName,
    });
  }, [llmProvider, ollamaBaseUrl, apiEndpoint, apiKey, modelName, form]);


  function onSubmit(data: ConfigurationFormValues) {
    setLLMProvider(data.llmProvider);
    if (data.ollamaBaseUrl) setOllamaBaseUrl(data.ollamaBaseUrl);
    if (data.apiEndpoint) setApiEndpoint(data.apiEndpoint);
    if (data.apiKey) setApiKey(data.apiKey);
    setModelName(data.modelName);

    toast({
      title: "Configuration Saved",
      description: "Your LLM settings have been updated.",
    });
  }

  return (
    <div className="container mx-auto py-2">
      <PageHeader
        title="Configuration"
        description="Manage settings for LLM connections and application parameters."
      />
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>LLM Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="llmProvider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LLM Provider</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an LLM provider" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="genkit_default">Genkit Default (Gemini)</SelectItem>
                        <SelectItem value="ollama">Local Ollama</SelectItem>
                        <SelectItem value="external_api">External API</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose your LLM provider. 'Genkit Default' uses the model configured in your Genkit setup.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchedProvider === "ollama" && (
                <FormField
                  control={form.control}
                  name="ollamaBaseUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ollama Base URL</FormLabel>
                      <FormControl>
                        <Input placeholder="http://localhost:11434" {...field} />
                      </FormControl>
                      <FormDescription>
                        The base URL for your local Ollama instance.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {watchedProvider === "external_api" && (
                <>
                  <FormField
                    control={form.control}
                    name="apiEndpoint"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Endpoint</FormLabel>
                        <FormControl>
                          <Input placeholder="https://api.example.com/v1/chat/completions" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Key</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Your API Key" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              
              <FormField
                control={form.control}
                name="modelName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model Name</FormLabel>
                    <FormControl>
                      <Input placeholder={llmProvider === 'genkit_default' ? "Uses Genkit configuration" : "e.g., llama3, gpt-4"} {...field} 
                       disabled={llmProvider === 'genkit_default'} />
                    </FormControl>
                    <FormDescription>
                      Specify the model name to use. For 'Genkit Default', this is illustrative as the actual model is set in `genkit.ts`.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">Save Configuration</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
