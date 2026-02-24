import { Module } from '@nestjs/common';
import { AssessmentController } from './presentation/assessment.controller';
import { GetQuestionsUseCase } from './application/usecases/get-questions.usecase';
import { SubmitAnswerUseCase } from './application/usecases/submit-answer.usecase';
import { QuestionPrismaRepository } from './infrastructure/repositories/question-prisma.repository';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
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
            useFactory: (repository: QuestionPrismaRepository) => {
                return new SubmitAnswerUseCase(repository);
            },
            inject: ['QuestionRepository'],
        },
    ],
})
export class AssessmentModule { }
