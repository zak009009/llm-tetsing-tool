"use client";

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
import {
  testHallucination,
  type HallucinationInput,
  type HallucinationOutput,
} from "@/ai/flows/hallucination-tester";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

const formSchema = z.object({
  originalPrompt: z
    .string()
    .min(10, "Original prompt must be at least 10 characters."),
  llmContext: z.string().optional(),
});

type HallucinationFormValues = z.infer<typeof formSchema>;

export default function HallucinationTesterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<HallucinationOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<HallucinationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      originalPrompt: "Explain the process of photosynthesis in simple terms.",
      llmContext:
        "Photosynthesis is a process used by plants, algae, and some bacteria to convert light energy into chemical energy.",
    },
  });

  async function onSubmit(data: HallucinationFormValues) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const output = await testHallucination(data as HallucinationInput);
      setResult(output);
      toast({
        title: "Test Terminé",
        description: "Test d'hallucination terminé avec succès.",
        variant: "success",
      });
    } catch (e: any) {
      setError(e.message || "Une erreur inattendue s'est produite.");
      toast({
        title: "Échec du Test",
        description:
          e.message || "Impossible d'exécuter le test d'hallucination.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <PageHeader
        title="Testeur d'Hallucination"
        description="Évaluez la tendance de votre modèle de langage à générer des informations fabriquées."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary/10 hover:border-primary/20">
          <CardHeader>
            <CardTitle>Configuration du Test</CardTitle>
            <CardDescription>
              Définissez le cas de test et l'entrée utilisateur pour évaluer les
              hallucinations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="originalPrompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prompt Original</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Entrez le prompt pour que le modèle y réponde."
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
                      <FormLabel>Contexte (Optionnel)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Fournissez un contexte que le modèle devrait utiliser pour répondre au prompt."
                          className="min-h-[100px] font-mono"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isLoading ? "Test en cours..." : "Lancer le Test"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary/10 hover:border-primary/20">
          <CardHeader>
            <CardTitle>Résultats du Test</CardTitle>
            <CardDescription>
              Analysez les résultats de votre test d'hallucination.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <Alert
                  variant={result.isHallucinating ? "destructive" : "success"}
                >
                  <AlertTitle>
                    {result.isHallucinating
                      ? "Hallucination Détectée"
                      : "Aucune Hallucination Détectée"}
                  </AlertTitle>
                  <AlertDescription>
                    Confiance: {(result.confidence * 100).toFixed(1)}%
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <FormLabel>Réponse du Modèle</FormLabel>
                  <div className="p-4 rounded-lg bg-muted">
                    <pre className="whitespace-pre-wrap text-sm">
                      {result.llmResponseToOriginalPrompt}
                    </pre>
                  </div>
                </div>

                <div className="space-y-2">
                  <FormLabel>Analyse</FormLabel>
                  <div className="p-4 rounded-lg bg-muted">
                    <pre className="whitespace-pre-wrap text-sm">
                      {result.explanation}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Aucun résultat à afficher. Lancez un test pour voir les
                résultats.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
