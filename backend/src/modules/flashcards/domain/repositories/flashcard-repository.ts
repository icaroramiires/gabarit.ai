import { Deck } from '../entities/deck';
import { Flashcard } from '../entities/flashcard';
import { FlashcardReview } from '../entities/flashcard-review';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';

export interface FlashcardStats {
    totalDecks: number;
    totalCards: number;
    totalReviews: number;
    accuracyRate: number;
}

export interface FlashcardRepository {
    createDeck(deck: Deck): Promise<void>;
    findDeckById(deckId: UniqueEntityID): Promise<Deck | null>;
    getDecksByUserId(userId: UniqueEntityID): Promise<Deck[]>;

    createFlashcard(flashcard: Flashcard): Promise<void>;
    createManyFlashcards(flashcards: Flashcard[]): Promise<void>;

    getFlashcardById(flashcardId: UniqueEntityID): Promise<Flashcard | null>;

    createOrUpdateReview(review: FlashcardReview): Promise<void>;
    findReview(userId: UniqueEntityID, flashcardId: UniqueEntityID): Promise<FlashcardReview | null>;

    getDueFlashcards(userId: UniqueEntityID, deckId: UniqueEntityID, limit?: number): Promise<Flashcard[]>;
    getPerformanceStats(userId: UniqueEntityID): Promise<FlashcardStats>;
}
