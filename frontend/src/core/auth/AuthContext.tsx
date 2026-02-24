'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextData {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedToken = Cookies.get('gabaritai_token');
        const storedUser = localStorage.getItem('gabaritai_user');

        if (storedToken && storedUser) {
            // eslint-disable-next-line
            setToken(storedToken);
             
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        Cookies.set('gabaritai_token', newToken, { expires: 7 }); // 7 days matching backend
        localStorage.setItem('gabaritai_user', JSON.stringify(newUser));
        router.push('/dashboard');
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        Cookies.remove('gabaritai_token');
        localStorage.removeItem('gabaritai_user');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
