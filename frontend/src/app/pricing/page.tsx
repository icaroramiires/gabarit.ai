import React, { Suspense } from 'react';
import AppLayout from '@/shared/ui/app-layout';
import PricingClient from './PricingClient';

export default function PricingPage() {
    return (
        <AppLayout>
            <Suspense fallback={<div>Carregando Planos...</div>}>
                <PricingClient />
            </Suspense>
        </AppLayout>
    );
}
