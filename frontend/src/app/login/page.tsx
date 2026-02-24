import { LoginForm } from "@/features/auth/ui/LoginForm";
import { GraduationCap, BookOpen, BarChart2, MessageSquareText } from "lucide-react";

export default function LoginPage() {
    return (
        <main className="min-h-screen w-full flex flex-col lg:flex-row items-center justify-center p-4 lg:p-0">

            {/* Left Area - Hero/Marketing */}
            <div className="hidden lg:flex flex-col justify-center w-full lg:w-1/2 min-h-screen p-12 xl:p-24 relative overflow-hidden">
                <div className="max-w-xl relative z-10">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-blue-600 rounded-tr-2xl rounded-bl-2xl rounded-tl-sm rounded-br-sm flex items-center justify-center">
                            {/* Simplified Abstract Logo */}
                            <div className="w-4 h-4 bg-white rounded-full translate-x-1 -translate-y-1"></div>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">GabaritAI</h1>
                    </div>

                    <h2 className="text-5xl xl:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
                        Sua aprovação <br />
                        <span className="text-blue-600">desenhada por IA</span>
                    </h2>

                    <p className="text-lg text-slate-600 dark:text-slate-300 mb-12 max-w-md leading-relaxed">
                        Otimize seus estudos com nossa plataforma de planejamento estratégico. Inteligência artificial para guiar cada passo até a sua aprovação.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-sm font-medium text-slate-700 dark:text-slate-300">
                            <BookOpen className="w-4 h-4 text-blue-600" />
                            Planos de Estudo
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-sm font-medium text-slate-700 dark:text-slate-300">
                            <BarChart2 className="w-4 h-4 text-blue-600" />
                            Análise de Desempenho
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-sm font-medium text-slate-700 dark:text-slate-300">
                            <MessageSquareText className="w-4 h-4 text-blue-600" />
                            Mentoria IA
                        </div>
                    </div>
                </div>

                {/* Background glow effects */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/10 dark:bg-blue-600/10 blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/10 dark:bg-indigo-600/10 blur-[120px]"></div>
                </div>
            </div>

            {/* Right Area - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center">
                <LoginForm />
            </div>

            <footer className="absolute bottom-6 left-12 w-full text-xs text-slate-500 dark:text-slate-400 font-medium hidden lg:flex justify-between pr-24">
                <p>© 2024 GabaritAI. Todos os direitos reservados.</p>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Privacidade</a>
                    <a href="#" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Termos</a>
                    <a href="#" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Ajuda</a>
                </div>
            </footer>
        </main>
    );
}
