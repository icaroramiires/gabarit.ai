"use client";

import React, { useState, useEffect } from 'react';
import AppLayout from '@/shared/ui/app-layout';
import { useAuth } from '@/core/auth/AuthContext';
import { Medal, Trophy, BookOpen, Target, Clock, Loader2, ArrowRight } from "lucide-react";
import { Progress } from "@/shared/ui/progress";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

const radarData = [
    { subject: 'Biologia', A: 90, fullMark: 100 },
    { subject: 'Química', A: 80, fullMark: 100 },
    { subject: 'Física', A: 50, fullMark: 100 },
    { subject: 'Matemática', A: 80, fullMark: 100 },
    { subject: 'História', A: 30, fullMark: 100 },
    { subject: 'Geografia', A: 65, fullMark: 100 },
];

const conquistas = [
    { title: "Mestre da Biologia", desc: "Concluiu Genética 100%", icon: <Medal size={24} className="text-amber-500" />, time: "3h atrás", bg: "bg-amber-100 dark:bg-amber-500/20", text: "text-amber-600 dark:text-amber-400" },
    { title: "Leitor Voraz", desc: "Leu 50 resumos", icon: <BookOpen size={24} className="text-purple-500" />, time: "Ontem", bg: "bg-purple-100 dark:bg-purple-500/20", text: "text-purple-600 dark:text-purple-400" },
    { title: "Na Mosca", desc: "10 Questões Seguidas", icon: <Target size={24} className="text-primary" />, time: "2 dias atrás", bg: "bg-primary/20", text: "text-primary" },
    { title: "Velocista", desc: "Simulado em < 2h", icon: <Clock size={24} className="text-blue-500" />, time: "3 dias atrás", bg: "bg-blue-100 dark:bg-blue-500/20", text: "text-blue-600 dark:text-blue-400" },
];

