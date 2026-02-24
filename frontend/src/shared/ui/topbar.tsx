'use client';

import { Search, Bell, Settings, Zap } from "lucide-react";
import { useAuth } from "@/core/auth/AuthContext";
import { useEffect, useState } from "react";

export function TopBar() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<{ level: number, currentStreak: number } | null>(null);

    useEffect(() => {
        if (!user) return;
        fetch(`http://localhost:3001/api/gamification/profile/${user.id}`)
            .then(res => res.json())
            .then(res => setProfile(res.data))
            .catch(err => console.error("Error fetching gamification profile", err));
    }, [user]);
    return (
        <header className="h-16 w-full flex items-center justify-between px-8 bg-white dark:bg-[#11141c] border-b border-slate-200 dark:border-[#272e3f] sticky top-0 z-10">

            {/* Search Input - Center aligned roughly like the design */}
            <div className="flex-1 max-w-xl relative hidden md:block">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                    type="text"
                    className="block w-full rounded-full border-0 py-2 pl-10 pr-4 text-sm bg-slate-100 text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-[#171d28] dark:text-slate-200 dark:placeholder:text-slate-500"
                    placeholder="Buscar matérias, flashcards ou provas..."
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 ml-auto">
                {profile && profile.currentStreak > 0 && (
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 rounded-full text-sm font-bold border border-orange-200 dark:border-orange-800/50">
                        <Zap size={16} className="fill-current" />
                        <span>Streak: {profile.currentStreak} dias</span>
                    </div>
                )}
                <button className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#11141c]"></span>
                </button>
                <button className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <Settings className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-3 ml-2 border-l border-slate-200 dark:border-[#272e3f] pl-4">
                    <div className="hidden lg:flex flex-col items-end">
                        <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{user ? user.name : 'Carregando...'}</span>
                        <span className="text-xs text-slate-500 font-medium">{profile ? `Nível ${profile.level}` : 'Carregando...'}</span>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 ring-2 ring-white dark:ring-[#11141c] overflow-hidden flex-shrink-0">
                        <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Lucas&backgroundColor=e2e8f0" alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        </header>
    );
}
