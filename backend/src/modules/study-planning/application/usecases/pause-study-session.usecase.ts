import { StudyScheduleRepository } from '../../domain/repositories/study-schedule-repository';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';

export class PauseStudySessionUseCase {
    constructor(private studyScheduleRepository: StudyScheduleRepository) { }

    async execute(scheduleId: string, blockId: string, elapsedMinutesToAdd: number): Promise<void> {
        const schedule = await this.studyScheduleRepository.findById(new UniqueEntityID(scheduleId));

        if (!schedule) {
            throw new Error('Schedule not found');
        }

        const block = schedule.blocks.find(b => b.id.toString() === blockId);

        if (!block) {
            throw new Error('Study block not found');
        }

        block.pause(elapsedMinutesToAdd);

        await this.studyScheduleRepository.save(schedule);
    }
}
