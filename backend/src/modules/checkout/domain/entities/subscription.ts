import { Entity } from '../../../../core/domain/Entity';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';

export type PlanType = 'FREE' | 'PRO';
export type SubscriptionStatus = 'ACTIVE' | 'INACTIVE' | 'CANCELED';

export interface SubscriptionProps {
    userId: string;
    planType: PlanType;
    status: SubscriptionStatus;
    stripeSubscriptionId?: string | null;
    stripeCustomerId?: string | null;
    expiresAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Subscription extends Entity<SubscriptionProps> {
    get userId(): string {
        return this.props.userId;
    }

    get planType(): PlanType {
        return this.props.planType;
    }

    get status(): SubscriptionStatus {
        return this.props.status;
    }

    get stripeSubscriptionId(): string | null | undefined {
        return this.props.stripeSubscriptionId;
    }

    get stripeCustomerId(): string | null | undefined {
        return this.props.stripeCustomerId;
    }

    get expiresAt(): Date | null | undefined {
        return this.props.expiresAt;
    }

    get createdAt(): Date {
        return this.props.createdAt || new Date();
    }

    get updatedAt(): Date {
        return this.props.updatedAt || new Date();
    }

    public isActive(): boolean {
        return this.status === 'ACTIVE' && (this.expiresAt ? this.expiresAt > new Date() : true);
    }

    public activatePro(stripeSubId: string, stripeCustomerId: string, expiresAt: Date) {
        this.props.planType = 'PRO';
        this.props.status = 'ACTIVE';
        this.props.stripeSubscriptionId = stripeSubId;
        this.props.stripeCustomerId = stripeCustomerId;
        this.props.expiresAt = expiresAt;
        this.props.updatedAt = new Date();
    }

    public cancel() {
        this.props.status = 'CANCELED';
        this.props.planType = 'FREE';
        this.props.updatedAt = new Date();
    }

    public static create(
        props: Omit<SubscriptionProps, 'planType' | 'status'> & Partial<Pick<SubscriptionProps, 'planType' | 'status'>>,
        id?: UniqueEntityID,
    ): Subscription {
        return new Subscription({
            ...props,
            planType: props.planType ?? 'FREE',
            status: props.status ?? 'INACTIVE',
            createdAt: props.createdAt ?? new Date(),
            updatedAt: props.updatedAt ?? new Date(),
        }, id);
    }
}
