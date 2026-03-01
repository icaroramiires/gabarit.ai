import { Either, left, right } from '../../../../core/logic/Either';
import { FlashcardRepository } from '../../domain/repositories/flashcard-repository';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { Deck } from '../../domain/entities/deck';

export class CreateDeckUseCase {
    constructor(private flashcardRepository: FlashcardRepository) { }

    async execute(userId: string, name: string, description?: string): Promise<Either<Error, Deck>> {
        if (!name || name.trim().length === 0) {
            return left(new Error('Nome do baralho é obrigatório.'));
        }

        const deck = Deck.create({
            userId: new UniqueEntityID(userId),
            name,
            description,
        });

        await this.flashcardRepository.createDeck(deck);

        return right(deck);
    }
}
