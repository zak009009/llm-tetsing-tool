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
  detectBias,
  type BiasDetectorInput,
  type BiasDetectorOutput,
  type BiasItem,
} from "@/ai/flows/bias-detector";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

const formSchema = z.object({
  textToAnalyze: z
    .string()
    .min(20, "Text to analyze must be at least 20 characters."),
});

type BiasDetectorFormValues = z.infer<typeof formSchema>;

const BiasSeverityBadge: React.FC<{ severity: BiasItem["severity"] }> = ({
  severity,
}) => {
  let variant: "default" | "secondary" | "destructive" = "default";
  if (severity === "Medium") variant = "secondary";
  if (severity === "High") variant = "destructive";
  return <Badge variant={variant}>{severity}</Badge>;
};

export default function BiasDetectorPage() {
  const [testCase, setTestCase] = useState("");
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState<BiasDetectorOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await detectBias({
        testCase,
        userInput,
      } as BiasDetectorInput);
      setResult(response);
      toast({
        title: "Analysis Complete",
        description: "Bias detection analysis finished successfully.",
      });
    } catch (error) {
      console.error("Error testing bias:", error);
      toast({
        title: "Analysis Failed",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <PageHeader
        title="Détecteur de Biais"
        description="Évaluez la présence de biais dans les réponses de votre modèle de langage."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary/10 hover:border-primary/20">
          <CardHeader>
            <CardTitle>Configuration du Test</CardTitle>
            <CardDescription>
              Définissez le cas de test et l'entrée utilisateur pour évaluer les
              biais.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="testCase">Cas de Test</Label>
                <Textarea
                  id="testCase"
                  placeholder="Entrez le cas de test à évaluer..."
                  value={testCase}
                  onChange={(e) => setTestCase(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userInput">Entrée Utilisateur</Label>
                <Textarea
                  id="userInput"
                  placeholder="Entrez l'entrée utilisateur à tester..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? "Test en cours..." : "Lancer le Test"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary/10 hover:border-primary/20">
          <CardHeader>
            <CardTitle>Résultats du Test</CardTitle>
            <CardDescription>
              Analysez les résultats de votre test de détection de biais.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <Alert variant={result.hasBias ? "destructive" : "default"}>
                  {result.hasBias ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  <AlertTitle>
                    {result.hasBias ? "Biais Détecté" : "Aucun Biais Détecté"}
                  </AlertTitle>
                  <AlertDescription>{result.explanation}</AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label>Réponse du Modèle</Label>
                  <div className="p-4 rounded-lg bg-muted">
                    <pre className="whitespace-pre-wrap text-sm">
                      {result.result}
                    </pre>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Niveau de Confiance</Label>
                  <div className="p-4 rounded-lg bg-muted">
                    <div className="text-sm">{result.confidence}%</div>
                  </div>
                </div>

                {result.detectedBiases && result.detectedBiases.length > 0 && (
                  <div className="space-y-2">
                    <Label>Types de Biais Détectés</Label>
                    <div className="p-4 rounded-lg bg-muted">
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {result.detectedBiases.map((bias, index) => (
                          <li key={index}>{bias.biasCategory}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
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
