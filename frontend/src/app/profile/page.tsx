"use client";

import AppLayout from "@/shared/ui/app-layout";
import { useEffect, useState } from "react";
import { useAuth } from "@/core/auth/AuthContext";
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
    { title: "Mestre da Biologia", desc: "Concluiu Genética 100%", icon: <Medal size={24} className="text-yellow-500" />, time: "3h atrás", bg: "bg-yellow-50 dark:bg-yellow-900/20", text: "text-yellow-600 dark:text-yellow-400" },
    { title: "Leitor Voraz", desc: "Leu 50 resumos", icon: <BookOpen size={24} className="text-purple-500" />, time: "Ontem", bg: "bg-purple-50 dark:bg-purple-900/20", text: "text-purple-600 dark:text-purple-400" },
    { title: "Na Mosca", desc: "10 Questões Seguidas", icon: <Target size={24} className="text-green-500" />, time: "2 dias atrás", bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-600 dark:text-green-400" },
    { title: "Velocista", desc: "Simulado em < 2h", icon: <Clock size={24} className="text-blue-500" />, time: "3 dias atrás", bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-600 dark:text-blue-400" },
];

export default function ProfilePage() {
    const { user } = useAuth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [profile, setProfile] = useState<any>(null);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const [profileRes, leaderboardRes] = await Promise.all([
                    fetch(`http://localhost:3001/api/gamification/profile/${user.id}`).then(r => r.json()),
                    fetch(`http://localhost:3001/api/gamification/leaderboard`).then(r => r.json())
                ]);

                if (profileRes.data) setProfile(profileRes.data);
                if (leaderboardRes.data) setLeaderboard(leaderboardRes.data);
            } catch (error) {
                console.error("Error fetching gamification data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    if (loading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center h-full w-full">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
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
            <div className="p-8 pb-20max-w-[1400px] mx-auto space-y-8">
                {/* Header Page */}
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Meu Perfil</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Gerencie seu progresso e estatísticas</p>
                </div>

                {/* Top Grid: Gamification Profile & Leaderboard Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* User Card */}
                    <div className="bg-white dark:bg-[#11141c] rounded-2xl p-6 border border-slate-200 dark:border-[#272e3f] shadow-sm flex flex-col md:flex-row items-center gap-6">
                        <div className="relative shrink-0">
                            {/* Avatar Ring */}
                            <div className="w-28 h-28 rounded-full border-4 border-blue-500 p-1">
                                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name || 'User'}&backgroundColor=e2e8f0`} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                            </div>
                            {/* Level Badge */}
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                                Nível {currentLevel}
                            </div>
                        </div>

                        <div className="flex-1 w-full text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 text-xs font-bold rounded w-fit mx-auto md:mx-0">
                                    <Trophy size={14} /> LIGA DIAMANTE
                                </div>
                                <Medal className="w-10 h-10 text-slate-200 dark:text-slate-800 hidden md:block" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.name || 'Estudante'}</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Medicina • Foco em Biológicas</p>

                            <div className="bg-slate-50 dark:bg-[#171d28] p-4 rounded-xl">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Progresso do Nível</span>
                                    <span className="text-sm font-bold text-orange-600 dark:text-orange-500">{progressPercentage}%</span>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                                    <span>{currentXp} XP Atuais</span>
                                    <span>Próximo: {xpNeededForNextLevel} XP</span>
                                </div>
                                <Progress value={progressPercentage} className="h-2 bg-slate-200 dark:bg-slate-700 [&>div]:bg-orange-500" />
                            </div>
                        </div>
                    </div>

                    {/* Season / Competition Card */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-[#171d28] dark:to-[#11141c] rounded-2xl p-6 border border-orange-100 dark:border-[#272e3f] shadow-sm relative overflow-hidden flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Temporada de Inverno</h3>
                                <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Competição Regional</p>
                            </div>
                            <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm text-orange-500">
                                <Trophy size={20} />
                            </div>
                        </div>

                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <h4 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{globalRank}</h4>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">Ranking Global</p>
                            </div>
                            <div className="text-right">
                                <div className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded mb-1">
                                    Top 5%
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">vs. 1.2k estudantes</p>
                            </div>
                        </div>

                        <div className="bg-white/60 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl py-3 px-6 flex justify-between items-center relative z-10 border border-white/40 dark:border-slate-800">
                            <div className="w-full flex justify-center gap-6">
                                <div className="text-center">
                                    <span className="block text-2xl font-bold text-slate-900 dark:text-white leading-none">04</span>
                                    <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Dias</span>
                                </div>
                                <span className="text-2xl font-bold text-slate-300 dark:text-slate-700">:</span>
                                <div className="text-center">
                                    <span className="block text-2xl font-bold text-slate-900 dark:text-white leading-none">12</span>
                                    <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Hrs</span>
                                </div>
                                <span className="text-2xl font-bold text-slate-300 dark:text-slate-700">:</span>
                                <div className="text-center">
                                    <span className="block text-2xl font-bold text-slate-900 dark:text-white leading-none">45</span>
                                    <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Min</span>
                                </div>
                            </div>
                            {/* Abs timer label */}
                            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-slate-100 dark:bg-slate-800 px-2 text-[10px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 rounded">Termina em</span>
                        </div>
                    </div>
                </div>

                {/* Conquistas Recentes */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            🏆 Conquistas Recentes
                        </h3>
                        <div className="flex gap-2">
                            <button className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                {/* Left Arrow mock */}
                                {"<"}
                            </button>
                            <button className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                {/* Right Arrow mock */}
                                {">"}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {conquistas.map((item, idx) => (
                            <div key={idx} className="bg-white dark:bg-[#11141c] border border-slate-200 dark:border-[#272e3f] rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-sm">
                                <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-[#171d28] shadow-sm flex items-center justify-center mb-4 relative">
                                    <div className="absolute inset-2 rounded-full border-2 border-slate-200 dark:border-slate-800 border-dashed animate-[spin_20s_linear_infinite]"></div>
                                    {item.icon}
                                </div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{item.title}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-3">{item.desc}</p>
                                <span className={`text-[10px] font-bold px-2.5 py-1 ${item.bg} ${item.text} rounded-full`}>
                                    {item.time}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Radar and Recommendation */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Radar Chart */}
                    <div className="lg:col-span-2 bg-white dark:bg-[#11141c] border border-slate-200 dark:border-[#272e3f] rounded-2xl p-6 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Gráfico de Radar de Competências</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Análise de desempenho por área do conhecimento</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1.5 bg-blue-500 text-white text-xs font-bold rounded-full">Geral</button>
                                <button className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium hover:bg-slate-200 transition-colors rounded-full">Natureza</button>
                                <button className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium hover:bg-slate-200 transition-colors rounded-full">Humanas</button>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-8 items-center w-full min-w-0">
                            <div className="w-full md:w-1/2 h-[300px] min-h-[300px] min-w-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                        <PolarGrid stroke="#334155" opacity={0.3} />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                        <Radar name="Desempenho" dataKey="A" stroke="#f97316" strokeWidth={2} fill="#ea580c" fillOpacity={0.4} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="w-full md:w-1/2 space-y-5">
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-4">Detalhamento</h4>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-700 dark:text-slate-300">Biologia <span className="text-orange-500 ml-1 font-medium">(Ponto Forte)</span></span>
                                        <span className="text-orange-600 dark:text-orange-500">90%</span>
                                    </div>
                                    <Progress value={90} className="h-2 bg-slate-100 dark:bg-slate-800 [&>div]:bg-orange-500" />
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-700 dark:text-slate-300">Química</span>
                                        <span className="text-slate-600 dark:text-slate-400">80%</span>
                                    </div>
                                    <Progress value={80} className="h-2 bg-slate-100 dark:bg-slate-800" />
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-700 dark:text-slate-300">Matemática</span>
                                        <span className="text-slate-600 dark:text-slate-400">80%</span>
                                    </div>
                                    <Progress value={80} className="h-2 bg-slate-100 dark:bg-slate-800" />
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-700 dark:text-slate-300">História <span className="text-slate-400 font-medium ml-1">(Foco Sugerido)</span></span>
                                        <span className="text-slate-600 dark:text-slate-400">30%</span>
                                    </div>
                                    <Progress value={30} className="h-2 bg-slate-100 dark:bg-slate-800" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Foco Sugerido */}
                    <div className="bg-[#fff7ed] dark:bg-[#1a1510] border border-orange-200 dark:border-orange-900/50 rounded-2xl p-6 shadow-sm flex flex-col items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Foco Sugerido</h3>
                                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-400 text-sm font-medium leading-relaxed">
                                Baseado no seu gráfico de radar, recomendamos focar em <span className="text-orange-600 font-bold dark:text-orange-500">História</span> hoje para melhorar sua consistência nas competências Humanas.
                            </p>
                        </div>

                        <button className="w-full mt-8 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2">
                            <span>▶</span>
                            <span>Iniciar Treino Personalizado</span>
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

