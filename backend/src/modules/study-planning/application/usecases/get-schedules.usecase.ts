import { StudySchedule } from '../../domain/entities/study-schedule';
import { StudyScheduleRepository } from '../../domain/repositories/study-schedule-repository';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';

export class GetSchedulesUseCase {
    constructor(private scheduleRepository: StudyScheduleRepository) { }

    async execute(userId: string): Promise<StudySchedule[]> {
        const userUniqueId = new UniqueEntityID(userId);
        const schedules = await this.scheduleRepository.findByUserId(userUniqueId);
        return schedules;
    }
}
