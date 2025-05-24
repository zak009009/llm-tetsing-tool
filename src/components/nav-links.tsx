import {
  LayoutDashboard,
  AlertTriangle,
  FlaskConical,
  Settings,
  FileQuestion, 
  Scale,      // Changed from Balance
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  tooltip?: string;
}

export const navLinks: NavLink[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    tooltip: 'Overview',
  },
  {
    href: '/prompt-injection',
    label: 'Prompt Injection',
    icon: AlertTriangle,
    tooltip: 'Test Prompt Injection',
  },
  {
    href: '/data-poisoning',
    label: 'Data Poisoning',
    icon: FlaskConical,
    tooltip: 'Test Data Poisoning',
  },
  {
    href: '/hallucination-tester', 
    label: 'Hallucination Test',
    icon: FileQuestion,
    tooltip: 'Test for LLM Hallucinations',
  },
  {
    href: '/bias-detector', 
    label: 'Bias Detector',
    icon: Scale, // Changed from Balance
    tooltip: 'Detect Bias in LLM Outputs',
  },
  {
    href: '/configuration',
    label: 'Configuration',
    icon: Settings,
    tooltip: 'App Settings',
  },
];
