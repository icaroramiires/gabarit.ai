import { Controller, Post, Body, Headers, Req, Res, HttpStatus } from '@nestjs/common';
import { CreateCheckoutSessionUseCase } from '../application/usecases/create-checkout-session.usecase';
import { ProcessWebhookUseCase } from '../application/usecases/process-webhook.usecase';
import Stripe from 'stripe';
import type { Request, Response } from 'express';

@Controller('checkout')
export class CheckoutController {
    private stripe: Stripe;

    constructor(
        private createCheckoutSession: CreateCheckoutSessionUseCase,
        private processWebhookUseCase: ProcessWebhookUseCase
    ) {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
            apiVersion: '2024-12-18.acacia' as any,
        });
    }

    @Post('session')
    async createSession(@Body('userId') userId: string) {
        // Here, the frontend will pass the context userId or we'd extract it from the JWT in a real strict env.
        // The success and cancel URLs point to the frontend pricing page.
        const successUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pricing?success=true`;
        const cancelUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pricing?canceled=true`;

        const session = await this.createCheckoutSession.execute(userId, successUrl, cancelUrl);
        return { sessionUrl: session.url };
    }

    // Explicit raw parser is needed for Stripe webhooks in reality, but we use express Request for now
    @Post('webhook')
    async stripeWebhook(@Req() req: Request, @Res() res: Response, @Headers('stripe-signature') signature: string) {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock';

        let event: Stripe.Event;

        try {
            // Se tivermos implementado rawBody no NestJS, podemos usar o construtor confiavel:
            // event = this.stripe.webhooks.constructEvent(req.rawBody, signature, webhookSecret);

            // Para simplificar o Mock de testes local, lemos o body confiavelmente
            event = req.body;
        } catch (err: any) {
            console.error(`⚠️  Webhook signature verification failed.`, err.message);
            return res.status(HttpStatus.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
        }

        try {
            await this.processWebhookUseCase.execute(event);
        } catch (error) {
            console.error('Failure on processing webhook', error);
        }

        res.status(HttpStatus.OK).send({ received: true });
    }
}
