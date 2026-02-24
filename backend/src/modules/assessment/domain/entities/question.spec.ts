import { Question } from './question';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';

describe('Question Entity', () => {
    it('deve criar uma questão válida e setar a data de criação', () => {
        const question = Question.create({
            bank: 'CEBRASPE',
            subject: 'Língua Portuguesa',
            topic: 'Compreensão de Textos',
            year: 2024,
            text: 'De acordo com o texto...',
            alternatives: [
                { id: new UniqueEntityID(), text: 'Alternativa A', isCorrect: false },
                { id: new UniqueEntityID(), text: 'Alternativa B', isCorrect: true },
                { id: new UniqueEntityID(), text: 'Alternativa C', isCorrect: false },
            ],
        });

        expect(question).toBeInstanceOf(Question);
        expect(question.bank).toBe('CEBRASPE');
        expect(question.alternatives).toHaveLength(3);
        expect(question.createdAt).toBeInstanceOf(Date);
    });

    it('não deve criar uma questão sem alternativas', () => {
        expect(() => {
            Question.create({
                bank: 'CEBRASPE',
                subject: 'Português',
                topic: 'Gramática',
                year: 2024,
                text: 'Assinale a certa.',
                alternatives: [],
            });
        }).toThrow('Uma questão deve ter pelo menos uma alternativa.');
    });

    it('não deve criar uma questão com duas alternativas corretas', () => {
        expect(() => {
            Question.create({
                bank: 'CEBRASPE',
                subject: 'Português',
                topic: 'Gramática',
                year: 2024,
                text: 'Assinale a certa.',
                alternatives: [
                    { id: new UniqueEntityID(), text: 'A', isCorrect: true },
                    { id: new UniqueEntityID(), text: 'B', isCorrect: true },
                ],
            });
        }).toThrow('Uma questão deve ter exatamente uma alternativa correta.');
    });

    it('não deve criar uma questão sem nenhuma alternativa correta', () => {
        expect(() => {
            Question.create({
                bank: 'CEBRASPE',
                subject: 'Português',
                topic: 'Gramática',
                year: 2024,
                text: 'Assinale a certa.',
                alternatives: [
                    { id: new UniqueEntityID(), text: 'A', isCorrect: false },
                    { id: new UniqueEntityID(), text: 'B', isCorrect: false },
                ],
            });
        }).toThrow('Uma questão deve ter exatamente uma alternativa correta.');
    });
});
