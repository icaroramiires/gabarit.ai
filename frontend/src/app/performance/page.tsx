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
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
            <div className="p-10 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-700">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-[28px] font-bold text-foreground flex items-center gap-3">
                            <BarChart3 className="text-primary h-8 w-8" />
                            Análise de Desempenho
                        </h1>
                        <p className="text-slate-500 mt-2">Visão detalhada do seu progresso e áreas de melhoria.</p>
                    </div>

                    <button
                        onClick={handleDownloadPDF}
                        disabled={downloading}
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground px-6 py-3 rounded-full font-bold transition-all shadow-sm"
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
                        icon={<Target className="text-emerald-500" />}
                        trend="+2.5%"
                    />
                    <KpiCard
                        title="Questões Respondidas"
                        value={stats?.quizzes?.history?.reduce((acc: any, curr: any) => acc + curr.totalAnswered, 0) || 0}
                        icon={<FileText className="text-blue-500" />}
                    />
                    <KpiCard
                        title="Duração Média"
                        value="42 min"
                        icon={<TrendingUp className="text-indigo-500" />}
                    />
                    <KpiCard
                        title="Reviews Flashcard"
                        value={stats?.flashcards?.totalReviews || 0}
                        icon={<BrainCircuit className="text-purple-500" />}
                    />
                </div>

                {/* Main Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Radar Chart - Accuracy by Subject */}
                    <div className="bg-card border border-border rounded-[24px] p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
                                <Target size={20} className="text-primary" />
                                Aproveitamento por Disciplina
                            </h3>
                        </div>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid stroke="#e2e8f0" strokeOpacity={0.4} />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar
                                        name="Desempenho"
                                        dataKey="A"
                                        stroke="#10b981"
                                        fill="#10b981"
                                        fillOpacity={0.6}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px' }}
                                        itemStyle={{ color: 'var(--foreground)' }}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Area Chart - Progress over time */}
                    <div className="bg-card border border-border rounded-[24px] p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
                                <HistoryIcon size={20} className="text-primary" />
                                Evolução Semanal (Taxa de Acerto)
                            </h3>
                        </div>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={lineData}>
                                    <defs>
                                        <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} vertical={false} />
                                    <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 100]} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px' }}
                                        itemStyle={{ color: 'var(--foreground)' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="accuracy"
                                        stroke="#10b981"
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
                <div className="bg-card border border-border rounded-[24px] p-8 shadow-sm">
                    <h3 className="text-xl font-bold mb-6 text-foreground">Sugestões de Foco baseadas em IA</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { subj: "Direito Constitucional", status: "Alerta", color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-500/10" },
                            { subj: "Português", status: "Excelente", color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-500/10" },
                            { subj: "Matemática", status: "Recuperação", color: "text-rose-500", bg: "bg-rose-100 dark:bg-rose-500/10" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#18191d] rounded-[16px] border border-border">
                                <span className="font-bold text-foreground text-sm">{item.subj}</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded-md ${item.color} ${item.bg}`}>{item.status}</span>
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
        <div className="bg-card border border-border rounded-[24px] p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="p-3 bg-slate-100 dark:bg-[#33343c] rounded-[14px]">
                    {icon}
                </div>
                {trend && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-1 rounded-full">
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <p className="text-slate-500 text-sm font-semibold mb-1">{title}</p>
                <h4 className="text-[32px] leading-none font-bold text-foreground">{value}</h4>
            </div>
        </div>
    );
}
