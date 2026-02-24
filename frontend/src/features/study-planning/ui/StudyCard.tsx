import { Sparkles, Clock, CheckCircle2, MoreHorizontal } from "lucide-react";
import { Progress } from "@/shared/ui/progress";
import { Button } from "@/shared/ui/button";

type StudyCardProps = {
    subject: string;
    topic: string;
    type: "TEORIA" | "QUESTÕES" | "REVISÃO";
    status: "pending" | "progress" | "completed";
    progress?: number;
    isAiOptimized?: boolean;
    isLate?: boolean;
    timeInfo?: string;
    score?: number;
    onStart?: () => void;
};

export function StudyCard({
    subject,
    topic,
    type,
    status,
    progress = 0,
    isAiOptimized,
    isLate,
    timeInfo,
    score,
    onStart
}: StudyCardProps) {

    const baseClasses = "relative w-full rounded-2xl p-5 border bg-white dark:bg-[#171d28] transition-all overflow-hidden flex flex-col gap-3 group";

    // Status Variants
    const statusStyles = {
        pending: "border-slate-200 dark:border-[#272e3f] shadow-sm hover:shadow-md",
        progress: "border-blue-500 shadow-md shadow-blue-500/10 dark:shadow-blue-900/20 ring-1 ring-blue-500",
        completed: "border-emerald-200/50 bg-emerald-50/30 dark:border-emerald-900/30 dark:bg-[#131b23] opacity-80",
    };

    // Type Badges
    const typeStyles = {
        TEORIA: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
        QUESTÕES: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        REVISÃO: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    };

    return (
        <div className={`${baseClasses} ${statusStyles[status]}`}>

            {/* Top Badges Row */}
            <div className="flex items-center justify-between z-10">
                <div className="flex gap-2">
                    {isAiOptimized && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 text-[10px] font-bold tracking-wide uppercase">
                            <Sparkles className="w-3 h-3" />
                            AI Otimizado
                        </div>
                    )}

                    {isLate && status === 'pending' && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 text-[10px] font-bold tracking-wide uppercase">
                            Atrasado
                        </div>
                    )}

                    {status === 'completed' && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] font-bold tracking-wide uppercase">
                            <CheckCircle2 className="w-3 h-3" />
                            Finalizado
                        </div>
                    )}
                </div>

                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1.5 z-10 mt-1">
                <h3 className={`font-bold text-base leading-tight ${status === 'completed' ? 'text-slate-600 dark:text-slate-400 line-through decoration-slate-300 dark:decoration-slate-700' : 'text-slate-900 dark:text-white'}`}>
                    {subject}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {topic}
                </p>
            </div>

            {/* Bottom Area */}
            <div className="mt-auto pt-3 z-10">
                {status === 'progress' ? (
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-500 dark:text-slate-400">Progresso da Meta</span>
                            <span className="text-blue-600 dark:text-blue-400">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <Progress value={progress} className="h-2" />
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                onStart?.();
                            }}
                            size="sm"
                            className="w-full mt-3 text-xs font-bold py-1 h-9 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 border-0 shadow-md shadow-blue-500/20"
                        >
                            ▶ Continuar Estudo
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${typeStyles[type]}`}>
                            {type}
                        </span>

                        {status === 'pending' && timeInfo && (
                            <span className={`text-xs font-semibold flex items-center gap-1 ${isLate ? 'text-red-500' : 'text-slate-400'}`}>
                                {isLate && <Clock className="w-3.5 h-3.5" />}
                                {timeInfo}
                            </span>
                        )}

                        {status === 'completed' && score !== undefined && (
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md">
                                Score: {score}%
                            </span>
                        )}
                        {status === 'completed' && score === undefined && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        )}
                    </div>
                )}
            </div>

            {/* Background glow for progress */}
            {status === 'progress' && (
                <div className="absolute top-0 right-0 -m-8 w-32 h-32 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
            )}
        </div>
    );
}
