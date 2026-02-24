"use client"

import React, { useState, useEffect } from 'react';
import AppLayout from '@/shared/ui/app-layout';
import { StudyCard } from '@/features/study-planning/ui/StudyCard';
import { Bot, Loader2, Sparkles, BrainCircuit } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';
import { TimerModal } from '@/features/study-planning/ui/TimerModal';

export default function DashboardPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [schedules, setSchedules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [activeTimerBlock, setActiveTimerBlock] = useState<any>(null);

    // Fake User ID for MVP Integration Testing
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

    const handleGenerateBase = async () => {
        setLoading(true);
        try {
            await fetch(`http://localhost:3001/api/study-schedules/user/${userId}/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    targetExam: 'Polícia Federal',
                    dailyHours: 4,
                }),
            });
            await fetchSchedules();
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleMarkAsComplete = async (scheduleId: string, blockId: string) => {
        try {
            await fetch(`http://localhost:3001/api/study-schedules/${scheduleId}/blocks/${blockId}/complete`, {
                method: 'PATCH',
            });
            await fetchSchedules(); // Refresh to update kanban columns
        } catch (error) {
            console.error(error);
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
                    <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                </div>
            </AppLayout>
        );
    }

    const activeSchedule = schedules.length > 0 ? schedules[0] : null;

    // Split Blocks into Columns based on State
    // Split Blocks into Columns based on State
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pendingBlocks = activeSchedule?.blocks.filter((b: any) => b.status === 'pending') || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const inProgressBlocks = activeSchedule?.blocks.filter((b: any) => b.status === 'in-progress') || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const completedBlocks = activeSchedule?.blocks.filter((b: any) => b.status === 'completed') || [];

    return (
        <AppLayout>
            <div className="p-8 h-full flex flex-col relative">
                <div className="flex items-center justify-between mb-8 flex-shrink-0">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Cronograma da Semana</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Foco no edital: {activeSchedule ? activeSchedule.targetExam : 'Nenhum definido'}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/assessment">
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/20">
                                <BrainCircuit className="w-4 h-4 mr-2" />
                                Fazer Simulado
                            </Button>
                        </Link>
                        {!activeSchedule && (
                            <Button onClick={handleGenerateBase} className="bg-blue-600 hover:bg-blue-700 text-white">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Gerar com IA
                            </Button>
                        )}
                    </div>
                </div>

                {/* Kanban Board */}
                <div className="flex-1 flex gap-6 overflow-x-auto min-h-0 pb-6">

                    {/* Column 1: Pendente */}
                    <div className="w-[340px] flex-shrink-0 flex flex-col gap-4">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                                <h2 className="font-bold text-slate-800 dark:text-slate-200">Pendente</h2>
                                <span className="bg-slate-100 dark:bg-[#171d28] text-slate-500 dark:text-slate-400 text-xs font-bold px-2 py-0.5 rounded-full ml-1">
                                    {pendingBlocks.length}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 overflow-y-auto pr-2 pb-2 custom-scrollbar">
                            {pendingBlocks.length === 0 && activeSchedule && (
                                <p className="text-sm text-slate-500 text-center mt-4">Tudo concluído ou nada gerado!</p>
                            )}
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {pendingBlocks.map((block: any) => (
                                <div key={block.id} className="cursor-pointer group">
                                    <StudyCard
                                        subject={block.subject}
                                        topic={block.topic}
                                        type="TEORIA"
                                        status="pending"
                                        timeInfo={`${block.plannedDurationInMinutes} min`}
                                    />
                                    <Button
                                        onClick={() => handleStartSession(activeSchedule.id, block)}
                                        size="sm"
                                        className="w-full mt-2 font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400"
                                    >
                                        Iniciar Sessão Agora
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Em Progresso */}
                    <div className="w-[340px] flex-shrink-0 flex flex-col gap-4">
                        <div className="flex items-center gap-2 px-1">
                            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                            <h2 className="font-bold text-slate-800 dark:text-slate-200">Em Progresso</h2>
                            <span className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold px-2 py-0.5 rounded-full ml-1">
                                {inProgressBlocks.length}
                            </span>
                        </div>
                        <div className="flex flex-col gap-4 overflow-y-auto pr-2 pb-2 custom-scrollbar">
                            {inProgressBlocks.length === 0 && (
                                <p className="text-sm text-slate-500 text-center mt-4">Inicie um estudo para focar.</p>
                            )}

                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {inProgressBlocks.map((block: any) => (
                                <div key={block.id}>
                                    <StudyCard
                                        subject={block.subject}
                                        topic={block.topic}
                                        type="TEORIA"
                                        status="progress"
                                        progress={Math.floor((block.elapsedTimeInMinutes / block.plannedDurationInMinutes) * 100) || 0}
                                        onStart={() => setActiveTimerBlock(block)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Column 3: Concluído */}
                    <div className="w-[340px] flex-shrink-0 flex flex-col gap-4">
                        <div className="flex items-center gap-2 px-1">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <h2 className="font-bold text-slate-800 dark:text-slate-200">Concluído</h2>
                            <span className="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-500 text-xs font-bold px-2 py-0.5 rounded-full ml-1">
                                {completedBlocks.length}
                            </span>
                        </div>

                        <div className="flex flex-col gap-4 overflow-y-auto pr-2 pb-2 custom-scrollbar">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {completedBlocks.map((block: any) => (
                                <StudyCard
                                    key={block.id}
                                    subject={block.subject}
                                    topic={block.topic}
                                    type="TEORIA"
                                    status="completed"
                                    score={100}
                                />
                            ))}
                        </div>
                    </div>

                </div>

                {/* AI Tutor Floating Widget - Mocked based on screenshot */}
                <div className="absolute bottom-8 right-8 z-50">
                    <div className="bg-white dark:bg-[#1f2937] p-5 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 w-[320px] mb-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                <Bot size={16} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">GabaritAI Tutor</h4>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Online Agora</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                            Percebi que &quot;Português&quot; está atrasado. Gostaria que eu reorganizasse seu cronograma para compensar?
                        </p>
                        <div className="flex gap-2">
                            <Button size="sm" className="flex-1 text-xs font-bold h-8">Sim, Otimizar</Button>
                            <Button size="sm" variant="outline" className="flex-1 text-xs font-bold h-8">Depois</Button>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 transition-transform hover:scale-105">
                            <Bot size={28} />
                        </button>
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
                        onPause={async (elapsedSecondsPause) => {
                            try {
                                await fetch(`http://localhost:3001/api/study-schedules/${activeSchedule.id}/blocks/${activeTimerBlock.id}/pause`, {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ elapsedMinutes: elapsedSecondsPause }),
                                });
                                setActiveTimerBlock(null);
                                await fetchSchedules();
                            } catch (error) {
                                console.error('Erro ao pausar sessão', error);
                            }
                        }}
                        onComplete={async () => {
                            // First, we still trigger complete endpoint logic which we can refactor later 
                            // to also accept the final elapsed time! For now, mark as complete is enough.
                            setActiveTimerBlock(null);
                            await handleMarkAsComplete(activeSchedule.id, activeTimerBlock.id);
                        }}
                    />
                )}

            </div>

            {/* Basic styles for custom scrollbar in Kanban */}
            <style dangerouslySetInnerHTML={{
                __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
        .dark .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #475569; }
      `}} />
        </AppLayout>
    );
}
