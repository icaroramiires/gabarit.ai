import { Question } from '../entities/question';
import { Answer } from '../entities/answer';

export interface QuestionRepository {
    findManyByFilters(filters: { bank?: string; subject?: string; topic?: string }): Promise<Question[]>;
    findById(id: string): Promise<Question | null>;
    saveAnswer(answer: Answer): Promise<void>;
}
