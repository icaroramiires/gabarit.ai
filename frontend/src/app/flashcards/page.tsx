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
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="p-10 h-full flex flex-col relative max-w-7xl mx-auto w-full">

                {/* Cabeçalho */}
                <div className="flex items-center justify-between mb-10 flex-shrink-0">
                    <div>
                        <h1 className="text-[28px] font-bold text-foreground mb-2 flex items-center gap-3">
                            <Library className="w-8 h-8 text-primary" />
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
                            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm rounded-full px-6 py-6"
                        >
                            <Sparkles className="w-5 h-5 mr-2" />
                            Gerar com IA
                        </Button>
                    </div>
                </div>

                {/* Lista de Baralhos (Grid) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {decks.length === 0 && (
                        <div className="col-span-full py-12 text-center border-2 border-dashed border-border rounded-[24px]">
                            <Bot className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-foreground">Nenhum Baralho Encontrado</h3>
                            <p className="text-slate-500 text-sm mt-2">Você ainda não gerou ou criou nenhum baralho de revisão.</p>
                        </div>
                    )}

                    {decks.map(deck => (
                        <div key={deck.id} className="bg-card shrink-0 border border-border rounded-[24px] p-8 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 relative overflow-hidden group">

                            <h2 className="text-xl font-bold text-foreground mb-2">{deck.name}</h2>
                            <p className="text-sm text-slate-500 mb-6 line-clamp-2 h-10">
                                {deck.description || "Sem descrição."}
                            </p>

                            <div className="flex items-center gap-3">
                                <Link href={`/flashcards/study/${deck.id}`} className="flex-1">
                                    <Button className="w-full bg-slate-100 text-foreground hover:bg-slate-200 dark:bg-[#33343c] dark:hover:bg-[#3f4049] transition-colors rounded-full py-6 font-bold group/btn shadow-sm">
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
                        <div className="bg-card w-full max-w-2xl rounded-[24px] shadow-2xl overflow-hidden border border-border">
                            <div className="bg-foreground p-8 relative overflow-hidden">
                                <h2 className="text-2xl font-bold text-background mb-2 relative z-10 flex items-center gap-2">
                                    <Bot className="w-6 h-6 text-primary" />
                                    AI Flashcards Generator
                                </h2>
                                <p className="text-background/80 text-sm relative z-10">Cole um trecho do seu resumo e nossa IA extrairá os conceitos principais frente e verso.</p>
                            </div>

                            <div className="p-8">
                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-foreground mb-2">Nome do Baralho</label>
                                    <input
                                        type="text"
                                        value={deckName}
                                        onChange={(e) => setDeckName(e.target.value)}
                                        placeholder="Ex: Direito Constitucional - Direitos Fundamentais"
                                        className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-slate-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-foreground mb-2">Texto Base</label>
                                    <textarea
                                        rows={6}
                                        value={textSource}
                                        onChange={(e) => setTextSource(e.target.value)}
                                        placeholder="Cole seu resumo, texto da lei ou artigo aqui (min. 50 caracteres)..."
                                        className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none custom-scrollbar text-foreground placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            <div className="border-t border-border p-6 bg-card flex justify-end gap-3 rounded-b-[24px]">
                                <Button
                                    variant="outline"
                                    onClick={() => !isGenerating && setIsModalOpen(false)}
                                    disabled={isGenerating}
                                    className="rounded-full px-6"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleGenerateAi}
                                    disabled={isGenerating || textSource.length < 50}
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[160px] rounded-full px-6"
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
