import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertTriangle, FlaskConical, Zap, Settings, ShieldCheck } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-2">
      <PageHeader
        title="Welcome to LLM Exploit Lab"
        description="Your comprehensive toolkit for testing and evaluating Large Language Model vulnerabilities."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Prompt Injection Tester
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-4">
              Test various prompt injection attacks against LLMs.
            </p>
            <Button asChild size="sm">
              <Link href="/prompt-injection">Go to Tester</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Data Poisoning Test Bed
            </CardTitle>
            <FlaskConical className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-4">
              Assess LLM vulnerability to malicious data inputs.
            </p>
            <Button asChild size="sm">
              <Link href="/data-poisoning">Go to Test Bed</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              DoS Attack Simulator
            </CardTitle>
            <Zap className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-4">
              Evaluate LLM resilience against denial-of-service scenarios.
            </p>
            <Button asChild size="sm">
              <Link href="/dos-attack">Go to Simulator</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Configuration
            </CardTitle>
            <Settings className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-4">
              Customize LLM connections and application settings.
            </p>
            <Button asChild size="sm">
              <Link href="/configuration">Configure Settings</Link>
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
            Understanding and mitigating risks associated with Large Language Models is crucial. This lab provides tools to explore common vulnerabilities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The OWASP Top 10 for Large Language Model Applications project highlights critical vulnerabilities. This lab helps you simulate and understand some of these, including:
          </p>
          <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground space-y-1">
            <li><strong>Prompt Injection:</strong> Tricking LLMs into executing unintended actions.</li>
            <li><strong>Data Poisoning:</strong> Manipulating training data to compromise LLM behavior.</li>
            <li><strong>Denial of Service:</strong> Overwhelming LLMs with requests to degrade performance.</li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Use these tools responsibly and ethically for learning and improving LLM security.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
