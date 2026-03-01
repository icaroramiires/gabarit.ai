import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { AnswerRepository, SubjectPerformance, DailyPerformance } from '../../domain/repositories/answer-repository';

@Injectable()
export class AnswerPrismaRepository implements AnswerRepository {
    constructor(private readonly prisma: PrismaService) { }

    async getWeeklyPerformanceBySubject(userId: string, since: Date): Promise<SubjectPerformance[]> {
        const answers = await this.prisma.answer.findMany({
            where: {
                userId,
                createdAt: {
                    gte: since
                }
            },
            include: {
                question: true
            }
        });

        // Grouping logic
        const subjectMap = new Map<string, { total: number, correct: number }>();

        answers.forEach(ans => {
            const subj = ans.question.subject;
            const current = subjectMap.get(subj) || { total: 0, correct: 0 };

            current.total += 1;
            if (ans.isCorrect) current.correct += 1;

            subjectMap.set(subj, current);
        });

        const performance: SubjectPerformance[] = [];
        subjectMap.forEach((data, subjectName) => {
            performance.push({
                subjectId: subjectName, // Fallback to name as ID
                subjectName: subjectName,
                totalAnswered: data.total,
                correctAnswers: data.correct,
                accuracyRate: data.total > 0 ? data.correct / data.total : 0
            });
        });

        return performance;
    }

    async getDailyPerformanceHistory(userId: string, days: number): Promise<DailyPerformance[]> {
        const since = new Date();
        since.setDate(since.getDate() - days);

        const answers = await this.prisma.answer.findMany({
            where: {
                userId,
                createdAt: {
                    gte: since
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        const historyMap = new Map<string, { total: number, correct: number }>();

        answers.forEach(ans => {
            const dateStr = ans.createdAt.toISOString().split('T')[0];
            const current = historyMap.get(dateStr) || { total: 0, correct: 0 };

            current.total += 1;
            if (ans.isCorrect) current.correct += 1;

            historyMap.set(dateStr, current);
        });

        const history: DailyPerformance[] = [];
        historyMap.forEach((data, date) => {
            history.push({
                date,
                totalAnswered: data.total,
                correctAnswers: data.correct
            });
        });

        return history;
    }
}
