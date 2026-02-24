import { StudyScheduleRepository } from '../../domain/repositories/study-schedule-repository';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';

export class StartStudySessionUseCase {
    constructor(private studyScheduleRepository: StudyScheduleRepository) { }

    async execute(scheduleId: string, blockId: string): Promise<void> {
        const schedule = await this.studyScheduleRepository.findById(new UniqueEntityID(scheduleId));

        if (!schedule) {
            throw new Error('Schedule not found');
        }

        const block = schedule.blocks.find(b => b.id.toString() === blockId);

        if (!block) {
            throw new Error('Study block not found');
        }

        // Verifica se já existe algum outro bloco em progresso neste cronograma
        const blockInProgress = schedule.blocks.find(b => b.status === 'in-progress' && b.id.toString() !== blockId);
        if (blockInProgress) {
            throw new Error('There is already a study session in progress on this schedule. Pause or finish it first.');
        }

        block.start();

        await this.studyScheduleRepository.save(schedule);
    }
}
