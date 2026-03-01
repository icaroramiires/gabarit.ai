import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { RegenerateScheduleUseCase } from '../usecases/regenerate-schedule.usecase';

@Injectable()
export class AdaptiveCronService {
    private readonly logger = new Logger(AdaptiveCronService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly regenerateScheduleUseCase: RegenerateScheduleUseCase
    ) { }

    // Executado toda Segunda-feira à meia-noite
    @Cron(CronExpression.EVERY_WEEK)
    async handleAdaptiveSchedules() {
        this.logger.log('Iniciando Recálculo Adaptativo de Cronogramas (AI Copilot)...');

        // Buscar inscritos PRO com cronograma ativo
        const proSubscriptions = await this.prisma.subscription.findMany({
            where: {
                planType: 'PRO',
                status: 'ACTIVE'
            },
            include: {
                user: {
                    include: {
                        studySchedules: true
                    }
                }
            }
        });

        if (proSubscriptions.length === 0) {
            this.logger.log('Nenhum usuário PRO elegível para recálculo.');
            return;
        }

        let processed = 0;
        let errors = 0;

        for (const sub of proSubscriptions) {
            try {
                const activeSchedule = sub.user.studySchedules[0]; // Simplificação para o MVP
                if (activeSchedule) {
                    this.logger.log(`Recalculando para o usuário: ${sub.userId}...`);
                    const result = await this.regenerateScheduleUseCase.execute(sub.userId, activeSchedule.id);

                    if (result.isRight()) {
                        processed++;
                    } else {
                        errors++;
                        this.logger.error(`Falha no usuário ${sub.userId}: ${result.value.message}`);
                    }
                }
            } catch (error) {
                errors++;
                this.logger.error(`Erro inesperado para o usuário ${sub.userId}`, error);
            }
        }

        this.logger.log(`Recálculo Adaptativo Finalizado. Processados: ${processed}, Erros: ${errors}.`);
    }
}
