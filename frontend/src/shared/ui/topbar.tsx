'use client';

import { Search, Bell, Settings } from "lucide-react";

export function TopBar() {
    return (
        <header className="h-[100px] w-full flex items-center justify-between px-10 bg-transparent sticky top-0 z-10">

            {/* Left Title Area */}
            <div className="flex-1">
                <h1 className="text-[28px] font-bold text-foreground tracking-tight">Dashboard</h1>
            </div>

            {/* Exact Search Input */}
            <div className="flex-1 flex justify-center max-w-xl relative hidden md:flex">
                <div className="relative w-full max-w-[480px]">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                        <Search className="h-[18px] w-[18px] text-slate-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full rounded-full border border-border/50 py-3.5 pl-12 pr-6 text-sm font-medium bg-white dark:bg-card text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-ring shadow-sm transition-all"
                        placeholder="Search anything..."
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex-1 flex items-center justify-end gap-4 ml-auto">
                <button className="px-6 py-3 text-sm font-bold rounded-full bg-primary text-primary-foreground shadow-sm hover:opacity-90 transition-opacity">
                    Create
                </button>

                <button className="w-12 h-12 rounded-full border border-border/50 bg-white dark:bg-card flex items-center justify-center text-slate-500 hover:text-foreground shadow-sm transition-colors relative">
                    <Bell className="h-5 w-5" />
                    {/* Small orange dot mimicking notification */}
                    <span className="absolute top-3.5 right-3.5 block h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white dark:ring-card"></span>
                </button>

                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shadow-sm flex-shrink-0 ml-2">
                    <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Lucas&backgroundColor=e2e8f0" alt="Avatar" className="w-full h-full object-cover" />
                </div>
            </div>
        </header>
    );
}
