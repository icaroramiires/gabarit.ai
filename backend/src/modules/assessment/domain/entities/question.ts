import { Entity } from '../../../../core/domain/Entity';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';

export interface AlternativeProps {
    id: UniqueEntityID;
    text: string;
    isCorrect: boolean;
    explanation?: string;
}

export interface QuestionProps {
    bank: string;
    subject: string;
    topic: string;
    year: number;
    text: string;
    alternatives: AlternativeProps[];
    createdAt?: Date;
}

export class Question extends Entity<QuestionProps> {
    get bank() { return this.props.bank; }
    get subject() { return this.props.subject; }
    get topic() { return this.props.topic; }
    get year() { return this.props.year; }
    get text() { return this.props.text; }
    get alternatives() { return this.props.alternatives; }
    get createdAt() { return this.props.createdAt; }

    private constructor(props: QuestionProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: QuestionProps, id?: UniqueEntityID): Question {
        if (!props.alternatives || props.alternatives.length === 0) {
            throw new Error('Uma questão deve ter pelo menos uma alternativa.');
        }

        const correctAlternatives = props.alternatives.filter(a => a.isCorrect);
        if (correctAlternatives.length !== 1) {
            throw new Error('Uma questão deve ter exatamente uma alternativa correta.');
        }

        return new Question({
            ...props,
            createdAt: props.createdAt || new Date(),
        }, id);
    }
}
