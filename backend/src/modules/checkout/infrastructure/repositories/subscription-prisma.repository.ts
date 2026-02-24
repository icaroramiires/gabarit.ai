import { Injectable } from '@nestjs/common';
import { SubscriptionRepository } from '../../domain/repositories/subscription-repository';
import { Subscription } from '../../domain/entities/subscription';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';

@Injectable()
export class SubscriptionPrismaRepository implements SubscriptionRepository {
    constructor(private prisma: PrismaService) { }

    async findByUserId(userId: string): Promise<Subscription | null> {
        const data = await this.prisma.subscription.findUnique({
            where: { userId }
        });

        if (!data) return null;

        return Subscription.create({
            userId: data.userId,
            planType: data.planType as any,
            status: data.status as any,
            stripeSubscriptionId: data.stripeSubscriptionId,
            stripeCustomerId: data.stripeCustomerId,
            expiresAt: data.expiresAt,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        }, new UniqueEntityID(data.id));
    }

    async findByStripeSubscriptionId(stripeSubId: string): Promise<Subscription | null> {
        const data = await this.prisma.subscription.findUnique({
            where: { stripeSubscriptionId: stripeSubId }
        });

        if (!data) return null;

        return Subscription.create({
            userId: data.userId,
            planType: data.planType as any,
            status: data.status as any,
            stripeSubscriptionId: data.stripeSubscriptionId,
            stripeCustomerId: data.stripeCustomerId,
            expiresAt: data.expiresAt,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        }, new UniqueEntityID(data.id));
    }

    async findByStripeCustomerId(stripeCustomerId: string): Promise<Subscription | null> {
        const data = await this.prisma.subscription.findUnique({
            where: { stripeCustomerId }
        });

        if (!data) return null;

        return Subscription.create({
            userId: data.userId,
            planType: data.planType as any,
            status: data.status as any,
            stripeSubscriptionId: data.stripeSubscriptionId,
            stripeCustomerId: data.stripeCustomerId,
            expiresAt: data.expiresAt,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        }, new UniqueEntityID(data.id));
    }

    async save(subscription: Subscription): Promise<void> {
        await this.prisma.subscription.upsert({
            where: { id: subscription.id.toString() },
            update: {
                userId: subscription.userId,
                planType: subscription.planType,
                status: subscription.status,
                stripeSubscriptionId: subscription.stripeSubscriptionId,
                stripeCustomerId: subscription.stripeCustomerId,
                expiresAt: subscription.expiresAt || null,
            },
            create: {
                id: subscription.id.toString(),
                userId: subscription.userId,
                planType: subscription.planType,
                status: subscription.status,
                stripeSubscriptionId: subscription.stripeSubscriptionId,
                stripeCustomerId: subscription.stripeCustomerId,
                expiresAt: subscription.expiresAt || null,
            }
        });
    }
}
