import { Injectable } from '@nestjs/common';
import { SubscriptionRepository } from '../../domain/repositories/subscription-repository';
import Stripe from 'stripe';

@Injectable()
export class CreateCheckoutSessionUseCase {
    private stripe: Stripe;

    constructor(
        private subscriptionRepo: SubscriptionRepository
    ) {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
            apiVersion: '2024-12-18.acacia' as any,
        });
    }

    async execute(userId: string, successUrl: string, cancelUrl: string): Promise<{ url: string | null }> {
        // MOCK BYPASS FOR MVP TEST ENV
        if (process.env.STRIPE_SECRET_KEY === 'sk_test_mock' || !process.env.STRIPE_SECRET_KEY) {
            console.log("Mocking Stripe Session for", userId);
            return { url: successUrl };
        }

        let subscription = await this.subscriptionRepo.findByUserId(userId);

        let customerId = subscription?.stripeCustomerId;

        // Create a Stripe Customer if not exists (In a real app, you'd fetch user email from auth module)
        if (!customerId) {
            const customer = await this.stripe.customers.create({
                metadata: {
                    userId: userId,
                }
            });
            customerId = customer.id;
        }

        // Create Checkout Session
        const session = await this.stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            line_items: [
                {
                    price: process.env.STRIPE_PRO_PRICE_ID || 'price_1MockId', // Mock Price ID
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                userId: userId,
            }
        });

        return { url: session.url };
    }
}
