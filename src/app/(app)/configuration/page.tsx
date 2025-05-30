"use client";

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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAppConfig } from "@/hooks/use-app-config";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  provider: z.enum(["ollama", "openai", "anthropic", "custom"]),
  apiKey: z.string().optional(),
  model: z.string().min(1, "Model name is required"),
  endpoint: z.string().url().optional(),
  temperature: z.number().min(0).max(2),
  maxTokens: z.number().min(1).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ConfigurationPage() {
  const {
    llmProvider,
    baseUrl,
    apiKey,
    modelName,
    temperature,
    maxTokens,
    isConnected,
    connectionError,
    setLLMProvider,
    setBaseUrl,
    setApiKey,
    setModelName,
    setTemperature,
    setMaxTokens,
    testConnection,
  } = useAppConfig();

  const [isTesting, setIsTesting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      provider: llmProvider,
      apiKey: apiKey,
      model: modelName,
      endpoint: baseUrl,
      temperature: temperature,
      maxTokens: maxTokens,
    },
  });

  useEffect(() => {
    form.reset({
      provider: llmProvider,
      apiKey: apiKey,
      model: modelName,
      endpoint: baseUrl,
      temperature: temperature,
      maxTokens: maxTokens,
    });
  }, [llmProvider, baseUrl, apiKey, modelName, temperature, maxTokens]);

  const onSubmit = async (data: FormValues) => {
    try {
      setLLMProvider(data.provider as LLMProvider);
      setModelName(data.model);
      setTemperature(data.temperature);
      if (data.maxTokens) setMaxTokens(data.maxTokens);
      setBaseUrl(data.endpoint || "");

      if (data.provider !== "ollama") {
        setApiKey(data.apiKey || "");
      }

      // Test connection after updating configuration
      setIsTesting(true);
      const isConnected = await testConnection();
      setIsTesting(false);

      if (isConnected) {
        toast({
          title: "Configuration Updated",
          description:
            "Your LLM settings have been saved and connection tested successfully.",
        });
      } else {
        toast({
          title: "Configuration Updated",
          description:
            "Settings saved but connection test failed. Please check your configuration.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setIsTesting(false);
      toast({
        title: "Error",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <PageHeader
        title="Configuration"
        description="Personnalisez les connexions LLM et les paramètres de l'application."
      />

      {connectionError && (
        <Alert variant="destructive">
          <AlertTitle>Erreur de Connexion</AlertTitle>
          <AlertDescription>{connectionError}</AlertDescription>
        </Alert>
      )}

      {isConnected && (
        <Alert>
          <AlertTitle>Connecté</AlertTitle>
          <AlertDescription>
            La connexion au modèle LLM est établie.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="llm" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="llm">Connexions LLM</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="llm">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary/10 hover:border-primary/20">
            <CardHeader>
              <CardTitle>Connexions LLM</CardTitle>
              <CardDescription>
                Configurez vos connexions aux différents fournisseurs de modèles
                de langage.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="provider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fournisseur</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un fournisseur" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ollama">Ollama</SelectItem>
                            <SelectItem value="openai">OpenAI</SelectItem>
                            <SelectItem value="anthropic">Anthropic</SelectItem>
                            <SelectItem value="custom">Personnalisé</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modèle</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Entrez le nom du modèle"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("provider") !== "ollama" && (
                    <FormField
                      control={form.control}
                      name="apiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Clé API</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Entrez votre clé API"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="endpoint"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {form.watch("provider") === "ollama"
                            ? "Point de terminaison Ollama"
                            : "Point de terminaison API"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={
                              form.watch("provider") === "ollama"
                                ? "http://127.0.0.1:11434"
                                : "Entrez l'URL du point de terminaison"
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="temperature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Température</FormLabel>
                        <FormControl>
                          <Slider
                            min={0}
                            max={2}
                            step={0.1}
                            value={[field.value]}
                            onValueChange={([value]) => field.onChange(value)}
                          />
                        </FormControl>
                        <FormDescription>
                          Contrôle la créativité des réponses (0 = déterministe,
                          2 = très créatif)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxTokens"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre maximum de tokens</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            placeholder="Entrez le nombre maximum de tokens"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Limite la longueur des réponses générées
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-primary/90"
                      disabled={isTesting}
                    >
                      {isTesting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Test de Connexion...
                        </>
                      ) : (
                        "Enregistrer et Tester"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary/10 hover:border-primary/20">
            <CardHeader>
              <CardTitle>Paramètres de l'Application</CardTitle>
              <CardDescription>
                Personnalisez le comportement de l'application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mode Sombre</Label>
                    <p className="text-sm text-muted-foreground">
                      Activer le thème sombre pour l'interface
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Activer les notifications pour les tests
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Journalisation Détaillée</Label>
                    <p className="text-sm text-muted-foreground">
                      Enregistrer les détails des tests dans les journaux
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90">
                Enregistrer les Paramètres
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
