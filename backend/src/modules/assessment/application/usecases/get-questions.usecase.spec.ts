import { GetQuestionsUseCase } from './get-questions.usecase';
import { QuestionInMemoryRepository } from '../../infrastructure/repositories/question-in-memory.repository';
import { Question } from '../../domain/entities/question';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';

describe('GetQuestionsUseCase', () => {
    let repository: QuestionInMemoryRepository;
    let usecase: GetQuestionsUseCase;

    beforeEach(() => {
        repository = new QuestionInMemoryRepository();
        usecase = new GetQuestionsUseCase(repository);

        // Seed
        repository.questions.push(
            Question.create({
                bank: 'FGV',
                subject: 'Direito Administrativo',
                topic: 'Licitações',
                year: 2023,
                text: 'Sobre licitações...',
                alternatives: [
                    { id: new UniqueEntityID(), text: 'Certo', isCorrect: true },
                    { id: new UniqueEntityID(), text: 'Errado', isCorrect: false },
                ],
            })
        );

        repository.questions.push(
            Question.create({
                bank: 'CEBRASPE',
                subject: 'Direito Administrativo',
                topic: 'Agentes Públicos',
                year: 2022,
                text: 'Sobre agentes...',
                alternatives: [
                    { id: new UniqueEntityID(), text: 'Certo', isCorrect: true },
                    { id: new UniqueEntityID(), text: 'Errado', isCorrect: false },
                ],
            })
        );
    });

    it('deve retornar todas as questões se nenhum filtro for passado', async () => {
        const result = await usecase.execute({});
        expect(result.isRight()).toBe(true);
        expect(result.value).toHaveLength(2);
    });

    it('deve filtrar as questões pela banca FGV', async () => {
        const result = await usecase.execute({ bank: 'FGV' });
        expect(result.isRight()).toBe(true);

        const questions = result.value as Question[];
        expect(questions).toHaveLength(1);
        expect(questions[0].bank).toBe('FGV');
    });

    it('deve filtrar as questões pelo tópico Licitações', async () => {
        const result = await usecase.execute({ topic: 'Licitações' });
        expect(result.isRight()).toBe(true);

        const questions = result.value as Question[];
        expect(questions).toHaveLength(1);
        expect(questions[0].topic).toBe('Licitações');
    });
});
