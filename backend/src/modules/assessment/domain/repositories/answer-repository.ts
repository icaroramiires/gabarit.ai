export interface SubjectPerformance {
    subjectId: string;
    subjectName: string;
    totalAnswered: number;
    correctAnswers: number;
    accuracyRate: number; // 0 to 1
}

export interface DailyPerformance {
    date: string; // ISO Date YYYY-MM-DD
    totalAnswered: number;
    correctAnswers: number;
}

export abstract class AnswerRepository {
    abstract getWeeklyPerformanceBySubject(userId: string, since: Date): Promise<SubjectPerformance[]>;
    abstract getDailyPerformanceHistory(userId: string, days: number): Promise<DailyPerformance[]>;
}
