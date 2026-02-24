import { StudentProfile } from '../entities/student-profile';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';

export abstract class StudentProfileRepository {
    abstract findByUserId(userId: string): Promise<StudentProfile | null>;
    abstract save(profile: StudentProfile): Promise<void>;
    abstract getTopProfiles(limit: number): Promise<StudentProfile[]>; // Basic leaderboard
}
