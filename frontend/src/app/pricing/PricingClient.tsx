'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/core/auth/AuthContext';
import { useSubscription } from '@/core/auth/SubscriptionContext';
import { Check, Sparkles, AlertCircle, ArrowRight, ShieldCheck, Zap, Lock } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function PricingClient() {
    const { user } = useAuth();
    const { isPro, refreshSubscription } = useSubscription();
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        const success = searchParams.get('success');
        const canceled = searchParams.get('canceled');

        if (success === 'true') {
            setStatusMessage({ type: 'success', text: 'Assinatura confirmada com sucesso! Bem-vindo ao Pro. 🎉' });
            localStorage.setItem('@gabarit:mockPro', 'true');
            refreshSubscription();
        } else if (canceled === 'true') {
            setStatusMessage({ type: 'error', text: 'Checkout cancelado. Nenhuma cobrança foi efetuada.' });
        }
    }, [searchParams, refreshSubscription]);

    const handleCheckout = async () => {
        if (!user) return;
        setIsLoading(true);

        try {
            const res = await fetch('http://localhost:3001/api/checkout/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id }),
            });

            if (!res.ok) throw new Error('Falha ao instanciar Stripe Checkout Sessão');

            const data = await res.json();
            if (data.sessionUrl) {
                window.location.href = data.sessionUrl;
            } else {
                throw new Error('URL da sessão não recebida do servidor.');
            }
        } catch (error) {
            console.error('Error proceeding to checkout', error);
            alert("Erro provisório ao abrir o gateway Stripe. Tente novamente.");
            setIsLoading(false);
        }
    };

    return (
        <div className="relative w-full max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1000px] pointer-events-none -z-10">
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen opacity-50"></div>
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] mix-blend-screen opacity-40"></div>
            </div>

            <div className="text-center mb-16 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6 shadow-sm shadow-blue-500/10">
                    <Sparkles className="w-4 h-4" />
                    <span>Alcance a Aprovação Mais Rápido</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
                    Eleve seus estudos ao <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Próximo Nível</span>
                </h1>
                <p className="mt-6 text-xl text-slate-400 max-w-2xl mx-auto font-medium">
                    Escolha o plano ideal e junte-se aos concurseiros que estão hackeando a aprovação com Inteligência Artificial.
                </p>

                {statusMessage && (
                    <div className={`mx-auto mt-8 inline-flex items-center p-4 rounded-xl text-sm font-medium backdrop-blur-md shadow-2xl ${statusMessage.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
                        {statusMessage.type === 'success' ? <ShieldCheck className="w-5 h-5 mr-3" /> : <AlertCircle className="w-5 h-5 mr-3" />}
                        {statusMessage.text}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto relative z-10">
                {/* Plano Essencial */}
                <div className="bg-slate-900/60 backdrop-blur-xl rounded-[2rem] p-10 border border-slate-700/50 flex flex-col hover:border-slate-600/50 transition-colors shadow-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-slate-800 rounded-lg">
                            <Zap className="w-6 h-6 text-slate-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white tracking-wide">Essencial</h3>
                    </div>
                    <p className="text-slate-400 mb-8 mt-2 font-medium">Para quem está construindo a base de conhecimento.</p>

                    <div className="mb-8 pb-8 border-b border-slate-800 flex items-baseline">
                        <span className="text-5xl font-extrabold text-white">Grátis</span>
                        <span className="text-slate-500 ml-2 font-medium">para sempre</span>
                    </div>

                    <ul className="space-y-5 mb-10 flex-1">
                        {[
                            'Acesso ao edital base completo',
                            '10 Simulados por dia',
                            '5 Interações com AI Tutor',
                            'Cronograma Estático',
                            'Ranking Geral (Visualização)'
                        ].map((feature, i) => (
                            <li key={i} className="flex items-start">
                                <div className="mt-0.5 p-1 bg-slate-800 rounded-full mr-4 shrink-0">
                                    <Check className="w-3.5 h-3.5 text-slate-300" />
                                </div>
                                <span className="text-slate-300 font-medium">{feature}</span>
                            </li>
                        ))}
                    </ul>

                    <button
                        disabled
                        className="w-full py-4 rounded-xl font-bold text-slate-400 bg-slate-800/50 border border-slate-700/50 cursor-not-allowed transition-colors"
                    >
                        Seu Plano Atual
                    </button>
                </div>

                {/* Plano Premium (Pro) */}
                <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-[2rem] p-10 border-2 border-blue-500/50 flex flex-col shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] transform md:-translate-y-4 hover:shadow-[0_0_60px_-10px_rgba(59,130,246,0.4)] transition-all duration-300">
                    <div className="absolute -top-4 inset-x-0 flex justify-center">
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold uppercase tracking-widest py-1.5 px-4 rounded-full flex items-center shadow-lg shadow-blue-500/25 border border-blue-400/30">
                            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                            Recomendado
                        </span>
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
                            <ShieldCheck className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white tracking-wide">Pro Aceleração</h3>
                    </div>
                    <p className="text-blue-200/70 mb-8 mt-2 font-medium">Desbloqueie seu potencial máximo de retenção.</p>

                    <div className="mb-8 pb-8 border-b border-slate-800 flex items-baseline">
                        <span className="text-5xl font-extrabold text-white">R$ 29</span>
                        <span className="text-xl text-slate-400 ml-2 font-medium">/mês</span>
                    </div>

                    <ul className="space-y-5 mb-10 flex-1">
                        {[
                            'Simulados ilimitados',
                            'Acesso Ilimitado ao AI Tutor',
                            'Cronograma Adaptativo (Machine Learning)',
                            'Flashcards & Spaced Repetition (Em Breve)',
                            'Ranking Ativo e Disputa de Medalhas',
                            'Suporte Prioritário'
                        ].map((feature, i) => (
                            <li key={i} className="flex items-start">
                                <div className="mt-0.5 p-1 bg-blue-500/20 rounded-full mr-4 shrink-0 border border-blue-500/30">
                                    <Check className="w-3.5 h-3.5 text-blue-400" />
                                </div>
                                <span className="text-slate-100 font-medium">{feature}</span>
                            </li>
                        ))}
                    </ul>

                    {isPro ? (
                        <button
                            disabled
                            className="w-full py-4 rounded-xl font-bold text-green-400 bg-green-500/10 border border-green-500/30 cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <ShieldCheck className="w-5 h-5" />
                            Assinatura Ativa 🎉
                        </button>
                    ) : (
                        <button
                            onClick={handleCheckout}
                            disabled={isLoading}
                            className={`w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] group flex justify-center items-center gap-2 ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {isLoading ? 'Redirecionando...' : (
                                <>
                                    Assinar Agora
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    )}
                    <p className="text-center text-xs text-slate-500 mt-5 flex items-center justify-center gap-1.5 font-medium">
                        <Lock className="w-3 h-3" /> Pagamento 100% seguro via Stripe. Cancele quando quiser.
                    </p>
                </div>
            </div>
        </div>
    );
}
