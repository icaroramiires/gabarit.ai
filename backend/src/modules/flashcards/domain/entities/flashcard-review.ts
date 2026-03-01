import { Entity } from '../../../../core/domain/Entity';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';

export interface FlashcardReviewProps {
    flashcardId: UniqueEntityID;
    userId: UniqueEntityID;
    easinessFactor: number;
    interval: number;
    repetition: number;
    nextReviewDate: Date;
    reviewedAt?: Date;
}

export type ReviewGrade = 'EASY' | 'GOOD' | 'HARD';

export class FlashcardReview extends Entity<FlashcardReviewProps> {
    get flashcardId() { return this.props.flashcardId; }
    get userId() { return this.props.userId; }
    get easinessFactor() { return this.props.easinessFactor; }
    get interval() { return this.props.interval; }
    get repetition() { return this.props.repetition; }
    get nextReviewDate() { return this.props.nextReviewDate; }
    get reviewedAt() { return this.props.reviewedAt; }

    /**
     * Algoritmo SM-2 (SuperMemo-2) Otimizado para 3 Botões
     * HARD = 1, GOOD = 3, EASY = 5 (mapeamento simplificado do quality)
     */
    public applyReview(grade: ReviewGrade): void {
        let quality = 0;

        if (grade === 'HARD') quality = 1;      // Errei ou Muito Difícil (Queda severa)
        else if (grade === 'GOOD') quality = 3; // Acertei (Padrão)
        else if (grade === 'EASY') quality = 5; // Muito Fácil

        if (quality < 3) {
            // Em caso de erro (HARD), a repetição zera e o intervalo volta pra 1 dia.
            this.props.repetition = 0;
            this.props.interval = 1;
        } else {
            // Se Acertou
            if (this.props.repetition === 0) {
                this.props.interval = 1;
            } else if (this.props.repetition === 1) {
                this.props.interval = 6;
            } else {
                this.props.interval = Math.round(this.props.interval * this.props.easinessFactor);
            }
            this.props.repetition += 1;
        }

        // Calcula novo Easiness Factor (Nunca menor que 1.3)
        // Fórmula original: EF = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
        this.props.easinessFactor = this.props.easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        if (this.props.easinessFactor < 1.3) this.props.easinessFactor = 1.3;

        // Define próxima data
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + this.props.interval);

        this.props.nextReviewDate = nextDate;
        this.props.reviewedAt = new Date();
    }

    private constructor(props: FlashcardReviewProps, id?: UniqueEntityID) {
        super({
            ...props,
            reviewedAt: props.reviewedAt ?? new Date(),
        }, id);
    }

    public static create(props: FlashcardReviewProps, id?: UniqueEntityID): FlashcardReview {
        // Se é a primeira vez (novo card), seta default values pra SM-2
        const isNew = !id;
        const finalProps = {
            ...props,
            easinessFactor: isNew ? 2.5 : props.easinessFactor,
            interval: isNew ? 0 : props.interval,
            repetition: isNew ? 0 : props.repetition,
            nextReviewDate: isNew ? new Date() : props.nextReviewDate,
        };
        return new FlashcardReview(finalProps, id);
    }
}
