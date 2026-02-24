import { Entity } from '../../../../core/domain/Entity';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { Question } from './question';

export interface AnswerProps {
    userId: UniqueEntityID;
    questionId: UniqueEntityID;
    selectedAlternativeId: UniqueEntityID;
    isCorrect: boolean;
    createdAt?: Date;
}

export class Answer extends Entity<AnswerProps> {
    get userId() { return this.props.userId; }
    get questionId() { return this.props.questionId; }
    get selectedAlternativeId() { return this.props.selectedAlternativeId; }
    get isCorrect() { return this.props.isCorrect; }
    get createdAt() { return this.props.createdAt; }

    private constructor(props: AnswerProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(
        props: Omit<AnswerProps, 'isCorrect' | 'createdAt'>,
        question: Question,
        id?: UniqueEntityID
    ): Answer {
        if (!props.userId || !props.questionId || !props.selectedAlternativeId) {
            throw new Error('Parâmetros inválidos para criação da resposta.');
        }

        if (question.id.toString() !== props.questionId.toString()) {
            throw new Error('A questão informada não corresponde ao ID da resposta.');
        }

        const selectedAlternative = question.alternatives.find(
            a => a.id.equals(props.selectedAlternativeId)
        );

        if (!selectedAlternative) {
            throw new Error('Alternativa selecionada não pertence a esta questão.');
        }

        return new Answer({
            ...props,
            isCorrect: selectedAlternative.isCorrect,
            createdAt: new Date(),
        }, id);
    }
}
