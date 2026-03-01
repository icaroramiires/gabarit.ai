import { Injectable } from '@nestjs/common';
import { AnswerRepository, SubjectPerformance } from '../../domain/repositories/answer-repository';

@Injectable()
export class GetWeeklyPerformanceUseCase {
    constructor(private readonly answerRepository: AnswerRepository) { }

    async execute(userId: string): Promise<SubjectPerformance[]> {
        // Last 7 days timeframe
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);

        return await this.answerRepository.getWeeklyPerformanceBySubject(userId, lastWeek);
    }
}
