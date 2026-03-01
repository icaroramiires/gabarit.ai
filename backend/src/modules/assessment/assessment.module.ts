import { Module } from '@nestjs/common';
import { AssessmentController } from './presentation/assessment.controller';
import { GetQuestionsUseCase } from './application/usecases/get-questions.usecase';
import { SubmitAnswerUseCase } from './application/usecases/submit-answer.usecase';
import { GetWeeklyPerformanceUseCase } from './application/usecases/get-weekly-performance.usecase';
import { QuestionPrismaRepository } from './infrastructure/repositories/question-prisma.repository';
import { AnswerPrismaRepository } from './infrastructure/repositories/answer-prisma.repository';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { GamificationModule } from '../gamification/gamification.module';
import { AddXpUseCase } from '../gamification/application/usecases/add-xp.usecase';
import { UpdateStreakUseCase } from '../gamification/application/usecases/update-streak.usecase';

@Module({
    imports: [PrismaModule, GamificationModule],
    controllers: [AssessmentController],
    providers: [
        {
            provide: 'QuestionRepository',
            useClass: QuestionPrismaRepository,
        },
        {
            provide: GetQuestionsUseCase,
            useFactory: (repository: QuestionPrismaRepository) => {
                return new GetQuestionsUseCase(repository);
            },
            inject: ['QuestionRepository'],
        },
        {
            provide: SubmitAnswerUseCase,
            useFactory: (repository: QuestionPrismaRepository, addXp: AddXpUseCase, updateStreak: UpdateStreakUseCase) => {
                return new SubmitAnswerUseCase(repository, addXp, updateStreak);
            },
            inject: ['QuestionRepository', AddXpUseCase, UpdateStreakUseCase],
        },
        {
            provide: 'AnswerRepository',
            useClass: AnswerPrismaRepository,
        },
        {
            provide: GetWeeklyPerformanceUseCase,
            useFactory: (repository: AnswerPrismaRepository) => {
                return new GetWeeklyPerformanceUseCase(repository);
            },
            inject: ['AnswerRepository'],
        },
    ],
    exports: [
        GetWeeklyPerformanceUseCase,
        'QuestionRepository',
        'AnswerRepository'
    ]
})
export class AssessmentModule { }
