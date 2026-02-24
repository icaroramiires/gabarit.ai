import { Either, left, right } from '../../../../core/logic/Either';
import { StudySchedule } from '../../domain/entities/study-schedule';
import { StudyScheduleRepository } from '../../domain/repositories/study-schedule-repository';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';

import { AddXpUseCase } from '../../../gamification/application/usecases/add-xp.usecase';
import { UpdateStreakUseCase } from '../../../gamification/application/usecases/update-streak.usecase';

export interface MarkBlockCompletedRequestDto {
    scheduleId: string;
    blockId: string;
}

export class MarkBlockCompletedUseCase {
    constructor(
        private studyScheduleRepository: StudyScheduleRepository,
        private addXpUseCase?: AddXpUseCase,
        private updateStreakUseCase?: UpdateStreakUseCase
    ) { }

    async execute({
        scheduleId,
        blockId,
    }: MarkBlockCompletedRequestDto): Promise<Either<Error, StudySchedule>> {
        const scheduleUniqueId = new UniqueEntityID(scheduleId);

        // 1. Fetch Schedule
        const schedule = await this.studyScheduleRepository.findById(scheduleUniqueId);

        if (!schedule) {
            return left(new Error('Cronograma não encontrado.'));
        }

        // 2. Find Block
        const blockUniqueId = new UniqueEntityID(blockId);
        const block = schedule.blocks.find((b) => b.id.equals(blockUniqueId));

        if (!block) {
            return left(new Error('Bloco de estudo não encontrado neste cronograma.'));
        }

        if (block.isCompleted) {
            return left(new Error('O Bloco já estava concluído.'));
        }

        // 3. Command Entity to Mark as Completed
        block.markAsCompleted();

        // 4. Save Aggregation Root (Schedule)
        await this.studyScheduleRepository.save(schedule);

        if (this.addXpUseCase && this.updateStreakUseCase) {
            try {
                await this.updateStreakUseCase.execute(schedule.userId.toString());
                await this.addXpUseCase.execute(schedule.userId.toString(), 50); // +50 XP for completing a study block
            } catch (error) {
                console.error("Failed to apply gamification", error);
            }
        }

        return right(schedule);
    }
}
