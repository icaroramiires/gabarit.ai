import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { QuestionRepository } from '../../domain/repositories/question-repository';
import { Question } from '../../domain/entities/question';
import { Answer } from '../../domain/entities/answer';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';

@Injectable()
export class QuestionPrismaRepository implements QuestionRepository {
    constructor(private prisma: PrismaService) { }

    async findManyByFilters(filters: { bank?: string; subject?: string; topic?: string }): Promise<Question[]> {
        const questionsData = await this.prisma.question.findMany({
            where: {
                ...(filters.bank && { bank: filters.bank }),
                ...(filters.subject && { subject: filters.subject }),
                ...(filters.topic && { topic: filters.topic }),
            },
            include: {
                alternatives: true,
            },
            take: 10, // Limitando para MVP
        });

        return questionsData.map((data: any) =>
            Question.create(
                {
                    bank: data.bank,
                    subject: data.subject,
                    topic: data.topic,
                    year: data.year,
                    text: data.text,
                    createdAt: data.createdAt,
                    alternatives: data.alternatives.map((a: any) => ({
                        id: new UniqueEntityID(a.id),
                        text: a.text,
                        isCorrect: a.isCorrect,
                        explanation: a.explanation || undefined,
                    })),
                },
                new UniqueEntityID(data.id)
            )
        );
    }

    async findById(id: string): Promise<Question | null> {
        const data = await this.prisma.question.findUnique({
            where: { id },
            include: { alternatives: true },
        });

        if (!data) return null;

        return Question.create(
            {
                bank: data.bank,
                subject: data.subject,
                topic: data.topic,
                year: data.year,
                text: data.text,
                createdAt: data.createdAt,
                alternatives: data.alternatives.map((a: any) => ({
                    id: new UniqueEntityID(a.id),
                    text: a.text,
                    isCorrect: a.isCorrect,
                    explanation: a.explanation || undefined,
                })),
            },
            new UniqueEntityID(data.id)
        );
    }

    async saveAnswer(answer: Answer): Promise<void> {
        await this.prisma.answer.create({
            data: {
                id: answer.id.toString(),
                userId: answer.userId.toString(),
                questionId: answer.questionId.toString(),
                selectedAlternativeId: answer.selectedAlternativeId.toString(),
                isCorrect: answer.isCorrect,
                createdAt: answer.createdAt,
            },
        });
    }
}
