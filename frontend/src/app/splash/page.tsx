"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Check, Loader2, CalendarRange } from 'lucide-react';

export default function SplashPage() {
    const [step, setStep] = useState(1);

    useEffect(() => {
        // Simulator for the onboarding progress
        const t1 = setTimeout(() => setStep(2), 2000);
        const t2 = setTimeout(() => setStep(3), 4500);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        }
    }, []);

    return (
        <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTEwIDEwaC0xdjBoMXYwaDF2MGMwIC0xIC0xMDAgLTEtMTAwIHptLS01LTRWMHptNS0tNXYtem01LS01djF6IiBmaWxsPSJub25lIiBzdHJva2U9IiMzYjgyZjYiIHN0cm9rZS1vcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')]">

            <div className="w-full max-w-2xl flex flex-col items-center z-10">

                {/* Animated Icon */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="relative mb-6"
                >
                    <div className="w-24 h-24 bg-blue-100 dark:bg-blue-600/20 rounded-2xl flex items-center justify-center transform rotate-3">
                        <GraduationCap className="w-12 h-12 text-blue-600 dark:text-blue-500" />
                    </div>
                    <motion.div
                        animate={{
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-4 -right-4 text-amber-400"
                    >
                        ✨
                    </motion.div>
                </motion.div>

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
                        Gabarit<span className="text-blue-600">AI</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 font-medium tracking-wide">
                        Planejamento inteligente para sua aprovação.
                    </p>
                </motion.div>

                {/* Progress Stepper */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="w-full max-w-lg relative"
                >
                    {/* Progress Bar Background */}
                    <div className="absolute top-4 left-[10%] w-[80%] h-1 bg-slate-200 dark:bg-slate-800 rounded-full" />

                    {/* Progress Bar Fill */}
                    <motion.div
                        className="absolute top-4 left-[10%] h-1 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                        initial={{ width: "0%" }}
                        animate={{ width: step === 1 ? "15%" : step === 2 ? "50%" : "90%" }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    />

                    <div className="flex justify-between relative z-10">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all">
                                <Check className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Calibrando IA</span>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${step >= 2 ? 'bg-blue-600 text-white ring-4 ring-blue-600/30' : 'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-400'}`}>
                                {step > 2 ? <Check className="w-5 h-5" /> : <Loader2 className={`w-5 h-5 ${step === 2 ? 'animate-spin' : ''}`} />}
                            </div>
                            <span className={`text-xs font-semibold ${step >= 2 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-500'}`}>
                                Sincronizando Editais
                            </span>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 ${step >= 3 ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-600/30' : 'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-400'}`}>
                                {step > 3 ? <Check className="w-5 h-5" /> : <CalendarRange className="w-4 h-4" />}
                            </div>
                            <span className={`text-xs font-semibold ${step >= 3 ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500 dark:text-slate-500'}`}>
                                Preparando Cronograma
                            </span>
                        </div>
                    </div>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-12 text-sm text-slate-500 dark:text-slate-500 font-mono tracking-wider animate-pulse"
                >
                    Isso pode levar alguns segundos...
                </motion.p>
            </div>

        </main>
    );
}
