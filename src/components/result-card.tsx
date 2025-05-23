import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ReactNode } from "react";

interface ResultCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  isLoading?: boolean;
  error?: string | null;
}

export function ResultCard({ title, description, children, isLoading, error }: ResultCardProps) {
  return (
    <Card className="mt-6 shadow-lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center h-32">
            <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-2 text-muted-foreground">Processing...</span>
          </div>
        )}
        {error && (
          <div className="p-4 text-destructive-foreground bg-destructive rounded-md">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}
        {!isLoading && !error && (
          <ScrollArea className="h-auto max-h-[500px] w-full">
            <div className="font-mono text-sm p-1">{children}</div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

export function ResultItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="mb-3">
      <p className="font-semibold text-foreground/80">{label}:</p>
      {typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' ? (
        <p className="whitespace-pre-wrap">{String(value)}</p>
      ) : (
        value
      )}
    </div>
  );
}
