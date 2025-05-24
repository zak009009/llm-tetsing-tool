import {
  LayoutDashboard,
  AlertTriangle,
  FlaskConical,
  Settings,
  FileQuestion,
  Scale, // Changed from Balance
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  tooltip?: string;
}

export const navLinks: NavLink[] = [
  {
    href: "/dashboard",
    label: "Tableau de Bord",
    icon: ShieldCheck,
    tooltip: "Vue d'ensemble des tests",
  },
  {
    href: "/security-test-suite",
    label: "Suite de Tests",
    icon: ShieldCheck,
    tooltip: "Tests de sécurité complets",
  },
  {
    href: "/prompt-injection",
    label: "Injection de Prompt",
    icon: AlertTriangle,
    tooltip: "Test d'injection de prompt",
  },
  {
    href: "/data-poisoning",
    label: "Empoisonnement de Données",
    icon: FlaskConical,
    tooltip: "Test d'empoisonnement de données",
  },
  {
    href: "/hallucination-tester",
    label: "Test d'Hallucination",
    icon: FileQuestion,
    tooltip: "Test d'hallucination",
  },
  {
    href: "/bias-detector",
    label: "Détecteur de Biais",
    icon: Scale, // Changed from Balance
    tooltip: "Détection de biais",
  },
  {
    href: "/configuration",
    label: "Configuration",
    icon: Settings,
    tooltip: "Paramètres de l'application",
  },
];
