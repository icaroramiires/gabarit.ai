import { ReactNode } from "react";
import { LayoutDashboard, CalendarDays, BookOpen, BarChart3 } from "lucide-react";
import { Progress } from "@/shared/ui/progress";

export function Sidebar() {
    return (
        <aside className="w-64 h-screen flex flex-col bg-white dark:bg-[#11141c] border-r border-slate-200 dark:border-[#272e3f] sticky top-0">

            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-transparent mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-blue-600 rounded-tr-lg rounded-bl-lg rounded-tl-sm rounded-br-sm flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-white rounded-full translate-x-[2px] -translate-y-[2px]"></div>
                    </div>
                    <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">Gabarit<span className="text-blue-600">AI</span></span>
                </div>
            </div>

            {/* Nav Section - User Context */}
            <div className="px-6 mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Meu Cronograma</h3>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Plano Premium Ativo</p>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 mt-6 space-y-1">
                <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" />
                <NavItem icon={<CalendarDays size={20} />} label="Cronograma" active />
                <NavItem icon={<BookOpen size={20} />} label="Matérias" />
                <NavItem icon={<BarChart3 size={20} />} label="Desempenho" />
            </nav>

            {/* Bottom Area - Progress / Upsell */}
            <div className="p-4 mt-auto">
                <div className="bg-blue-50 dark:bg-[#171d28] rounded-xl p-4 border border-blue-100 dark:border-[#272e3f]">
                    <h4 className="text-xs font-bold text-blue-700 dark:text-slate-300 uppercase mb-2">Progresso Semanal</h4>
                    <Progress value={65} className="h-2 mb-2 bg-blue-200 dark:bg-slate-800" />
                    <p className="text-xs text-right text-slate-500 font-medium">65% concluído</p>
                </div>
            </div>
        </aside>
    );
}

function NavItem({ icon, label, active = false }: { icon: ReactNode, label: string, active?: boolean }) {
    return (
        <a
            href="#"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${active
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-[#171d28] dark:hover:text-slate-200"
                }`}
        >
            {icon}
            {label}
        </a>
    );
}
