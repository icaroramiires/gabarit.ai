"use client"

import React, { useState, useEffect } from 'react';
import AppLayout from '@/shared/ui/app-layout';
import { Loader2, TrendingUp, TrendingDown, ChevronDown, PieChart, Sparkles, Clock, Target, MoreHorizontal } from 'lucide-react';
import { TimerModal } from '@/features/study-planning/ui/TimerModal';

export default function DashboardPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [schedules, setSchedules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [activeTimerBlock, setActiveTimerBlock] = useState<any>(null);

    const userId = 'user-test-123';

    const fetchSchedules = async () => {
        try {
            const res = await fetch(`http://localhost:3001/api/study-schedules/user/${userId}`);
            const payload = await res.json();
            setSchedules(payload.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartSession = async (scheduleId: string, block: { id: string }) => {
        try {
            await fetch(`http://localhost:3001/api/study-schedules/${scheduleId}/blocks/${block.id}/start`, {
                method: 'PATCH',
            });
            setActiveTimerBlock(block);
            await fetchSchedules();
        } catch (error) {
            console.error(error);
            alert("Erro ao iniciar timer. Já existe outra sessão rolando.");
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    if (loading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center h-full w-full">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            </AppLayout>
        );
    }

    const activeSchedule = schedules.length > 0 ? schedules[0] : null;

    // Filters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allBlocks = activeSchedule?.blocks || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pendingBlocks = allBlocks.filter((b: any) => b.status === 'pending') || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const completedBlocks = allBlocks.filter((b: any) => b.status === 'completed') || [];

    const totalStudiedMinutes = completedBlocks.reduce((acc: number, curr: any) => acc + (curr.elapsedTimeInMinutes || curr.plannedDurationInMinutes), 0);
    const totalStudiedHours = (totalStudiedMinutes / 60).toFixed(1);

    return (
        <AppLayout>
            <div className="p-10 h-full overflow-y-auto">

                <div className="flex items-center justify-between mb-8 max-w-[1400px]">
                    <h2 className="text-[28px] font-bold text-foreground">Overview</h2>
                    <div className="bg-card border border-border px-4 py-2.5 rounded-full text-sm font-semibold text-slate-500 cursor-pointer shadow-sm flex items-center gap-2">
                        Last 30 days <ChevronDown className="w-4 h-4 ml-1" />
                    </div>
                </div>

                {/* Main Grid matching Inspiration layout exactly */}
                <div className="flex flex-col gap-6 max-w-[1400px]">

                    {/* Top Row: 4 Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                        {/* Card 1: Horas Estudadas (Customers mimic) */}
                        <div className="bg-card border border-border p-6 rounded-[24px] shadow-sm flex flex-col justify-between h-[180px]">
                            <div className="flex justify-between items-start">
                                <div className="text-slate-400 font-semibold mb-2 text-sm">Horas Estudadas</div>
                                <MoreHorizontal className="text-slate-400 w-5 h-5 cursor-pointer" />
                            </div>
                            <div className="flex justify-between items-end mt-2">
                                <div>
                                    <div className="text-[32px] leading-none font-bold tracking-tight text-foreground mb-1">{totalStudiedHours}h</div>
                                    <div className="text-sm font-semibold text-slate-400">Tempo total</div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-500 text-xs font-bold rounded-[8px] mb-2">
                                        <TrendingUp className="w-3 h-3" /> 24%
                                    </div>
                                    <div className="w-16 h-8 bg-slate-100 dark:bg-[#33343c] rounded-md flex items-end gap-1 p-1">
                                        <div className="w-1/3 bg-slate-300 dark:bg-slate-500 rounded-sm h-[40%]"></div>
                                        <div className="w-1/3 bg-slate-400 dark:bg-slate-400 rounded-sm h-[70%]"></div>
                                        <div className="w-1/3 bg-green-500 rounded-sm h-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Questões Resolvidas (Balance mimic) */}
                        <div className="bg-card border border-border p-6 rounded-[24px] shadow-sm flex flex-col justify-between h-[180px]">
                            <div className="flex justify-between items-start">
                                <div className="text-slate-400 font-semibold mb-2 text-sm">Questões Resolvidas</div>
                                <MoreHorizontal className="text-slate-400 w-5 h-5 cursor-pointer" />
                            </div>
                            <div className="flex justify-between items-end mt-2">
                                <div>
                                    <div className="text-[32px] leading-none font-bold tracking-tight text-foreground mb-1">1,293</div>
                                    <div className="text-sm font-semibold text-slate-400">Total acumulado</div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-500 text-xs font-bold rounded-[8px] mb-2">
                                        <TrendingUp className="w-3 h-3" /> 16%
                                    </div>
                                    <div className="w-20 h-8 flex items-end">
                                        {/* Fake line chart */}
                                        <svg viewBox="0 0 100 30" className="w-full h-full stroke-green-500 stroke-[3] fill-none" preserveAspectRatio="none">
                                            <path d="M0,25 C20,20 30,5 50,15 C70,25 80,10 100,5" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 3: Desempenho (Product view mimic) */}
                        <div className="bg-card border border-border p-6 rounded-[24px] shadow-sm flex flex-col justify-between h-[180px]">
                            <div className="flex justify-between items-start">
                                <div className="text-slate-400 font-semibold mb-2 text-sm">Aproveitamento</div>
                                <MoreHorizontal className="text-slate-400 w-5 h-5 cursor-pointer" />
                            </div>
                            <div className="flex justify-between items-end mt-2">
                                <div>
                                    <div className="text-[32px] leading-none font-bold tracking-tight text-foreground mb-1">84.2%</div>
                                    <div className="text-sm font-semibold text-slate-400">Média em bateria</div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-500 text-xs font-bold rounded-[8px] mb-2">
                                        <TrendingDown className="w-3 h-3" /> 2.4%
                                    </div>
                                    <div className="w-20 h-8 flex items-end">
                                        {/* Fake line chart red */}
                                        <svg viewBox="0 0 100 30" className="w-full h-full stroke-rose-500 stroke-[3] fill-none" preserveAspectRatio="none">
                                            <path d="M0,10 C20,15 30,25 50,15 C70,5 80,20 100,25" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 4: Distribuição (Devices Donut Chart mimic) */}
                        <div className="bg-card border border-border p-6 rounded-[24px] shadow-sm flex flex-col justify-between h-[180px] relative">
                            <div className="flex justify-between items-start z-10">
                                <div className="text-slate-400 font-semibold mb-2 text-sm">Foco do Estudo</div>
                                <MoreHorizontal className="text-slate-400 w-5 h-5 cursor-pointer" />
                            </div>

                            <div className="flex items-end justify-between absolute bottom-6 left-6 right-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-[#33343c]"></div>
                                        <span className="text-sm font-semibold text-slate-400">Teoria</span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        <span className="text-sm font-semibold text-slate-400">Revisão</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-slate-800 dark:bg-slate-300"></div>
                                        <span className="text-sm font-semibold text-slate-400">Questões</span>
                                    </div>
                                </div>

                                {/* Half Donut graphic */}
                                <div className="relative w-24 h-12 overflow-hidden flex-shrink-0">
                                    <div className="absolute top-0 left-0 w-24 h-24 rounded-full border-[10px] border-slate-200 dark:border-[#33343c]">
                                        <div className="absolute inset-[-10px] border-[10px] border-green-500 rounded-full border-r-transparent border-b-transparent transform rotate-45"></div>
                                        <div className="absolute inset-[-10px] border-[10px] border-slate-800 dark:border-slate-300 rounded-full border-l-transparent border-t-transparent border-r-transparent transform rotate-45"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Middle Row: Large Primary Bar Chart ("Income" mimic) */}
                    <div className="bg-card border border-border p-8 rounded-[24px] shadow-sm h-[400px] flex flex-col relative w-full">
                        <div className="flex items-start justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-1">Evolução do Foco</h3>
                                <p className="text-sm font-semibold text-slate-400">Horas estudadas por dia nesta semana</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div> Target
                                </span>
                                <span className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-[#33343c]"></div> Realizado
                                </span>
                            </div>
                        </div>

                        {/* Faithful Bar Chart Mimic */}
                        <div className="flex-1 flex items-end justify-between px-4 pb-2 relative z-0">
                            {/* Horizontal guide lines */}
                            <div className="absolute top-0 inset-x-4 border-t border-dashed border-border/50 z-[-1]"></div>
                            <div className="absolute top-1/2 inset-x-4 border-t border-dashed border-border/50 z-[-1]"></div>
                            <div className="absolute bottom-6 inset-x-4 border-t border-solid border-border z-[-1]"></div>

                            {/* Chart Bars */}
                            {[1, 2, 3, 4, 5, 6, 7].map((bar, i) => (
                                <div key={i} className="flex flex-col items-center flex-1 group">
                                    <div className={`w-14 rounded-t-xl transition-all duration-300 relative cursor-pointer
                                         ${i === 3 ? "bg-green-500 h-[80%]" : "bg-slate-200 dark:bg-[#33343c] h-[40%] group-hover:bg-slate-300 dark:group-hover:bg-slate-700"}
                                         ${i === 4 && "h-[65%]"} ${i === 2 && "h-[50%]"} ${i === 6 && "h-[70%]"}
                                    `}>
                                        {i === 3 && (
                                            <div className="absolute -top-[52px] left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white px-4 py-2 rounded-full shadow-lg shadow-green-500/20 z-10 whitespace-nowrap">
                                                <span className="text-white dark:text-slate-900 font-bold text-sm">4.5h</span>
                                                {/* Tooltip dot */}
                                                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-slate-900 shadow-sm"></div>
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-xs font-semibold text-slate-400 mt-4">Day {bar}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Row: List (Popular Products mimic) */}
                    <div className="bg-card border border-border p-8 rounded-[24px] shadow-sm w-full">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold text-foreground">Próximos Blocos</h3>
                            <button className="text-sm font-semibold text-slate-400 hover:text-foreground transition-colors">Ver todos</button>
                        </div>

                        <div className="flex flex-col w-full">
                            {/* Header */}
                            <div className="grid grid-cols-12 gap-4 pb-4 border-b border-border/60 text-xs font-semibold text-slate-400">
                                <div className="col-span-5 md:col-span-4 uppercase tracking-wider">Product</div>
                                <div className="col-span-4 md:col-span-3 uppercase tracking-wider hidden md:block">Earnings</div>
                                <div className="col-span-4 md:col-span-3 uppercase tracking-wider">Status</div>
                                <div className="col-span-3 md:col-span-2 text-right uppercase tracking-wider">Action</div>
                            </div>

                            {/* Rows */}
                            {pendingBlocks.slice(0, 3).map((block: any, idx: number) => (
                                <div key={block.id} className={`grid grid-cols-12 gap-4 py-5 items-center ${idx !== 2 ? 'border-b border-border/40' : ''} group`}>
                                    <div className="col-span-5 md:col-span-4 flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center font-bold text-lg text-white
                                             ${idx === 0 ? 'bg-orange-500' : idx === 1 ? 'bg-indigo-500' : 'bg-rose-500'}
                                         `}>
                                            {block.subject.substring(0, 1)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-foreground">{block.subject}</h4>
                                            <p className="text-xs font-semibold text-slate-400 mt-0.5 line-clamp-1">{block.topic}</p>
                                        </div>
                                    </div>

                                    <div className="col-span-4 md:col-span-3 hidden md:flex flex-col justify-center">
                                        <span className="font-bold text-sm text-foreground">{block.plannedDurationInMinutes} min</span>
                                        <span className="text-xs font-semibold text-slate-400">Tempo Alvo</span>
                                    </div>

                                    <div className="col-span-4 md:col-span-3 flex items-center">
                                        <span className="px-3 py-1 bg-slate-100 dark:bg-[#33343c] text-slate-600 dark:text-slate-300 text-xs font-bold rounded-md">
                                            Pendente
                                        </span>
                                    </div>

                                    <div className="col-span-3 md:col-span-2 flex justify-end">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleStartSession(activeSchedule?.id, block); }}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground px-4 py-2 rounded-full text-xs font-bold leading-none shadow-sm">
                                            Study
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {pendingBlocks.length === 0 && (
                                <p className="py-10 text-center text-sm font-semibold text-slate-500">Nenhum bloco pendente hoje.</p>
                            )}
                        </div>
                    </div>

                </div>

                {activeTimerBlock && (
                    <TimerModal
                        blockId={activeTimerBlock.id}
                        subject={activeTimerBlock.subject}
                        topic={activeTimerBlock.topic}
                        plannedMinutes={activeTimerBlock.plannedDurationInMinutes}
                        elapsedSecondsInit={activeTimerBlock.elapsedTimeInMinutes * 60}
                        onClose={() => setActiveTimerBlock(null)}
                        onPause={() => setActiveTimerBlock(null)}
                        onComplete={async () => {
                            setActiveTimerBlock(null);
                        }}
                    />
                )}
            </div>
        </AppLayout>
    );
}
