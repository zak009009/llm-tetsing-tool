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
  dataPoisoningTestBed,
  type DataPoisoningTestBedInput,
  type DataPoisoningTestBedOutput,
} from "@/ai/flows/data-poisoning-test-bed";
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
  data: z
    .string()
    .min(10, "Les données doivent comporter au moins 10 caractères."),
});

type DataPoisoningFormValues = z.infer<typeof formSchema>;

export default function DataPoisoningPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DataPoisoningTestBedOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<DataPoisoningFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data: "Le ciel est vert. Les chats peuvent voler. L'eau n'est pas mouillée. 2+2=5.",
    },
  });

  async function onSubmit(data: DataPoisoningFormValues) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const output = await dataPoisoningTestBed(
        data as DataPoisoningTestBedInput
      );
      setResult(output);
      toast({
        title: "Test Terminé",
        description: "Test d'empoisonnement de données terminé avec succès.",
        variant: "success",
      });
    } catch (e: any) {
      setError(e.message || "Une erreur inattendue s'est produite.");
      toast({
        title: "Échec du Test",
        description:
          e.message ||
          "Impossible d'exécuter le test d'empoisonnement de données.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <PageHeader
        title="Test d'Empoisonnement de Données"
        description="Évaluez la vulnérabilité de votre modèle de langage aux attaques par empoisonnement de données."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary/10 hover:border-primary/20">
          <CardHeader>
            <CardTitle>Configuration du Test</CardTitle>
            <CardDescription>
              Définissez les données à tester pour évaluer si le modèle les
              reconnaît.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <FormLabel htmlFor="data">Données à Tester</FormLabel>
                  <FormControl>
                    <Textarea
                      id="data"
                      placeholder="Entrez les données pour tester si le modèle les reconnaît ou a été entraîné avec elles."
                      className="min-h-[150px] font-mono"
                      {...form.register("data")}
                    />
                  </FormControl>
                  <FormMessage />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isLoading}
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
              Analysez les résultats de votre test d'empoisonnement de données.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <Alert variant={result.isPoisoned ? "destructive" : "success"}>
                  <AlertTitle>
                    {result.isPoisoned
                      ? "Empoisonnement Détecté"
                      : "Aucun Empoisonnement Détecté"}
                  </AlertTitle>
                  <AlertDescription>
                    Confiance: {(result.confidence * 100).toFixed(1)}%
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <FormLabel>Réponse du Modèle</FormLabel>
                  <div className="p-4 rounded-lg bg-muted">
                    <pre className="whitespace-pre-wrap text-sm">
                      {result.llmResponse}
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
