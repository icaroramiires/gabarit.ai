import { Injectable } from '@nestjs/common';
import { SubscriptionRepository } from '../../domain/repositories/subscription-repository';
import { Subscription as DomainSubscription } from '../../domain/entities/subscription';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import Stripe from 'stripe';

@Injectable()
export class ProcessWebhookUseCase {
    constructor(
        private subscriptionRepo: SubscriptionRepository
    ) { }

    async execute(event: Stripe.Event): Promise<void> {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                if (session.mode === 'subscription' && session.subscription) {
                    await this.handleSubscriptionCreated(session);
                }
                break;
            }
            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                await this.handleSubscriptionUpdated(subscription);
                break;
            }
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                await this.handleSubscriptionDeleted(subscription);
                break;
            }
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    }

    private async handleSubscriptionCreated(session: Stripe.Checkout.Session) {
        const userId = session.metadata?.userId;
        if (!userId) {
            console.error("Webhook Error: No userId in session metadata");
            return;
        }

        const stripeSubId = session.subscription as string;
        const stripeCustomerId = session.customer as string;

        let subscriptionDomain = await this.subscriptionRepo.findByUserId(userId);

        if (!subscriptionDomain) {
            subscriptionDomain = DomainSubscription.create({
                userId,
                planType: 'PRO',
                status: 'ACTIVE',
                stripeSubscriptionId: stripeSubId,
                stripeCustomerId,
                // Roughly 30 days from now
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            }, new UniqueEntityID());
        } else {
            subscriptionDomain.activatePro(stripeSubId, stripeCustomerId, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
        }

        await this.subscriptionRepo.save(subscriptionDomain);
    }

    private async handleSubscriptionUpdated(stripeSubscription: Stripe.Subscription) {
        let sub = await this.subscriptionRepo.findByStripeSubscriptionId(stripeSubscription.id);

        if (!sub) {
            // Se não encontrou pelo subId, tenta pelo customerId (pode ter sido atualizado por um admin do Stripe dev panel)
            sub = await this.subscriptionRepo.findByStripeCustomerId(stripeSubscription.customer as string);
        }

        if (sub) {
            if (stripeSubscription.status === 'active' || stripeSubscription.status === 'trialing') {
                sub.activatePro(
                    stripeSubscription.id,
                    stripeSubscription.customer as string,
                    new Date((stripeSubscription as any).current_period_end * 1000)
                );
            } else if (stripeSubscription.status === 'canceled' || stripeSubscription.status === 'unpaid') {
                sub.cancel();
            }
            await this.subscriptionRepo.save(sub);
        }
    }

    private async handleSubscriptionDeleted(stripeSubscription: Stripe.Subscription) {
        const sub = await this.subscriptionRepo.findByStripeSubscriptionId(stripeSubscription.id);
        if (sub) {
            sub.cancel();
            await this.subscriptionRepo.save(sub);
        }
    }
}
