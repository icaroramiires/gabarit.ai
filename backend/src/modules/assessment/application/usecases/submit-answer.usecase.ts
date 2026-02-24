import { QuestionRepository } from '../../domain/repositories/question-repository';
import { SubmitAnswerRequestDto } from '../dtos/submit-answer.dto';
import { Either, left, right } from '../../../../core/logic/Either';
import { Answer } from '../../domain/entities/answer';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { AddXpUseCase } from '../../../gamification/application/usecases/add-xp.usecase';
import { UpdateStreakUseCase } from '../../../gamification/application/usecases/update-streak.usecase';

export class SubmitAnswerUseCase {
    constructor(
        private questionRepository: QuestionRepository,
        private addXpUseCase?: AddXpUseCase,
        private updateStreakUseCase?: UpdateStreakUseCase
    ) { }

    async execute(request: SubmitAnswerRequestDto): Promise<Either<Error, Answer>> {
        const question = await this.questionRepository.findById(request.questionId);

        if (!question) {
            return left(new Error('Questão não encontrada.'));
        }

        try {
            const answer = Answer.create(
                {
                    userId: new UniqueEntityID(request.userId),
                    questionId: new UniqueEntityID(request.questionId),
                    selectedAlternativeId: new UniqueEntityID(request.selectedAlternativeId),
                },
                question
            );

            await this.questionRepository.saveAnswer(answer);

            // Core Gamification triggers (fire and forget for MVP)
            if (this.addXpUseCase && this.updateStreakUseCase) {
                try {
                    await this.updateStreakUseCase.execute(request.userId);
                    if (answer.isCorrect) {
                        await this.addXpUseCase.execute(request.userId, 10); // +10 XP por acerto
                    }
                } catch (error) {
                    console.error("Failed to apply gamification", error);
                }
            }

            return right(answer);
        } catch (error: any) {
            return left(new Error(error.message || 'Erro ao submeter resposta.'));
        }
    }
}
