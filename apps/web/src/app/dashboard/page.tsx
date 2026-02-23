"use client"

import { useEffect } from "react"
import { useNextSessions, useDashboardStats, useAIExplain } from "@/hooks/use-study"
import { useTelemetry } from "@/hooks/use-telemetry"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    CheckCircle2,
    Clock,
    Flame,
    Trophy,
    Loader2,
    TrendingUp,
    Sparkles
} from "lucide-react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts"
import { motion, Variants } from "framer-motion"
import { fireConfetti } from "@/lib/confetti"

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export default function DashboardPage() {
    const { data: sessions, isLoading: isLoadingSessions } = useNextSessions()
    const { data: statsData, isLoading: isLoadingStats } = useDashboardStats()
    const { trackEvent } = useTelemetry()

    useEffect(() => {
        if (statsData) {
            // Recompensa visual premium ao carregar o dashboard
            fireConfetti()

            // Dispara log de telemetria
            trackEvent("DASHBOARD_VIEW", {
                has_stats: !!statsData,
                accuracy: statsData.accuracy_rate
            })
        }
    }, [statsData])

    const stats = [
        {
            title: "Horas Líquidas",
            value: `${statsData?.total_hours || 0}h`,
            description: "Acumulado total",
            icon: Clock,
            color: "text-blue-500",
        },
        {
            title: "Taxa de Acerto",
            value: `${statsData?.accuracy_rate || 0}%`,
            description: "Média histórica",
            icon: CheckCircle2,
            color: "text-green-500",
        },
        {
            title: "Ofensiva",
            value: `${statsData?.streak || 0} Dias`,
            description: "Dias seguidos",
            icon: Flame,
            color: "text-orange-500",
        },
        {
            title: "Posição Global",
            value: `#${statsData?.position || "---"}`,
            description: "Ranking gabaritador",
            icon: Trophy,
            color: "text-yellow-500",
        },
    ]

    const { mutate: askAi, isPending: isAiPending, data: aiData } = useAIExplain()

    return (
        <motion.div
            className="flex flex-col gap-6 py-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* ... stat cards (unchanged, will be replaced up to line 128 which I shouldn't replace all if I just want to append to the end. I should use `multi_replace_file_content` or just replace the end of the return statement.) */}
                {stats.map((stat, i) => (
                    <motion.div key={stat.title} variants={itemVariants}>
                        <Card className="bg-background/60 backdrop-blur-xl border-border/50 shadow-sm transition-shadow hover:shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {isLoadingStats ? <Loader2 className="h-4 w-4 animate-spin" /> : stat.value}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <motion.div variants={itemVariants} className="col-span-4">
                    <Card className="bg-background/60 backdrop-blur-xl border-border/50 shadow-sm h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                Evolução de Desempenho
                            </CardTitle>
                            <CardDescription>
                                Sua taxa de acerto nos últimos 30 dias.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            {isLoadingStats ? (
                                <div className="flex items-center justify-center h-full">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={statsData?.chart_data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                                        <XAxis
                                            dataKey="date"
                                            hide
                                        />
                                        <YAxis
                                            domain={[0, 100]}
                                            tick={{ fontSize: 12 }}
                                            axisLine={false}
                                            tickLine={false}
                                            tickFormatter={(value) => `${value}%`}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 600 }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="accuracy"
                                            name="Taxa de Acerto"
                                            stroke="hsl(var(--primary))"
                                            fillOpacity={1}
                                            fill="url(#colorAccuracy)"
                                            strokeWidth={3}
                                            activeDot={{ r: 6, strokeWidth: 0 }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants} className="col-span-3">
                    <Card className="bg-background/60 backdrop-blur-xl border-border/50 shadow-sm h-full">
                        <CardHeader>
                            <CardTitle>Próximas Disciplinas</CardTitle>
                            <CardDescription>
                                Baseado no seu ciclo de estudos.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoadingSessions ? (
                                <div className="flex justify-center p-8">
                                    <Loader2 className="animate-spin text-primary" />
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead>Matéria</TableHead>
                                            <TableHead className="text-right">Intervalo</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sessions?.map((session: any) => (
                                            <TableRow key={session.id} className="transition-colors hover:bg-muted/50">
                                                <TableCell>
                                                    <div className="font-medium">{session.topic_id}</div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Badge variant="secondary" className="font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                                                        {session.interval} dias
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {(!sessions || sessions.length === 0) && (
                                            <TableRow>
                                                <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                                                    Nenhuma sessão disponível.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <motion.div variants={itemVariants} className="mt-2">
                <Card className="bg-background/60 backdrop-blur-xl border-border/50 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-indigo-500" />
                            Tutor IA Local (Ollama)
                        </CardTitle>
                        <CardDescription>
                            Teste a geração de explicações pedagógicas usando o modelo qwen2.5 (ou llama3) local.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                            onClick={() => askAi({
                                question: "Por que o número pi é irracional?",
                                userAnswer: "Porque ele é um número muito grande e infinito.",
                                correctAnswer: "Porque ele não pode ser representado como uma simples fração de dois números inteiros."
                            })}
                            disabled={isAiPending}
                        >
                            {isAiPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            Simular Resposta Errada e Testar IA Socrática
                        </Button>

                        {aiData?.explanation && (
                            <div className="mt-6 p-5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-sm leading-relaxed whitespace-pre-wrap text-foreground shadow-inner">
                                {aiData.explanation}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

        </motion.div>
    )
}
