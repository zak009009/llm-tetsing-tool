import {
  LayoutDashboard,
  AlertTriangle,
  FlaskConical,
  Zap,
  Settings,
  ShieldAlert,
  PackageSearch
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
    href: '/dos-attack',
    label: 'DoS Attack Sim',
    icon: Zap,
    tooltip: 'Simulate DoS Attacks',
  },
  {
    href: '/configuration',
    label: 'Configuration',
    icon: Settings,
    tooltip: 'App Settings',
  },
];

// Example of a group, if needed later
// export const groupLinks = [
//   {
//     label: "Security Tests",
//     icon: ShieldAlert,
//     links: [
//       navLinks[1], navLinks[2], navLinks[3]
//     ]
//   }
// ]