export default function ProfilePage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const [profileRes, leaderboardRes] = await Promise.all([
                    fetch(`http://localhost:3001/api/gamification/profile/${user.id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch('http://localhost:3001/api/gamification/leaderboard', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                const pData = await profileRes.json();
                const lData = await leaderboardRes.json();

                if (pData.data) setProfile(pData.data);
                if (lData.data) setLeaderboard(lData.data);
            } catch (error) {
                console.error('Falha ao buscar dados', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [user]);

    if (loading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </AppLayout>
        );
    }

    const currentRankIdx = leaderboard.findIndex(p => p.userId === user?.id);
    const globalRank = currentRankIdx >= 0 ? `#${currentRankIdx + 1}` : '#--';

    // Calcula Progresso do Level (Baseado no calculo do back: 1 nivel a cada 100 XP)
    const currentXp = profile?.xp || 0;
    const currentLevel = profile?.level || 1;
    const xpBaseForCurrentLevel = (currentLevel - 1) * 100;
    const xpNeededForNextLevel = currentLevel * 100;
    const progressPercentage = Math.round(((currentXp - xpBaseForCurrentLevel) / 100) * 100);

    return (
        <AppLayout>
            <div className="p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
                {/* Header Page */}
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-1">Meu Perfil</h1>
                    <p className="text-slate-500 text-sm">Gerencie seu progresso e estatísticas</p>
                </div>

                {/* Top Grid: Gamification Profile & Leaderboard Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* User Card */}
                    <div className="bg-card rounded-[24px] p-8 border border-border shadow-sm flex flex-col md:flex-row items-center gap-6">
                        <div className="relative shrink-0">
                            {/* Avatar Ring */}
                            <div className="w-32 h-32 rounded-full border-4 border-primary p-1 bg-slate-100 dark:bg-muted">
                                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name || 'User'}&backgroundColor=e2e8f0`} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                            </div>
                            {/* Level Badge */}
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs font-bold px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                                Nível {currentLevel}
                            </div>
                        </div>

                        <div className="flex-1 w-full text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400 text-xs font-bold rounded-full w-fit mx-auto md:mx-0">
                                    <Trophy size={14} /> LIGA DIAMANTE
                                </div>
                                <Medal className="w-10 h-10 text-slate-200 dark:text-slate-800 hidden md:block" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">{user?.name || 'Estudante'}</h2>
                            <p className="text-sm text-slate-500 mb-6 font-medium">Medicina • Foco em Biológicas</p>

                            <div className="bg-slate-50 dark:bg-muted p-5 rounded-[16px] border border-border">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm font-semibold text-foreground">Progresso do Nível</span>
                                    <span className="text-sm font-bold text-primary">{progressPercentage}%</span>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500 font-bold mb-3">
                                    <span>{currentXp} XP Atuais</span>
                                    <span>Próximo: {xpNeededForNextLevel} XP</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className="bg-primary h-2.5 rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${progressPercentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Season / Competition Card */}
                    <div className="bg-gradient-to-br from-primary/10 to-transparent rounded-[24px] p-8 border border-primary/20 shadow-sm relative overflow-hidden flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-foreground">Temporada de Inverno</h3>
                                <p className="text-sm text-primary font-bold">Competição Regional</p>
                            </div>
                            <div className="w-12 h-12 bg-card rounded-full flex items-center justify-center shadow-sm text-primary">
                                <Trophy size={20} />
                            </div>
                        </div>

                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h4 className="text-5xl font-black text-foreground tracking-tighter">{globalRank}</h4>
                                <p className="text-sm font-bold text-slate-500 mt-1">Ranking Global</p>
                            </div>
                            <div className="text-right">
                                <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-xs font-bold rounded-full mb-1">
                                    Top 5%
                                </div>
                                <p className="text-xs text-slate-500 font-medium">vs. 1.2k estudantes</p>
                            </div>
                        </div>

                        <div className="bg-card/80 backdrop-blur-md rounded-[16px] py-4 px-6 flex justify-between items-center relative z-10 border border-border shadow-sm">
                            <div className="w-full flex justify-center gap-6">
                                <div className="text-center">
                                    <span className="block text-2xl font-bold text-foreground leading-none">04</span>
                                    <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Dias</span>
                                </div>
                                <span className="text-2xl font-bold text-slate-300 dark:text-slate-700">:</span>
                                <div className="text-center">
                                    <span className="block text-2xl font-bold text-foreground leading-none">12</span>
                                    <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Hrs</span>
                                </div>
                                <span className="text-2xl font-bold text-slate-300 dark:text-slate-700">:</span>
                                <div className="text-center">
                                    <span className="block text-2xl font-bold text-foreground leading-none">45</span>
                                    <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Min</span>
                                </div>
                            </div>
                            {/* Abs timer label */}
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-card border border-border px-3 py-0.5 text-[10px] font-bold tracking-widest uppercase text-primary rounded-full shadow-sm">Termina em</span>
                        </div>
                    </div>
                </div>

                {/* Conquistas Recentes */}
                <div className="pt-4">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                            🏆 Conquistas Recentes
                        </h3>
                        <div className="flex gap-2">
                            <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-slate-400 hover:text-foreground bg-card hover:bg-slate-50 dark:hover:bg-muted transition-colors shadow-sm">
                                {/* Left Arrow mock */}
                                {"<"}
                            </button>
                            <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-slate-400 hover:text-foreground bg-card hover:bg-slate-50 dark:hover:bg-muted transition-colors shadow-sm">
                                {/* Right Arrow mock */}
                                {">"}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {conquistas.map((item, idx) => (
                            <div key={idx} className="bg-card border border-border rounded-[24px] p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-muted flex items-center justify-center mb-5 relative shrink-0">
                                    <div className="absolute inset-2 rounded-full border-2 border-slate-200 dark:border-slate-700 border-dashed animate-[spin_20s_linear_infinite]"></div>
                                    {item.icon}
                                </div>
                                <h4 className="font-bold text-foreground text-sm mb-1">{item.title}</h4>
                                <p className="text-xs text-slate-500 font-medium mb-4">{item.desc}</p>
                                <span className={`text-[10px] font-bold px-3 py-1 ${item.bg} ${item.text} rounded-full`}>
                                    {item.time}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Radar and Recommendation */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
                    {/* Radar Chart */}
                    <div className="lg:col-span-2 bg-card border border-border rounded-[24px] p-8 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-foreground">Desempenho por Área</h3>
                                <p className="text-sm text-slate-500 font-medium">Análise de competências detalhada</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-sm">Geral</button>
                                <button className="px-4 py-2 bg-slate-100 dark:bg-muted text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors rounded-full">Natureza</button>
                                <button className="px-4 py-2 bg-slate-100 dark:bg-muted text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors rounded-full">Humanas</button>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-8 items-center w-full min-w-0">
                            <div className="w-full md:w-1/2 h-[350px] min-h-[350px] min-w-0 bg-slate-50 dark:bg-muted rounded-[24px] border border-border">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                        <PolarGrid stroke="#e2e8f0" strokeOpacity={0.4} />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                        <Radar name="Desempenho" dataKey="A" stroke="#10b981" strokeWidth={2} fill="#10b981" fillOpacity={0.4} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="w-full md:w-1/2 space-y-6">
                                <h4 className="font-bold text-foreground text-sm mb-4">Detalhamento</h4>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-foreground">Biologia <span className="text-primary ml-1 font-bold">(Ponto Forte)</span></span>
                                        <span className="text-primary">90%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-muted rounded-full h-2.5">
                                        <div className="bg-primary h-2.5 rounded-full" style={{ width: '90%' }}></div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-foreground">Química</span>
                                        <span className="text-slate-500">80%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-muted rounded-full h-2.5">
                                        <div className="bg-slate-400 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-foreground">Matemática</span>
                                        <span className="text-slate-500">80%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-muted rounded-full h-2.5">
                                        <div className="bg-slate-400 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-foreground">História <span className="text-amber-500 font-bold ml-1">(Foco Sugerido)</span></span>
                                        <span className="text-amber-500">30%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-muted rounded-full h-2.5">
                                        <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '30%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Foco Sugerido */}
                    <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-[24px] p-8 shadow-sm flex flex-col items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-xl font-bold text-amber-900 dark:text-amber-400">Foco Sugerido</h3>
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                            </div>
                            <p className="text-amber-800/80 dark:text-amber-200/80 text-sm font-medium leading-relaxed">
                                Baseado no seu gráfico de radar, recomendamos focar em <span className="text-amber-600 font-bold dark:text-amber-400">História</span> hoje para melhorar sua consistência nas competências Humanas.
                            </p>
                        </div>

                        <button className="w-full mt-8 bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-4 rounded-[16px] transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 hover:-translate-y-0.5">
                            <span>▶</span>
                            <span>Iniciar Treino Personalizado</span>
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
