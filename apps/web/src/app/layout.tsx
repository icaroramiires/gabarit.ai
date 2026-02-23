import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/components/query-provider";
import { AuthProvider } from "@/components/auth-provider";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gabarit.ai - Estude com Inteligência ArtificiaI",
  description: "A plataforma de estudos avançada com revisão inteligente guiada por Inteligência Artificial. Maximize sua taxa de retenção e alcance seus objetivos acadêmicos.",
  keywords: ["estudos", "concursos", "inteligência artificial", "revisão espaçada", "produtividade"],
  openGraph: {
    title: "Gabarit.ai - Estude com Inteligência",
    description: "Plataforma SaaS para estudantes de alto rendimento.",
    url: "https://gabarit.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gabarit.ai",
    description: "Estude com Inteligência Artificial",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              <TooltipProvider>
                <SidebarProvider>
                  {children}
                </SidebarProvider>
              </TooltipProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

