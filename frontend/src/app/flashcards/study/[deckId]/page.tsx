"use client"

import React, { useState, useEffect } from 'react';
import AppLayout from '@/shared/ui/app-layout';
import { Loader2, ArrowLeft, Brain, CheckCircle2, RefreshCcw, Smile } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function StudySessionPage({ params }: { params: { deckId: string } }) {
    const router = useRouter();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [flashcards, setFlashcards] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`http://localhost:3001/flashcards/decks/${params.deckId}/due`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const payload = await res.json();
                setFlashcards(payload.data || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCards();
    }, [params.deckId]);

    const handleReview = async (grade: 'HARD' | 'GOOD' | 'EASY') => {
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const currentCard = flashcards[currentIndex];
            const res = await fetch(`http://localhost:3001/flashcards/reviews`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ flashcardId: currentCard.id, grade })
            });

            if (res.ok) {
                setIsFlipped(false);
                setTimeout(() => {
                    setCurrentIndex(prev => prev + 1);
                    setSubmitting(false);
                }, 300); // Wait for flip animation to reset before changing content
            }
        } catch (error) {
            console.error(error);
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center h-full w-full">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                </div>
            </AppLayout>
        );
    }

    if (flashcards.length === 0 || currentIndex >= flashcards.length) {
        return (
            <AppLayout>
                <div className="p-8 h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center">
                    <div className="bg-indigo-500/10 p-6 rounded-full border border-indigo-500/20 mb-6 relative">
                        <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full"></div>
                        <CheckCircle2 className="w-16 h-16 text-indigo-500 relative z-10" />
                    </div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600 mb-4">
                        Você concluiu suas revisões!
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
                        Não há mais cartões pendentes neste baralho para hoje.
                        O algoritmo SM-2 agendou novas repetições baseadas no seu desempenho.
                    </p>
                    <div className="flex gap-4">
                        <Link href="/flashcards">
                            <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-xl px-8">
                                Voltar aos Baralhos
                            </Button>
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const currentCard = flashcards[currentIndex];
    const progress = Math.round((currentIndex / flashcards.length) * 100);

    return (
        <AppLayout>
            <div className="p-4 md:p-8 h-full flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
                <div className="w-full flex items-center justify-between mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/flashcards')}
                        className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Sair
                    </Button>

                    <div className="flex flex-col items-end">
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">
                            Cartão {currentIndex + 1} de {flashcards.length}
                        </span>
                        <div className="w-32 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Flip Card Container */}
                <div className="scene w-full h-[400px] mb-12 perspective-1000">
                    <div
                        className={`card-inner w-full h-full relative preserve-3d transition-transform duration-700 ${isFlipped ? 'rotate-y-180' : ''}`}
                        onClick={() => !isFlipped && setIsFlipped(true)}
                    >
                        {/* Front Side */}
                        <div className="card-face absolute inset-0 w-full h-full bg-white dark:bg-[#1f2937] border-2 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 cursor-pointer backface-hidden z-20">
                            <div className="absolute top-6 left-6 flex items-center gap-2 text-indigo-500 bg-indigo-500/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-indigo-500/20">
                                <Brain className="w-4 h-4" /> Frente
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 text-center leading-relaxed max-w-2xl">
                                {currentCard.front}
                            </h3>
                            <p className="absolute bottom-6 text-sm text-slate-400 dark:text-slate-500 animate-pulse">
                                Clique para revelar a resposta
                            </p>
                        </div>

                        {/* Back Side */}
                        <div className="card-face absolute inset-0 w-full h-full bg-slate-50 dark:bg-[#171d28] border-2 border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 backface-hidden rotate-y-180 z-10">
                            <div className="absolute top-6 left-6 flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-500/20">
                                <CheckCircle2 className="w-4 h-4" /> Resposta
                            </div>
                            <h3 className="text-xl md:text-2xl font-medium text-slate-700 dark:text-slate-200 text-center leading-relaxed max-w-2xl">
                                {currentCard.back}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Review Controls - Only show when flipped */}
                <div className={`flex gap-4 w-full max-w-2xl transition-all duration-500 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                    <Button
                        onClick={() => handleReview('HARD')}
                        disabled={submitting}
                        className="flex-1 h-14 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 text-lg shadow-sm"
                    >
                        <RefreshCcw className="w-5 h-5 mr-2" />
                        Repetir (Errei)
                    </Button>
                    <Button
                        onClick={() => handleReview('GOOD')}
                        disabled={submitting}
                        className="flex-1 h-14 bg-blue-500 hover:bg-blue-600 text-white border border-blue-600 text-lg shadow-xl shadow-blue-500/20"
                    >
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Bom (Acertei)
                    </Button>
                    <Button
                        onClick={() => handleReview('EASY')}
                        disabled={submitting}
                        className="flex-1 h-14 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-lg shadow-sm"
                    >
                        <Smile className="w-5 h-5 mr-2" />
                        Muito Fácil
                    </Button>
                </div>
            </div>

            {/* Custom CSS for 3D Flip */}
            <style dangerouslySetInnerHTML={{
                __html: `
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}} />
        </AppLayout>
    );
}
