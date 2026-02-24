'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Loader2, SkipForward, CheckCircle2, ChevronRight, XCircle, Clock, Flag, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Alternative {
    id: string;
    text: string;
}

interface Question {
    id: string;
    bank: string;
    subject: string;
    topic: string;
    year: number;
    text: string;
    alternatives: Alternative[];
}

export default function AssessmentPage() {
    const router = useRouter();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAlt, setSelectedAlt] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<{ isCorrect: boolean } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [aiIsGenerating, setAiIsGenerating] = useState(false);
    const [aiExplanation, setAiExplanation] = useState<string | null>(null);

    // Hardcoded for MVP, in future it comes from Auth Context
    const userId = 'user-test-123';

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:3001/api/assessment/questions');
            const payload = await res.json();
            setQuestions(payload.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelect = (id: string) => {
        if (feedback !== null) return; // Prevent changing after answered
        setSelectedAlt(id);
    };

    const handleSubmit = async () => {
        if (!selectedAlt || feedback !== null) return;

        setIsSubmitting(true);
        const currentQ = questions[currentIndex];

        try {
            const res = await fetch(`http://localhost:3001/api/assessment/questions/${currentQ.id}/answer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, selectedAlternativeId: selectedAlt })
            });
            const data = await res.json();
            setFeedback({ isCorrect: data.data.isCorrect });
        } catch (e) {
            console.error(e);
            alert('Erro ao submeter resposta.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(curr => curr + 1);
            setSelectedAlt(null);
            setFeedback(null);
            setAiExplanation(null);
            setAiIsGenerating(false);
        } else {
            alert('Você revisou todas as questões disponíveis!');
            router.push('/dashboard');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] flex flex-col items-center justify-center text-slate-900 dark:text-white">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                <p className="text-slate-500 dark:text-slate-400 font-medium">Carregando simulado...</p>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] flex flex-col items-center justify-center text-slate-900 dark:text-white p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-4 shadow-sm">
                    <Sparkles className="w-8 h-8 text-blue-500" />
                </div>
                <h2 className="text-xl font-bold mb-2">Sem questões disponíveis</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">O banco de questões está vazio no momento.</p>
                <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                    Sair do Simulado
                </button>
            </div>
        );
    }

    const currentQ = questions[currentIndex];

    // Mock progress grid based on the mockup
    const mockGridCount = 60;
    const progressGrid = Array.from({ length: mockGridCount }, (_, i) => {
        if (i < 31) {
            if (i === 5 || i === 11 || i === 24) return 'skipped';
            return 'responded';
        }
        if (i === 31) return 'current'; // 32 is current (index 31)
        return 'pending';
    });

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-[#0b1120] text-slate-900 dark:text-slate-100 font-sans overflow-hidden">

            {/* Left Sidebar */}
            <aside className="w-[280px] flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] flex-col hidden lg:flex h-full">

                {/* Logo Area */}
                <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 flex-shrink-0 cursor-pointer" onClick={() => router.push('/dashboard')}>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                            <span className="text-white font-bold text-lg leading-none">G</span>
                        </div>
                        <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">GabaritAI</span>
                    </div>
                </div>

                {/* Progress Grid */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Progresso</h3>
                        <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md">32/60</span>
                    </div>

                    <div className="grid grid-cols-5 gap-2 mb-8">
                        {progressGrid.map((status, idx) => {
                            let className = "flex items-center justify-center h-9 text-xs font-bold rounded cursor-pointer transition-colors ";

                            if (status === 'responded') className += "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-500/25";
                            else if (status === 'skipped') className += "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-500/25";
                            else if (status === 'current') className += "bg-blue-600 text-white shadow-md shadow-blue-500/30";
                            else className += "bg-transparent text-slate-400 border border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600";

                            return (
                                <div key={idx} className={className}>
                                    {idx + 1}
                                </div>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Legenda</h3>
                        <div className="space-y-2.5">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-emerald-100 dark:bg-emerald-500/30 border border-emerald-300 dark:border-emerald-500"></div>
                                <span className="text-sm text-slate-600 dark:text-slate-400">Respondida</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-amber-100 dark:bg-amber-500/30 border border-amber-300 dark:border-amber-500"></div>
                                <span className="text-sm text-slate-600 dark:text-slate-400">Pulada</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-transparent border border-slate-300 dark:border-slate-600"></div>
                                <span className="text-sm text-slate-600 dark:text-slate-400">Pendente</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                                <span className="text-sm text-slate-600 dark:text-slate-400">Atual</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 border-t border-slate-200 dark:border-slate-800">
                    <button className="flex items-center justify-center gap-2 w-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors font-medium text-sm">
                        <Flag className="w-4 h-4" /> Reportar Erro
                    </button>
                </div>
            </aside>

            {/* Main Wrapper */}
            <div className="flex-1 flex flex-col h-full relative">

                {/* Top Header */}
                <header className="h-[72px] flex items-center justify-between px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            Simulado: CESPE - Informática
                            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-[10px] uppercase font-bold rounded flex items-center">
                                Hard Mode
                            </span>
                        </h1>
                        <div className="hidden md:flex items-center gap-1.5 text-orange-500 bg-orange-50 dark:bg-orange-500/10 px-2 py-1 rounded text-xs font-bold">
                            <span>🔥</span> Streak: 12
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-[10px] uppercase font-bold text-slate-400">Precisão</span>
                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-500">78%</span>
                        </div>
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-[10px] uppercase font-bold text-slate-400">XP Total</span>
                            <span className="text-sm font-bold text-amber-500">2.450</span>
                        </div>
                        <div className="flex items-center gap-2 bg-blue-50 dark:bg-[#1e293b] border border-blue-100 dark:border-slate-700 px-4 py-1.5 rounded-full text-blue-700 dark:text-blue-400 font-bold font-mono">
                            <Clock className="w-4 h-4" /> 02:45:12
                        </div>
                    </div>
                </header>

                {/* Main Content Scrollable Area */}
                <main className="flex-1 overflow-y-auto px-6 py-8 pb-40 lg:px-12 custom-scrollbar">
                    <div className="max-w-4xl mx-auto">

                        {/* Meta Tags & Focus Mode */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md border border-blue-100 dark:border-blue-500/20">
                                    {currentQ.subject}
                                </span>
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-md">
                                    Ano: {currentQ.year}
                                </span>
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-md">
                                    Banca: {currentQ.bank}
                                </span>
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-md">
                                    Nível: Difícil
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-400 uppercase">Modo Foco</span>
                                <div className="w-10 h-5 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center p-0.5 cursor-pointer">
                                    <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                </div>
                            </div>
                        </div>

                        {/* Question Setup */}
                        <div className="mb-10">
                            <h2 className="text-xl md:text-[22px] text-slate-800 dark:text-slate-200 font-medium leading-relaxed mb-6">
                                {currentQ.text}
                            </h2>
                            <div className="pl-6 border-l-4 border-blue-500 py-2">
                                <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 leading-relaxed font-serif italic text-balance">
                                    &quot;A assinatura digital garante a autenticidade e a integridade de um documento eletrônico, mas não necessariamente a sua confidencialidade.&quot;
                                </p>
                            </div>
                        </div>

                        {/* Image Placeholder */}
                        <div className="w-full h-[220px] bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl mb-10 relative overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700">
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                            {/* Central Lock Graphic */}
                            <div className="w-24 h-32 relative flex flex-col items-center justify-center opacity-80">
                                <div className="w-16 h-16 rounded-full border-[6px] border-slate-300 absolute top-0"></div>
                                <div className="w-24 h-20 bg-slate-300 rounded-xl absolute bottom-0"></div>
                                <div className="w-4 h-6 bg-slate-800 absolute bottom-6 rounded-full"></div>
                            </div>
                            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-white/80" />
                                <span className="text-white/90 text-xs font-medium">Figura 1: Conceitos de Criptografia</span>
                            </div>
                        </div>

                        {/* Alternatives */}
                        <div className="space-y-4 mb-8">
                            {currentQ.alternatives.map((alt, idx) => {
                                const alphabet = ['A', 'B', 'C', 'D', 'E'];
                                const isSelected = selectedAlt === alt.id;

                                let cardClass = "w-full text-left p-5 rounded-2xl border transition-all duration-200 flex items-start gap-4 ";
                                let radioClass = "w-5 h-5 rounded-full border flex items-center justify-center transition-colors mt-0.5 ";
                                let letterClass = "font-bold text-sm mb-1 ";
                                let textClass = "text-[15px] leading-relaxed ";
                                let Icon = null;

                                if (feedback !== null) {
                                    if (isSelected) {
                                        if (feedback.isCorrect) {
                                            cardClass += "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 shadow-[0_0_0_1px_rgba(16,185,129,1)]";
                                            radioClass += "border-emerald-500 bg-emerald-500";
                                            letterClass += "text-emerald-700 dark:text-emerald-400";
                                            textClass += "text-emerald-800 dark:text-emerald-200";
                                            Icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-auto" />;
                                        } else {
                                            cardClass += "border-red-500 bg-red-50 dark:bg-red-500/10 shadow-[0_0_0_1px_rgba(239,68,68,1)]";
                                            radioClass += "border-red-500 bg-red-500";
                                            letterClass += "text-red-700 dark:text-red-400";
                                            textClass += "text-red-800 dark:text-red-200";
                                            Icon = <XCircle className="w-5 h-5 text-red-500 ml-auto" />;
                                        }
                                    } else {
                                        cardClass += "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] opacity-60";
                                        radioClass += "border-slate-300 dark:border-slate-700 bg-transparent";
                                        letterClass += "text-slate-400";
                                        textClass += "text-slate-400";
                                    }
                                } else if (isSelected) {
                                    cardClass += "border-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,1)] bg-blue-50/50 dark:bg-blue-500/5";
                                    radioClass += "border-blue-500 bg-blue-500";
                                    letterClass += "text-blue-600 dark:text-blue-400";
                                    textClass += "text-slate-800 dark:text-slate-200";
                                } else {
                                    cardClass += "border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-[0_2px_8px_-4px_rgba(59,130,246,0.3)]";
                                    radioClass += "border-slate-300 dark:border-slate-600 bg-transparent";
                                    letterClass += "text-blue-600 dark:text-blue-500";
                                    textClass += "text-slate-600 dark:text-slate-300";
                                }

                                return (
                                    <button
                                        key={alt.id}
                                        onClick={() => handleSelect(alt.id)}
                                        disabled={feedback !== null}
                                        className={cardClass}
                                    >
                                        <div className={radioClass}>
                                            {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                        </div>
                                        <div className="flex flex-col flex-1 text-left">
                                            <span className={letterClass}>{alphabet[idx]}</span>
                                            <span className={textClass}>
                                                {alt.text}
                                            </span>
                                        </div>
                                        {Icon && (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                {Icon}
                                            </motion.div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* AI Explanation Inline (replaces the modal if generated) */}
                        <AnimatePresence>
                            {(aiExplanation || aiIsGenerating) && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-500/30 overflow-hidden mb-8"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                            <Sparkles className="w-4 h-4" />
                                        </div>
                                        <h4 className="font-bold text-purple-900 dark:text-purple-300 text-sm">GabaritAI Explica</h4>
                                    </div>
                                    {aiIsGenerating ? (
                                        <div className="flex flex-col gap-2">
                                            <div className="h-4 bg-purple-200/50 dark:bg-purple-500/20 rounded animate-pulse w-3/4"></div>
                                            <div className="h-4 bg-purple-200/50 dark:bg-purple-500/20 rounded animate-pulse w-full"></div>
                                            <div className="h-4 bg-purple-200/50 dark:bg-purple-500/20 rounded animate-pulse w-5/6"></div>
                                            <span className="text-purple-600 dark:text-purple-400 text-xs mt-2 flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Analisando a questão...</span>
                                        </div>
                                    ) : (
                                        <p className="text-purple-900 dark:text-purple-200 text-[15px] leading-relaxed">
                                            {aiExplanation}
                                        </p>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>
                </main>

                {/* Fixed Bottom Action Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-slate-50 via-slate-50 dark:from-[#0b1120] dark:via-[#0b1120] to-transparent pointer-events-none z-20">
                    <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#1f2937] p-4 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 pointer-events-auto shadow-blue-900/5 dark:shadow-none">

                        {/* Left Action (AI) */}
                        <button
                            onClick={() => {
                                setAiIsGenerating(true);
                                setTimeout(() => {
                                    setAiExplanation("A assinatura digital, que se baseia em criptografia assimétrica, tem o propósito principal de garantir a Autenticidade (ter certeza de quem assinou) e a Integridade (ter certeza que não foi alterado). Contudo, o documento em si pode tramitar de forma clara, ou seja, sem Confidencialidade, a não ser que seja criptografado por outro processo. Portanto, o item está Correto.");
                                    setAiIsGenerating(false);
                                }, 2500);
                            }}
                            disabled={aiIsGenerating || aiExplanation !== null || feedback === null}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ${feedback !== null
                                ? 'bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-200 dark:bg-purple-500/10 dark:hover:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 border border-transparent'
                                }`}
                        >
                            <Sparkles className="w-5 h-5" />
                            Explicar com IA
                        </button>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button
                                onClick={handleNext}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <SkipForward className="w-5 h-5" />
                                Pular
                            </button>

                            {feedback !== null ? (
                                <button
                                    onClick={handleNext}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-lg shadow-blue-600/20"
                                >
                                    Próxima
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={!selectedAlt || isSubmitting}
                                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${selectedAlt
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 cursor-not-allowed'
                                        }`}
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Responder'}
                                    {!isSubmitting && <CheckCircle2 className="w-5 h-5" />}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* Basic styles for custom scrollbar */}
            <style dangerouslySetInnerHTML={{
                __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
        .dark .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #475569; }
      `}} />
        </div>
    );
}

