import { Module } from '@nestjs/common';
import { GamificationController } from './presentation/gamification.controller';
import { AddXpUseCase } from './application/usecases/add-xp.usecase';
import { UpdateStreakUseCase } from './application/usecases/update-streak.usecase';
import { GetLeaderboardUseCase } from './application/usecases/get-leaderboard.usecase';
import { StudentProfilePrismaRepository } from './infrastructure/repositories/student-profile-prisma.repository';
import { StudentProfileRepository } from './domain/repositories/student-profile-repository';

@Module({
    controllers: [GamificationController],
    providers: [
        {
            provide: StudentProfileRepository,
            useClass: StudentProfilePrismaRepository,
        },
        AddXpUseCase,
        UpdateStreakUseCase,
        GetLeaderboardUseCase
    ],
    exports: [
        StudentProfileRepository,
        AddXpUseCase,
        UpdateStreakUseCase
    ]
})
export class GamificationModule { }
