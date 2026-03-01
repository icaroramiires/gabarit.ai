'use client';

import { ReactNode } from "react";
import { LayoutDashboard, CalendarDays, BookOpen, Library, BarChart3, User, Crown, ChevronRight } from "lucide-react";
import { Progress } from "@/shared/ui/progress";
import { usePathname } from "next/navigation";

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-[280px] h-screen flex flex-col bg-card border-r border-border sticky top-0 py-8 px-6">

            {/* Exact Logo Match */}
            <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-200 dark:bg-[#33343c]">
                    <div className="grid grid-cols-2 gap-0.5 w-[22px] h-[22px]">
                        <div className="bg-slate-700 dark:bg-slate-300 rounded-tl-full"></div>
                        <div className="bg-slate-400 dark:bg-slate-500 rounded-tr-full"></div>
                        <div className="bg-slate-500 dark:bg-slate-400 rounded-bl-full"></div>
                        <div className="bg-slate-900 dark:bg-slate-100 rounded-br-full"></div>
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-1">
                <div className="space-y-2">
                    <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" href="/dashboard" active={pathname === '/dashboard'} />
                    <NavItem icon={<CalendarDays size={20} />} label="Cronograma" href="/dashboard" active={pathname === '/dashboard'} />
                    <NavItem icon={<BookOpen size={20} />} label="Matérias" href="/assessment" active={pathname === '/assessment'} />
                    <NavItem icon={<Library size={20} />} label="Flashcards" href="/flashcards" active={pathname === '/flashcards'} />
                    <NavItem icon={<BarChart3 size={20} />} label="Desempenho" href="/performance" active={pathname === '/performance'} />
                </div>

                <div className="mt-8 mb-4 px-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Conta</h3>
                </div>

                <div className="space-y-2">
                    <NavItem icon={<User size={20} />} label="Meu Perfil" href="/profile" active={pathname === '/profile'} />
                    <NavItem icon={<Crown size={20} className="text-amber-500" />} label="Planos Pro" href="/pricing" active={pathname === '/pricing'} />
                </div>
            </nav>

            <div className="mt-auto px-3 flex items-center gap-3 text-slate-400">
                <div className="w-4 h-4 rounded-full border border-current"></div>
                <div className="w-4 h-4 rounded-full border border-current"></div>
                <div className="w-4 h-4 rounded-full border border-current"></div>
            </div>
        </aside>
    );
}

function NavItem({ icon, label, href = "#", active = false, hasChevron = false }: { icon: ReactNode, label: string, href?: string, active?: boolean, hasChevron?: boolean }) {
    return (
        <a
            href={href}
            className={`flex items-center justify-between px-3 py-3 rounded-[1rem] transition-all duration-200 text-sm font-semibold ${active
                ? "bg-slate-900 text-white dark:bg-[#33343c] dark:text-white"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
        >
            <div className="flex items-center gap-3">
                <span className={`${active ? 'text-white' : 'text-slate-400'}`}>
                    {icon}
                </span>
                {label}
            </div>
            {hasChevron && <ChevronRight size={16} className="text-slate-400" />}
        </a>
    );
}

function SubNavItem({ label, active = false, badge, badgeColor }: { label: string, active?: boolean, badge?: string, badgeColor?: string }) {
    return (
        <a
            href="#"
            className={`flex items-center justify-between px-4 py-2 rounded-[1rem] transition-all duration-200 text-sm ${active
                ? "bg-slate-900 text-white dark:bg-[#33343c] dark:text-white font-semibold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium"
                }`}
        >
            {label}
            {badge && (
                <span className={`${badgeColor} text-[10px] font-bold px-2 py-0.5 rounded-full min-w-5 text-center`}>
                    {badge}
                </span>
            )}
        </a>
    );
}
