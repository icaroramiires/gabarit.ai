"use client"

import React, { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/core/auth/AuthContext';
import { jwtDecode } from 'jwt-decode';

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const payload = await res.json();

            if (!res.ok) {
                throw new Error(payload.message || 'Erro ao fazer login');
            }

            const token = payload.data.accessToken;
            // Decode the JWT to get user basic info
            const decoded: { sub?: string; name?: string; email?: string } = jwtDecode(token);

            login(token, {
                id: decoded.sub || 'user-id',
                name: decoded.name || 'Aluno VIP',
                email: decoded.email || email,
            });

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Um erro desconhecido ocorreu');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-8 rounded-2xl border border-slate-200 bg-white dark:border-[#272e3f] dark:bg-[#171d28] shadow-lg">
            <h2 className="text-2xl font-bold mb-2">Bem-vindo de volta</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
                Entre para continuar sua jornada de aprovação.
            </p>

            <div className="flex flex-col gap-3 mb-6">
                <Button variant="outline" className="w-full relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 absolute left-4" />
                    Continuar com Google
                </Button>
                <Button variant="secondary" className="w-full relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://www.svgrepo.com/show/511330/apple-173.svg" alt="Apple" className="w-5 h-5 absolute left-4 dark:invert" />
                    Continuar com Apple
                </Button>
            </div>

            <div className="relative flex items-center justify-center my-6">
                <div className="border-t border-slate-200 dark:border-[#272e3f] w-full absolute" />
                <span className="bg-white dark:bg-[#171d28] px-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider relative z-10">
                    ou continue com email
                </span>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 text-sm rounded-lg text-center font-medium">
                    {error}
                </div>
            )}

            <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                <div>
                    <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Email</label>
                    <Input
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={<Mail className="w-4 h-4" />}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Senha</label>
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            icon={<Lock className="w-4 h-4" />}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm mt-1 mb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 dark:border-[#272e3f] dark:bg-[#11141c] dark:checked:bg-blue-600" />
                        <span className="text-slate-600 dark:text-slate-400">Lembrar de mim</span>
                    </label>
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400">
                        Esqueceu a senha?
                    </a>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full text-base font-semibold group py-6">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Entrar'}
                    {!isLoading && (
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    )}
                </Button>
            </form>

            <p className="text-center mt-8 text-sm text-slate-600 dark:text-slate-400">
                Não tem uma conta? <a href="#" className="font-semibold text-slate-900 dark:text-white hover:underline">Criar agora</a>
            </p>
        </div>
    );
}
