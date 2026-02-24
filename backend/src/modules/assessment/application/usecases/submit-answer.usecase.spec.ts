import { SubmitAnswerUseCase } from './submit-answer.usecase';
import { QuestionInMemoryRepository } from '../../infrastructure/repositories/question-in-memory.repository';
import { Question } from '../../domain/entities/question';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { Answer } from '../../domain/entities/answer';

describe('SubmitAnswerUseCase', () => {
    let repository: QuestionInMemoryRepository;
    let usecase: SubmitAnswerUseCase;

    const questionId = new UniqueEntityID('q1');
    const correctOptionId = new UniqueEntityID('opt1');
    const wrongOptionId = new UniqueEntityID('opt2');
    const userId = 'user-1';

    beforeEach(() => {
        repository = new QuestionInMemoryRepository();
        usecase = new SubmitAnswerUseCase(repository);

        repository.questions.push(
            Question.create({
                bank: 'VUNESP',
                subject: 'Matemática',
                topic: 'Juros',
                year: 2024,
                text: 'Calcule os juros...',
                alternatives: [
                    { id: correctOptionId, text: 'R$ 100', isCorrect: true },
                    { id: wrongOptionId, text: 'R$ 20', isCorrect: false },
                ],
            }, questionId)
        );
    });

    it('deve registrar e retornar a resposta se a alternativa for correta', async () => {
        const result = await usecase.execute({
            userId,
            questionId: questionId.toString(),
            selectedAlternativeId: correctOptionId.toString()
        });

        expect(result.isRight()).toBe(true);

        const answer = result.value as Answer;
        expect(answer.isCorrect).toBe(true);
        expect(answer.questionId.toString()).toBe(questionId.toString());

        // Verifica se persistiu
        expect(repository.answers).toHaveLength(1);
        expect(repository.answers[0].isCorrect).toBe(true);
    });

    it('deve registrar e retornar a resposta como errada se a alternativa for incorreta', async () => {
        const result = await usecase.execute({
            userId,
            questionId: questionId.toString(),
            selectedAlternativeId: wrongOptionId.toString()
        });

        expect(result.isRight()).toBe(true);

        const answer = result.value as Answer;
        expect(answer.isCorrect).toBe(false);

        expect(repository.answers).toHaveLength(1);
        expect(repository.answers[0].isCorrect).toBe(false);
    });

    it('não deve submeter se a questão não existir', async () => {
        const result = await usecase.execute({
            userId,
            questionId: 'wrong-q-id',
            selectedAlternativeId: correctOptionId.toString()
        });

        expect(result.isLeft()).toBe(true);
        expect((result.value as Error).message).toBe('Questão não encontrada.');
    });

    it('não deve submeter se a alternativa pertencer a outra questão / não existir', async () => {
        const result = await usecase.execute({
            userId,
            questionId: questionId.toString(),
            selectedAlternativeId: 'invalid-opt'
        });

        expect(result.isLeft()).toBe(true);
        expect((result.value as Error).message).toBe('Alternativa selecionada não pertence a esta questão.');
    });
});
