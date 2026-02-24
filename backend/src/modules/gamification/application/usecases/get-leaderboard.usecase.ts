import { StudentProfileRepository } from '../../domain/repositories/student-profile-repository';

export class GetLeaderboardUseCase {
    constructor(private studentProfileRepository: StudentProfileRepository) { }

    async execute(limit: number = 10) {
        const profiles = await this.studentProfileRepository.getTopProfiles(limit);

        // Return an anonymized/formatted representation or DTO
        return profiles.map((p, index) => ({
            rank: index + 1,
            userId: p.userId,
            level: p.level,
            xp: p.xp,
            currentStreak: p.currentStreak
        }));
    }
}
