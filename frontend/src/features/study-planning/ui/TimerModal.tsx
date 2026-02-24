import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, X, BrainCircuit, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type TimerModalProps = {
    blockId: string | null;
    subject: string;
    topic: string;
    plannedMinutes: number;
    elapsedSecondsInit?: number;
    onClose: () => void;
    onPause: (elapsedMin: number) => void;
    onComplete: (elapsedMin: number) => void;
};

export function TimerModal({
    blockId,
    subject,
    topic,
    plannedMinutes,
    elapsedSecondsInit = 0,
    onClose,
    onPause,
    onComplete
}: TimerModalProps) {
    const [elapsedSeconds, setElapsedSeconds] = useState(elapsedSecondsInit);
    const [isRunning, setIsRunning] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning) {
            interval = setInterval(() => {
                setElapsedSeconds(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    if (!blockId) return null;

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const progressPercentage = Math.min((elapsedSeconds / (plannedMinutes * 60)) * 100, 100);

    const handlePause = () => {
        setIsRunning(false);
        onPause(Math.floor(elapsedSeconds / 60));
    };

    const handlePlay = () => setIsRunning(true);

    const handleComplete = () => {
        setIsRunning(false);
        onComplete(Math.floor(elapsedSeconds / 60));
    };


    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className={`fixed ${isMinimized ? 'bottom-6 right-6 w-80' : 'bottom-6 left-1/2 -translate-x-1/2 w-[600px]'} z-50`}
            >
                <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden">

                    {/* Progress Background Indicator */}
                    <div
                        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000"
                        style={{ width: `${progressPercentage}%` }}
                    />

                    <div className="flex items-center justify-between gap-4">

                        {/* Info Section */}
                        <div className="flex items-center gap-4 flex-1 overflow-hidden">
                            <div className={`w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 ${isRunning ? 'animate-pulse' : ''}`}>
                                <BrainCircuit className="w-6 h-6 text-blue-400" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest truncate">Sessão de Foco</span>
                                <h3 className="text-white font-bold text-base truncate">{subject}</h3>
                                {!isMinimized && <p className="text-slate-400 text-sm truncate">{topic}</p>}
                            </div>
                        </div>

                        {/* Timer Section */}
                        <div className="flex flex-col items-center justify-center shrink-0 px-4 border-l border-slate-700">
                            <span className="text-3xl font-mono font-bold text-white tracking-widest tabular-nums">
                                {formatTime(elapsedSeconds)}
                            </span>
                            {!isMinimized && (
                                <span className="text-xs text-slate-500 font-medium">
                                    Meta: {plannedMinutes}m
                                </span>
                            )}
                        </div>

                        {/* Controls Section */}
                        <div className="flex items-center gap-2 shrink-0">
                            {isRunning ? (
                                <button onClick={handlePause} className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 flex items-center justify-center transition-colors">
                                    <Pause className="w-5 h-5 fill-current" />
                                </button>
                            ) : (
                                <button onClick={handlePlay} className="w-12 h-12 rounded-full bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/30 flex items-center justify-center transition-colors">
                                    <Play className="w-5 h-5 fill-current translate-x-0.5" />
                                </button>
                            )}

                            <button onClick={handleComplete} className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 hidden sm:flex items-center justify-center transition-colors" title="Finalizar Bloco">
                                <Square className="w-4 h-4 fill-current" />
                            </button>
                        </div>

                        {/* Window Controls */}
                        <div className="absolute top-3 right-3 flex items-center gap-2 opacity-30 hover:opacity-100 transition-opacity">
                            <button onClick={() => setIsMinimized(!isMinimized)} className="text-slate-400 hover:text-white">
                                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                            </button>
                            <button onClick={onClose} className="text-slate-400 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
