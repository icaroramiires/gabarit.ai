import { Either, left, right } from '../../../../core/logic/Either';
import { StudyScheduleRepository } from '../../domain/repositories/study-schedule-repository';
import { GetWeeklyPerformanceUseCase } from '../../../assessment/application/usecases/get-weekly-performance.usecase';
import { RebalanceScheduleUseCase } from '../../../ai-copilot/application/usecases/rebalance-schedule.usecase';
import { StudySchedule } from '../../domain/entities/study-schedule';
import { StudyBlock } from '../../domain/entities/study-block';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';

export class RegenerateScheduleUseCase {
    constructor(
        private scheduleRepository: StudyScheduleRepository,
        private getWeeklyPerformance: GetWeeklyPerformanceUseCase,
        private rebalanceSchedule: RebalanceScheduleUseCase
    ) { }

    async execute(userId: string, scheduleId: string): Promise<Either<Error, StudySchedule>> {
        const schedule = await this.scheduleRepository.findById(new UniqueEntityID(scheduleId));

        if (!schedule) {
            return left(new Error('Cronograma não encontrado.'));
        }

        if (schedule.userId.toValue() !== userId) {
            return left(new Error('Acesso negado ao cronograma.'));
        }

        // 1. Coletar Erros/Acertos da Última Semana
        const performance = await this.getWeeklyPerformance.execute(userId);

        // 2. Acionar LLM para Estratificação do Tempo
        // Assumindo 20 horas semanais pra base de cálculo no MVP V2
        const totalWeeklyHours = 20;
        const aiRecommendations = await this.rebalanceSchedule.execute(userId, totalWeeklyHours, performance);

        // 3. Atualizar Cronograma
        // Na prática, em um cronograma adaptativo, não apagamos blocos concluídos.
        // Simulando a deleção de blocos "pendentes" (futuros) e recriação guiada pela IA.
        const pendingBlocksCount = schedule.blocks.filter(b => b.status === 'pending').length;

        // Limpar blocos velhos (Simulação de reposicionamento)
        schedule.clearPendingBlocks();

        // Adicionar novos blocos baseados na IA
        aiRecommendations.subjectAdjustments.forEach(adjustment => {
            // Se recomendou 4 horas na semana = 240 minutos
            // Vamos quebrar em blocos de 60 minutos
            const totalMinutesPerSubj = adjustment.recommendedHoursPerWeek * 60;
            const blocksCount = Math.max(1, Math.floor(totalMinutesPerSubj / 60));

            for (let i = 0; i < blocksCount; i++) {
                const block = StudyBlock.create({
                    scheduleId: schedule.id,
                    subject: adjustment.subjectName,
                    topic: 'Revisão Recomendada pela IA', // A IA poderia devolver tbm o tópico fraco
                    plannedDurationInMinutes: 60,
                });
                schedule.addBlock(block);
            }
        });

        // 4. Salvar Novo Estado
        await this.scheduleRepository.save(schedule);

        return right(schedule);
    }
}
