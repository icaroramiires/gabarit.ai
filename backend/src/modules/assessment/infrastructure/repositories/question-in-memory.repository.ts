import { QuestionRepository } from '../../domain/repositories/question-repository';
import { Question } from '../../domain/entities/question';
import { Answer } from '../../domain/entities/answer';

export class QuestionInMemoryRepository implements QuestionRepository {
    public questions: Question[] = [];
    public answers: Answer[] = [];

    async findManyByFilters(filters: { bank?: string; subject?: string; topic?: string }): Promise<Question[]> {
        return this.questions.filter((q) => {
            if (filters.bank && q.bank !== filters.bank) return false;
            if (filters.subject && q.subject !== filters.subject) return false;
            if (filters.topic && q.topic !== filters.topic) return false;
            return true;
        });
    }

    async findById(id: string): Promise<Question | null> {
        return this.questions.find((q) => q.id.toString() === id) || null;
    }

    async saveAnswer(answer: Answer): Promise<void> {
        const index = this.answers.findIndex((a) => a.id.equals(answer.id));
        if (index > -1) {
            this.answers[index] = answer;
        } else {
            this.answers.push(answer);
        }
    }
}
