import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AssessmentModule } from '../assessment/assessment.module';
import { FlashcardsModule } from '../flashcards/flashcards.module';
import { PerformanceController } from './presentation/performance.controller';
import { GetPerformanceStatsUseCase } from './application/usecases/get-performance-stats.usecase';
import { GeneratePerformanceReportUseCase } from './application/usecases/generate-performance-report.usecase';
import { AnswerRepository } from '../assessment/domain/repositories/answer-repository';
import { FlashcardRepository } from '../flashcards/domain/repositories/flashcard-repository';

@Module({
    imports: [PrismaModule, AssessmentModule, FlashcardsModule],
    controllers: [PerformanceController],
    providers: [
        {
            provide: GetPerformanceStatsUseCase,
            useFactory: (answerRepo: AnswerRepository, flashcardRepo: FlashcardRepository) =>
                new GetPerformanceStatsUseCase(answerRepo, flashcardRepo),
            inject: ['AnswerRepository', 'FlashcardRepository']
        },
        {
            provide: GeneratePerformanceReportUseCase,
            useFactory: (answerRepo: AnswerRepository, flashcardRepo: FlashcardRepository) =>
                new GeneratePerformanceReportUseCase(answerRepo, flashcardRepo),
            inject: ['AnswerRepository', 'FlashcardRepository']
        }
    ],
    exports: []
})
export class PerformanceModule { }
