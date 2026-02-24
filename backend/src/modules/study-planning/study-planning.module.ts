import { Module } from '@nestjs/common';
import { StudyPlanningController } from './presentation/study-planning.controller';
import { GenerateBaseScheduleUseCase } from './application/usecases/generate-base-schedule.usecase';
import { MarkBlockCompletedUseCase } from './application/usecases/mark-block-completed.usecase';
import { GetSchedulesUseCase } from './application/usecases/get-schedules.usecase';
import { StartStudySessionUseCase } from './application/usecases/start-study-session.usecase';
import { PauseStudySessionUseCase } from './application/usecases/pause-study-session.usecase';
import { StudySchedulePrismaRepository } from './infrastructure/repositories/study-schedule-prisma.repository';
import { GamificationModule } from '../gamification/gamification.module';
import { AddXpUseCase } from '../gamification/application/usecases/add-xp.usecase';
import { UpdateStreakUseCase } from '../gamification/application/usecases/update-streak.usecase';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

@Module({
    imports: [PrismaModule, GamificationModule],
    controllers: [StudyPlanningController],
    providers: [
        {
            provide: 'StudyScheduleRepository',
            useClass: StudySchedulePrismaRepository,
        },
        {
            provide: GenerateBaseScheduleUseCase,
            useFactory: (repository: StudySchedulePrismaRepository) => {
                return new GenerateBaseScheduleUseCase(repository);
            },
            inject: ['StudyScheduleRepository'],
        },
        {
            provide: MarkBlockCompletedUseCase,
            useFactory: (repository: StudySchedulePrismaRepository, addXp: AddXpUseCase, updateStreak: UpdateStreakUseCase) => {
                return new MarkBlockCompletedUseCase(repository, addXp, updateStreak);
            },
            inject: ['StudyScheduleRepository', AddXpUseCase, UpdateStreakUseCase],
        },
        {
            provide: GetSchedulesUseCase,
            useFactory: (repository: StudySchedulePrismaRepository) => {
                return new GetSchedulesUseCase(repository);
            },
            inject: ['StudyScheduleRepository'],
        },
        {
            provide: StartStudySessionUseCase,
            useFactory: (repository: StudySchedulePrismaRepository) => {
                return new StartStudySessionUseCase(repository);
            },
            inject: ['StudyScheduleRepository'],
        },
        {
            provide: PauseStudySessionUseCase,
            useFactory: (repository: StudySchedulePrismaRepository) => {
                return new PauseStudySessionUseCase(repository);
            },
            inject: ['StudyScheduleRepository'],
        },
    ],
})
export class StudyPlanningModule { }
