import { Either, right } from '../../../../core/logic/Either';
import { FlashcardRepository } from '../../domain/repositories/flashcard-repository';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { Flashcard } from '../../domain/entities/flashcard';

export class GetDueFlashcardsUseCase {
    constructor(private flashcardRepository: FlashcardRepository) { }

    async execute(userId: string, deckId: string, limit: number = 20): Promise<Either<Error, Flashcard[]>> {
        const userUid = new UniqueEntityID(userId);
        const deckUid = new UniqueEntityID(deckId);

        const flashcards = await this.flashcardRepository.getDueFlashcards(userUid, deckUid, limit);

        return right(flashcards);
    }
}
