import { Either, left, right } from '../../../../core/logic/Either';
import { StudySchedule } from '../../domain/entities/study-schedule';
import { StudyScheduleRepository } from '../../domain/repositories/study-schedule-repository';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';

export interface MarkBlockCompletedRequestDto {
    scheduleId: string;
    blockId: string;
}

export class MarkBlockCompletedUseCase {
    constructor(private scheduleRepository: StudyScheduleRepository) { }

    async execute({
        scheduleId,
        blockId,
    }: MarkBlockCompletedRequestDto): Promise<Either<Error, StudySchedule>> {
        const scheduleUniqueId = new UniqueEntityID(scheduleId);

        // 1. Fetch Schedule
        const schedule = await this.scheduleRepository.findById(scheduleUniqueId);

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
        await this.scheduleRepository.save(schedule);

        return right(schedule);
    }
}
