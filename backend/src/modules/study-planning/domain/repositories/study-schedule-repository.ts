import { StudySchedule } from '../entities/study-schedule';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';

export interface StudyScheduleRepository {
    findById(id: UniqueEntityID): Promise<StudySchedule | null>;
    findByUserId(userId: UniqueEntityID): Promise<StudySchedule[]>;
    create(schedule: StudySchedule): Promise<void>;
    save(schedule: StudySchedule): Promise<void>;
}
