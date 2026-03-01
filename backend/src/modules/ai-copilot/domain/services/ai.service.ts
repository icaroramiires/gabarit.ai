import { SubjectPerformance } from '../../../assessment/domain/repositories/answer-repository';

export interface ScheduleRebalanceResult {
    subjectAdjustments: {
        subjectId: string;
        subjectName: string;
        recommendedHoursPerWeek: number;
        reasoning: string;
    }[];
}

export abstract class AIService {
    abstract rebalanceSchedule(
        totalAvailableMinutes: number,
        performance: SubjectPerformance[]
    ): Promise<ScheduleRebalanceResult>;

    abstract generateFlashcards(
        sourceText: string,
        maxCards?: number
    ): Promise<{ front: string, back: string }[]>;
}
