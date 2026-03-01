import { AnswerRepository } from '../../../assessment/domain/repositories/answer-repository';
import { FlashcardRepository } from '../../../flashcards/domain/repositories/flashcard-repository';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';

export class GetPerformanceStatsUseCase {
    constructor(
        private readonly answerRepo: AnswerRepository,
        private readonly flashcardRepo: FlashcardRepository
    ) { }

    async execute(userId: string) {
        const since = new Date();
        since.setDate(since.getDate() - 7);

        const [weeklyPerformance, history, flashcardStats] = await Promise.all([
            this.answerRepo.getWeeklyPerformanceBySubject(userId, since),
            this.answerRepo.getDailyPerformanceHistory(userId, 30),
            this.flashcardRepo.getPerformanceStats(new UniqueEntityID(userId))
        ]);

        return {
            quizzes: {
                weekly: weeklyPerformance,
                history,
                globalAccuracy: history.length > 0
                    ? history.reduce((acc: number, curr: any) => acc + curr.correctAnswers, 0) / history.reduce((acc: number, curr: any) => acc + curr.totalAnswered, 0)
                    : 0
            },
            flashcards: flashcardStats
        };
    }
}
