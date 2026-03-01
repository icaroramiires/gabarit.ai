"use client";

import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    TrendingUp,
    Target,
    FileText,
    ChevronRight,
    Download,
    BrainCircuit,
    History as HistoryIcon
} from 'lucide-react';
import {
    ResponsiveContainer,
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Area,
    AreaChart
} from 'recharts';
import AppLayout from '@/shared/ui/app-layout';

export default function PerformancePage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3001/api/performance/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error('Falha ao buscar estatísticas', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        setDownloading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3001/api/performance/report/pdf', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Relatorio-GabaritAI-${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Falha no download', error);
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                </div>
            </AppLayout>
        );
    }

    // Prepare data for Radar Chart
    const radarData = stats?.quizzes?.weekly?.map((s: any) => ({
        subject: s.subjectName,
        A: Math.round(s.accuracyRate * 100),
        fullMark: 100,
    })) || [];

    // Prepare data for Line Chart
    const lineData = stats?.quizzes?.history?.map((h: any) => ({
        date: h.date.split('-').slice(1).reverse().join('/'),
        accuracy: Math.round((h.correctAnswers / h.totalAnswered) * 100),
    })) || [];

    return (
        <AppLayout>
            <div className="space-y-8 animate-in fade-in duration-700">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <BarChart3 className="text-indigo-400 h-8 w-8" />
                            Análise de Desempenho
                        </h1>
                        <p className="text-slate-400 mt-2">Visão detalhada do seu progresso e áreas de melhoria.</p>
                    </div>

                    <button
                        onClick={handleDownloadPDF}
                        disabled={downloading}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20"
                    >
                        {downloading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                            <Download size={20} />
                        )}
                        Exportar Relatório PDF
                    </button>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KpiCard
                        title="Acerto Global"
                        value={`${(stats?.quizzes?.globalAccuracy * 100).toFixed(1)}%`}
                        icon={<Target className="text-emerald-400" />}
                        trend="+2.5%"
                    />
                    <KpiCard
                        title="Questões Respondidas"
                        value={stats?.quizzes?.history?.reduce((acc: any, curr: any) => acc + curr.totalAnswered, 0) || 0}
                        icon={<FileText className="text-blue-400" />}
                    />
                    <KpiCard
                        title="Duração Média"
                        value="42 min"
                        icon={<TrendingUp className="text-indigo-400" />}
                    />
                    <KpiCard
                        title="Reviews Flashcard"
                        value={stats?.flashcards?.totalReviews || 0}
                        icon={<BrainCircuit className="text-purple-400" />}
                    />
                </div>

                {/* Main Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Radar Chart - Accuracy by Subject */}
                    <div className="bg-[#161B22]/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Target size={20} className="text-indigo-400" />
                                Aproveitamento por Disciplina
                            </h3>
                        </div>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid stroke="#334155" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar
                                        name="Desempenho"
                                        dataKey="A"
                                        stroke="#818cf8"
                                        fill="#818cf8"
                                        fillOpacity={0.6}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#161B22', borderColor: '#334155', borderRadius: '12px' }}
                                        itemStyle={{ color: '#f8fafc' }}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Area Chart - Progress over time */}
                    <div className="bg-[#161B22]/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <HistoryIcon size={20} className="text-indigo-400" />
                                Evolução Semanal (Taxa de Acerto)
                            </h3>
                        </div>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={lineData}>
                                    <defs>
                                        <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 100]} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#161B22', borderColor: '#334155', borderRadius: '12px' }}
                                        itemStyle={{ color: '#f8fafc' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="accuracy"
                                        stroke="#818cf8"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorAcc)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Detailed Table Placeholder / Next Actions */}
                <div className="bg-[#161B22]/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
                    <h3 className="text-xl font-bold mb-6">Sugestões de Foco baseadas em IA</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { subj: "Direito Constitucional", status: "Alerta", color: "text-amber-400" },
                            { subj: "Português", status: "Excelente", color: "text-emerald-400" },
                            { subj: "Matemática", status: "Recuperação", color: "text-rose-400" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-slate-800">
                                <span className="font-medium">{item.subj}</span>
                                <span className={`text-sm font-bold ${item.color}`}>{item.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function KpiCard({ title, value, icon, trend }: { title: string, value: any, icon: any, trend?: string }) {
    return (
        <div className="bg-[#161B22]/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="p-3 bg-slate-800/50 rounded-2xl">{icon}</div>
                {trend && (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <p className="text-slate-400 text-sm font-medium">{title}</p>
                <h4 className="text-2xl font-bold text-white mt-1">{value}</h4>
            </div>
        </div>
    );
}
