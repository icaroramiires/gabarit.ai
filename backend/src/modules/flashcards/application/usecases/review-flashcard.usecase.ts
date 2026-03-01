import { Either, left, right } from '../../../../core/logic/Either';
import { FlashcardRepository } from '../../domain/repositories/flashcard-repository';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { FlashcardReview, ReviewGrade } from '../../domain/entities/flashcard-review';

export class ReviewFlashcardUseCase {
    constructor(private flashcardRepository: FlashcardRepository) { }

    async execute(userId: string, flashcardId: string, grade: ReviewGrade): Promise<Either<Error, FlashcardReview>> {
        const userUid = new UniqueEntityID(userId);
        const flashcardUid = new UniqueEntityID(flashcardId);

        // Verifica se o flashcard existe
        const flashcard = await this.flashcardRepository.getFlashcardById(flashcardUid);
        if (!flashcard) {
            return left(new Error('Flashcard não encontrado.'));
        }

        // Busca ou Cria a Métrica de Revisão Ativa
        let review = await this.flashcardRepository.findReview(userUid, flashcardUid);

        if (!review) {
            review = FlashcardReview.create({
                userId: userUid,
                flashcardId: flashcardUid,
                easinessFactor: 2.5,
                interval: 0,
                repetition: 0,
                nextReviewDate: new Date(),
            });
        }

        // Aplica o Algoritmo SM-2 (Fácil, Bom, Difícil)
        review.applyReview(grade);

        // Persiste as Métricas de Espaçamento
        await this.flashcardRepository.createOrUpdateReview(review);

        return right(review);
    }
}
