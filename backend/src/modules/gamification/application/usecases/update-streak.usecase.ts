import { StudentProfileRepository } from '../../domain/repositories/student-profile-repository';
import { StudentProfile } from '../../domain/entities/student-profile';

export class UpdateStreakUseCase {
    constructor(private studentProfileRepository: StudentProfileRepository) { }

    async execute(userId: string): Promise<StudentProfile> {
        let profile = await this.studentProfileRepository.findByUserId(userId);

        if (!profile) {
            profile = StudentProfile.create({ userId });
        }

        profile.recordActivity();

        await this.studentProfileRepository.save(profile);

        return profile;
    }
}
