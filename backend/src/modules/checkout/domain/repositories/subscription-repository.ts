import { Subscription } from '../entities/subscription';

export abstract class SubscriptionRepository {
    abstract findByUserId(userId: string): Promise<Subscription | null>;
    abstract findByStripeSubscriptionId(stripeSubId: string): Promise<Subscription | null>;
    abstract findByStripeCustomerId(stripeCustomerId: string): Promise<Subscription | null>;
    abstract save(subscription: Subscription): Promise<void>;
}
