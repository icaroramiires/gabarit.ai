import { Module } from '@nestjs/common';
import { CheckoutController } from './presentation/checkout.controller';
import { CreateCheckoutSessionUseCase } from './application/usecases/create-checkout-session.usecase';
import { ProcessWebhookUseCase } from './application/usecases/process-webhook.usecase';
import { SubscriptionRepository } from './domain/repositories/subscription-repository';
import { SubscriptionPrismaRepository } from './infrastructure/repositories/subscription-prisma.repository';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [CheckoutController],
    providers: [
        CreateCheckoutSessionUseCase,
        ProcessWebhookUseCase,
        {
            provide: SubscriptionRepository,
            useClass: SubscriptionPrismaRepository,
        }
    ],
    exports: [SubscriptionRepository]
})
export class CheckoutModule { }
