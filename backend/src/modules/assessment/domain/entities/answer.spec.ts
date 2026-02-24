import { Answer } from './answer';
import { Question } from './question';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';

describe('Answer Entity', () => {
    let question: Question;
    const correctAlternativeId = new UniqueEntityID();
    const wrongAlternativeId = new UniqueEntityID();

    beforeEach(() => {
        question = Question.create({
            bank: 'FGV',
            subject: 'Matemática',
            topic: 'Probabilidade',
            year: 2023,
            text: 'Qual a chance de...',
            alternatives: [
                { id: correctAlternativeId, text: '50%', isCorrect: true },
                { id: wrongAlternativeId, text: '20%', isCorrect: false },
            ],
        }, new UniqueEntityID());
    });

    it('deve criar uma resposta correta quando selecionar a alternativa certa', () => {
        const answer = Answer.create({
            userId: new UniqueEntityID(),
            questionId: question.id,
            selectedAlternativeId: correctAlternativeId,
        }, question);

        expect(answer).toBeInstanceOf(Answer);
        expect(answer.isCorrect).toBe(true);
        expect(answer.createdAt).toBeInstanceOf(Date);
    });

    it('deve criar uma resposta incorreta quando selecionar a alternativa errada', () => {
        const answer = Answer.create({
            userId: new UniqueEntityID(),
            questionId: question.id,
            selectedAlternativeId: wrongAlternativeId,
        }, question);

        expect(answer.isCorrect).toBe(false);
    });

    it('deve lançar erro se a alternativa não pertencer à questão', () => {
        expect(() => {
            Answer.create({
                userId: new UniqueEntityID(),
                questionId: question.id,
                selectedAlternativeId: new UniqueEntityID(), // ID Inexistente
            }, question);
        }).toThrow('Alternativa selecionada não pertence a esta questão.');
    });

    it('deve lançar erro se a questão passada não bater com o questionId', () => {
        expect(() => {
            Answer.create({
                userId: new UniqueEntityID(),
                questionId: new UniqueEntityID(), // ID Diferente de question.id
                selectedAlternativeId: correctAlternativeId,
            }, question);
        }).toThrow('A questão informada não corresponde ao ID da resposta.');
    });
});
