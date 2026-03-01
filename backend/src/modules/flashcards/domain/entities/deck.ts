import { Entity } from '../../../../core/domain/Entity';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';

export interface DeckProps {
    userId: UniqueEntityID;
    name: string;
    description?: string;
    createdAt?: Date;
}

export class Deck extends Entity<DeckProps> {
    get userId() { return this.props.userId; }
    get name() { return this.props.name; }
    get description() { return this.props.description; }
    get createdAt() { return this.props.createdAt || new Date(); }

    private constructor(props: DeckProps, id?: UniqueEntityID) {
        super({
            ...props,
            createdAt: props.createdAt ?? new Date(),
        }, id);
    }

    public static create(props: DeckProps, id?: UniqueEntityID): Deck {
        return new Deck(props, id);
    }
}
