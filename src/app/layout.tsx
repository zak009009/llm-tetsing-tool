import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Using Inter as a fallback
// import localFont from 'next/font/local'; // Removed localFont import
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

// const geistSans = localFont({ // Removed geistSans definition
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900"
// });
// const geistMono = localFont({ // Removed geistMono definition
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900"
// });

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });


export const metadata: Metadata = {
  title: 'LLM Exploit Lab',
  description: 'Test and evaluate LLM vulnerabilities',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
          "min-h-screen bg-background font-sans antialiased",
          // geistSans.variable, // Removed geistSans.variable
          // geistMono.variable, // Removed geistMono.variable
          inter.variable
        )}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
