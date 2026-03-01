"use client"

import React, { useState, useEffect } from 'react';
import AppLayout from '@/shared/ui/app-layout';
import { Bot, Plus, Library, Sparkles, Loader2, Play } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';

export default function FlashcardsPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [decks, setDecks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [textSource, setTextSource] = useState("");
    const [deckName, setDeckName] = useState("");

    const fetchDecks = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3001/flashcards/decks`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const payload = await res.json();
            setDecks(payload.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDecks();
    }, []);

    const handleGenerateAi = async () => {
        if (!textSource || textSource.length < 50) {
            alert("O texto precisa ter ao menos 50 caracteres.");
            return;
        }

        setIsGenerating(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3001/flashcards/decks/generate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: deckName || "Resumo Automático", text: textSource })
            });

            if (res.ok) {
                await fetchDecks();
                setIsModalOpen(false);
                setTextSource('');
                setDeckName('');
            } else {
                alert("Erro ao gerar Flashcards pela IA.");
            }
        } catch (error) {
            console.error(error);
            alert("Erro Inesperado.");
        } finally {
            setIsGenerating(false);
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

    return (
        <AppLayout>
            <div className="p-8 h-full flex flex-col relative max-w-7xl mx-auto w-full">

                {/* Cabeçalho */}
                <div className="flex items-center justify-between mb-10 flex-shrink-0">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600 mb-2 flex items-center gap-3">
                            <Library className="w-8 h-8 text-blue-500" />
                            Meus Baralhos (SM-2)
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl">
                            Domine o conteúdo usando o algoritmo de Repetição Espaçada SuperMemo-2.
                            Gere cartões instantaneamente a partir dos seus resumos usando nosso <strong>AI Copilot</strong>.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-900/40 shadow-xl"
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Gerar com IA
                        </Button>
                    </div>
                </div>

                {/* Lista de Baralhos (Grid) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {decks.length === 0 && (
                        <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
                            <Bot className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Nenhum Baralho Encontrado</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Você ainda não gerou ou criou nenhum baralho de revisão.</p>
                        </div>
                    )}

                    {decks.map(deck => (
                        <div key={deck.id} className="bg-white dark:bg-[#1f2937] shrink-0 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 relative overflow-hidden group">

                            {/* Decorative Blur */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/20 transition-all"></div>

                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{deck.name}</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 h-10">
                                {deck.description || "Sem descrição."}
                            </p>

                            <div className="flex items-center gap-3">
                                <Link href={`/flashcards/study/${deck.id}`} className="flex-1">
                                    <Button className="w-full bg-slate-900 hover:bg-blue-600 dark:bg-white dark:text-slate-900 dark:hover:bg-blue-500 transition-colors dark:hover:text-white group/btn">
                                        <Play className="w-4 h-4 mr-2 fill-current group-hover/btn:scale-110 transition-transform" />
                                        Estudar Agora
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal de Geração IA */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-[#1f2937] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-6 relative overflow-hidden">
                                <Sparkles className="absolute -top-4 -right-4 w-32 h-32 text-indigo-500/20 blur-md" />
                                <h2 className="text-2xl font-bold text-white mb-2 relative z-10 flex items-center gap-2">
                                    <Bot className="w-6 h-6 text-indigo-400" />
                                    AI Flashcards Generator
                                </h2>
                                <p className="text-indigo-200/80 text-sm relative z-10">Cole um trecho do seu resumo e nossa IA extrairá os conceitos principais frente e verso.</p>
                            </div>

                            <div className="p-6">
                                <div className="mb-4">
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nome do Baralho</label>
                                    <input
                                        type="text"
                                        value={deckName}
                                        onChange={(e) => setDeckName(e.target.value)}
                                        placeholder="Ex: Direito Constitucional - Direitos Fundamentais"
                                        className="w-full bg-slate-50 dark:bg-[#111827] border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Texto Base</label>
                                    <textarea
                                        rows={6}
                                        value={textSource}
                                        onChange={(e) => setTextSource(e.target.value)}
                                        placeholder="Cole seu resumo, texto da lei ou artigo aqui (min. 50 caracteres)..."
                                        className="w-full bg-slate-50 dark:bg-[#111827] border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none custom-scrollbar dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="border-t border-slate-200 dark:border-slate-800 p-6 bg-slate-50 dark:bg-[#171d28] flex justify-end gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => !isGenerating && setIsModalOpen(false)}
                                    disabled={isGenerating}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleGenerateAi}
                                    disabled={isGenerating || textSource.length < 50}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[160px]"
                                >
                                    {isGenerating ? (
                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Gerando...</>
                                    ) : (
                                        <><Sparkles className="w-4 h-4 mr-2" /> Extrair Flashcards</>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
            {/* Scrollbar Customization */}
            <style dangerouslySetInnerHTML={{
                __html: `
            .custom-scrollbar::-webkit-scrollbar {width: 6px; }
            .custom-scrollbar::-webkit-scrollbar-track {background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb {background: #cbd5e1; border-radius: 10px; }
            .dark .custom-scrollbar::-webkit-scrollbar-thumb {background: #334155; }
            .custom-scrollbar:hover::-webkit-scrollbar-thumb {background: #94a3b8; }
            .dark .custom-scrollbar:hover::-webkit-scrollbar-thumb {background: #475569; }
      `}} />
        </AppLayout>
    );
}
