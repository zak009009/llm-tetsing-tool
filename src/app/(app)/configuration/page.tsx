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
import { useAppConfig, type LLMProvider } from "@/hooks/use-app-config";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  provider: z.string(),
  apiKey: z.string().optional(),
  model: z.string().optional(),
  endpoint: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

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

  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [detailedLogging, setDetailedLogging] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      provider: "openai",
      apiKey: "",
      model: "",
      endpoint: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <PageHeader
        title="Configuration"
        description="Personnalisez les connexions LLM et les paramètres de l'application."
      />

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
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="provider">Fournisseur</Label>
                    <Select
                      value={form.watch("provider")}
                      onValueChange={(value) =>
                        form.setValue("provider", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un fournisseur" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="anthropic">Anthropic</SelectItem>
                        <SelectItem value="ollama">Ollama</SelectItem>
                        <SelectItem value="custom">Personnalisé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apiKey">Clé API</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder="Entrez votre clé API"
                      {...form.register("apiKey")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">Modèle</Label>
                    <Input
                      id="model"
                      placeholder="Entrez le nom du modèle"
                      {...form.register("model")}
                    />
                  </div>

                  {form.watch("provider") === "ollama" && (
                    <div className="space-y-2">
                      <Label htmlFor="endpoint">
                        Point de terminaison Ollama
                      </Label>
                      <Input
                        id="endpoint"
                        placeholder="http://localhost:11434"
                        {...form.register("endpoint")}
                      />
                    </div>
                  )}

                  {form.watch("provider") === "custom" && (
                    <div className="space-y-2">
                      <Label htmlFor="endpoint">
                        Point de terminaison personnalisé
                      </Label>
                      <Input
                        id="endpoint"
                        placeholder="Entrez l'URL du point de terminaison"
                        {...form.register("endpoint")}
                      />
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Enregistrer la Configuration
                </Button>
              </form>
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
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Activer les notifications pour les tests
                    </p>
                  </div>
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Journalisation Détaillée</Label>
                    <p className="text-sm text-muted-foreground">
                      Enregistrer les détails des tests dans les journaux
                    </p>
                  </div>
                  <Switch
                    checked={detailedLogging}
                    onCheckedChange={setDetailedLogging}
                  />
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
