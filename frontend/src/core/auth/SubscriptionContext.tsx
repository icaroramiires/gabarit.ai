'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface SubscriptionData {
    planType: 'FREE' | 'PRO';
    status: 'ACTIVE' | 'INACTIVE' | 'CANCELED';
    expiresAt: string | null;
}

interface SubscriptionContextType {
    subscription: SubscriptionData | null;
    isLoadingSubscription: boolean;
    isPro: boolean;
    refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
    const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);

    const fetchSubscription = async () => {
        if (!user) {
            setSubscription(null);
            setIsLoadingSubscription(false);
            return;
        }

        try {
            // Create a specific endpoint for the user's subscription,
            // But for Mock/MVP, let's assume we fetch from Gamification/Profile or a quick mock.
            // E.g: GET /api/checkout/subscription/:userId

            // MOCK:
            // We will pretend everyone is FREE until they pay.
            // For now we will check localStorage mock flag or dummy fallback
            const mockPro = localStorage.getItem('@gabarit:mockPro') === 'true';

            setSubscription({
                planType: mockPro ? 'PRO' : 'FREE',
                status: mockPro ? 'ACTIVE' : 'INACTIVE',
                expiresAt: mockPro ? new Date(Date.now() + 86400000).toISOString() : null,
            });

        } catch (error) {
            console.error('Failed to fetch subscription', error);
            setSubscription(null);
        } finally {
            setIsLoadingSubscription(false);
        }
    };

    useEffect(() => {
        fetchSubscription();
    }, [user]);

    const isPro = subscription?.planType === 'PRO' && subscription?.status === 'ACTIVE';

    return (
        <SubscriptionContext.Provider value={{ subscription, isLoadingSubscription, isPro, refreshSubscription: fetchSubscription }}>
            {children}
        </SubscriptionContext.Provider>
    );
}

export const useSubscription = () => {
    const context = useContext(SubscriptionContext);
    if (context === undefined) {
        throw new Error('useSubscription must be used within a SubscriptionProvider');
    }
    return context;
};
