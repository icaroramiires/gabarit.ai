import { StudentProfileRepository } from '../../domain/repositories/student-profile-repository';
import { StudentProfile } from '../../domain/entities/student-profile';

export class AddXpUseCase {
    constructor(private studentProfileRepository: StudentProfileRepository) { }

    async execute(userId: string, xpToAdd: number): Promise<StudentProfile> {
        let profile = await this.studentProfileRepository.findByUserId(userId);

        if (!profile) {
            profile = StudentProfile.create({ userId });
        }

        profile.addXp(xpToAdd);

        await this.studentProfileRepository.save(profile);

        return profile;
    }
}
