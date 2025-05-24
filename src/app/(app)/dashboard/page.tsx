import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  AlertTriangle,
  FlaskConical,
  Settings,
  ShieldCheck,
  FileQuestion,
  Scale,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <PageHeader
        title="Bienvenue au Laboratoire d'Exploitation LLM"
        description="Votre boîte à outils complète pour tester et évaluer les vulnérabilités des modèles de langage."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary/10 hover:border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">
              Testeur d'Injection de Prompt
            </CardTitle>
            <AlertTriangle className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Testez diverses attaques d'injection de prompt contre les LLM.
            </p>
            <Button asChild className="w-full bg-primary hover:bg-primary/90">
              <Link href="/prompt-injection">Accéder au Testeur</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary/10 hover:border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">
              Test d'Empoisonnement de Données
            </CardTitle>
            <FlaskConical className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Évaluez la vulnérabilité des LLM aux entrées de données
              malveillantes.
            </p>
            <Button asChild className="w-full bg-primary hover:bg-primary/90">
              <Link href="/data-poisoning">Accéder au Test</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary/10 hover:border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">
              Testeur d'Hallucination
            </CardTitle>
            <FileQuestion className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Évaluez la tendance des LLM à générer des informations fabriquées.
            </p>
            <Button asChild className="w-full bg-primary hover:bg-primary/90">
              <Link href="/hallucination-tester">Accéder au Testeur</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary/10 hover:border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">
              Détecteur de Biais
            </CardTitle>
            <Scale className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Identifiez les biais potentiels dans les réponses des LLM.
            </p>
            <Button asChild className="w-full bg-primary hover:bg-primary/90">
              <Link href="/bias-detector">Accéder au Détecteur</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary/10 hover:border-primary/20 lg:col-start-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">
              Configuration
            </CardTitle>
            <Settings className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Personnalisez les connexions LLM et les paramètres de
              l'application.
            </p>
            <Button asChild className="w-full bg-primary hover:bg-primary/90">
              <Link href="/configuration">Configurer</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-accent" />
            About LLM Security
          </CardTitle>
          <CardDescription>
            Understanding and mitigating risks associated with Large Language
            Models is crucial. This lab provides tools to explore common
            vulnerabilities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The OWASP Top 10 for Large Language Model Applications project
            highlights critical vulnerabilities. This lab helps you simulate and
            understand some of these, including:
          </p>
          <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground space-y-1">
            <li>
              <strong>Prompt Injection:</strong> Tricking LLMs into executing
              unintended actions.
            </li>
            <li>
              <strong>Data Poisoning:</strong> Manipulating training data to
              compromise LLM behavior.
            </li>
            <li>
              <strong>Model Hallucinations:</strong> Instances where the LLM
              generates incorrect or nonsensical information with high
              confidence.
            </li>
            <li>
              <strong>Bias Detection:</strong> Identifying and mitigating
              harmful biases in LLM outputs.
            </li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Use these tools responsibly and ethically for learning and improving
            LLM security.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
