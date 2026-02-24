import { QuestionRepository } from '../../domain/repositories/question-repository';
import { GetQuestionsRequestDto } from '../dtos/get-questions.dto';
import { Either, right } from '../../../../core/logic/Either';
import { Question } from '../../domain/entities/question';

export class GetQuestionsUseCase {
    constructor(private questionRepository: QuestionRepository) { }

    async execute(request: GetQuestionsRequestDto): Promise<Either<Error, Question[]>> {
        const questions = await this.questionRepository.findManyByFilters({
            bank: request.bank,
            subject: request.subject,
            topic: request.topic,
        });

        // Podemos adicionar mais lógica aqui (como embaralhamento de alternativas) depois,
        // mas para esse cenário do fluxo o repositório nos devolve na íntegra a entidade

        return right(questions);
    }
}
