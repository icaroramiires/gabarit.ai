import { Entity } from '../../../../core/domain/Entity';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';

export interface FlashcardProps {
    deckId: UniqueEntityID;
    front: string;
    back: string;
    createdAt?: Date;
}

export class Flashcard extends Entity<FlashcardProps> {
    get deckId() { return this.props.deckId; }
    get front() { return this.props.front; }
    get back() { return this.props.back; }
    get createdAt() { return this.props.createdAt || new Date(); }

    private constructor(props: FlashcardProps, id?: UniqueEntityID) {
        super({
            ...props,
            createdAt: props.createdAt ?? new Date(),
        }, id);
    }

    public static create(props: FlashcardProps, id?: UniqueEntityID): Flashcard {
        return new Flashcard(props, id);
    }
}
