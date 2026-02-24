import { QuestionRepository } from '../../domain/repositories/question-repository';
import { SubmitAnswerRequestDto } from '../dtos/submit-answer.dto';
import { Either, left, right } from '../../../../core/logic/Either';
import { Answer } from '../../domain/entities/answer';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';

export class SubmitAnswerUseCase {
    constructor(private questionRepository: QuestionRepository) { }

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

            return right(answer);
        } catch (error: any) {
            return left(new Error(error.message || 'Erro ao submeter resposta.'));
        }
    }
}
