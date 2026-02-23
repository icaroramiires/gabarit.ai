import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Target, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
        <div className="mb-8 flex items-center justify-center">
          <div className="bg-primary/10 p-4 rounded-full">
            <BrainCircuit className="h-16 w-16 text-primary" />
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground mb-6">
          <span className="block">Bem-vindo ao</span>
          <span className="block text-primary">Gabarit.ai</span>
        </h1>

        <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          A plataforma de estudos avançada guiada por Inteligência Artificial.
          Revisão inteligente, análise de desempenho e foco absoluto na sua aprovação.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 font-semibold">
              Acessar Minha Conta
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8">
              Conhecer a Plataforma
            </Button>
          </Link>
        </div>
      </main>

      {/* Mini Features Section */}
      <section id="features" className="py-20 bg-background border-t">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 mb-6">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Foco Direcionado</h3>
              <p className="text-muted-foreground">Ciclos de estudo adaptativos focados nas suas maiores fraquezas.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-green-500/10 mb-6">
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Dashboard de Evolução</h3>
              <p className="text-muted-foreground">Acompanhe métricas reais: horas líquidas, taxa de acerto e retenção de memória.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-orange-500/10 mb-6">
                <BrainCircuit className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Tutor IA Integrado</h3>
              <p className="text-muted-foreground">O Google Gemini explica detalhadamente por que você errou cada questão.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Minimalista */}
      <footer className="py-8 text-center text-muted-foreground border-t">
        <p>&copy; {new Date().getFullYear()} Gabarit.ai. Produtividade em Nível Máximo.</p>
      </footer>
    </div>
  );
}
