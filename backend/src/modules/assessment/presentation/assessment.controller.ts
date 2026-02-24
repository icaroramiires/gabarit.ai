import { Controller, Get, Post, Param, Body, Query, HttpException, HttpStatus } from '@nestjs/common';
import { GetQuestionsUseCase } from '../application/usecases/get-questions.usecase';
import { SubmitAnswerUseCase } from '../application/usecases/submit-answer.usecase';

// DTO local para o Controller map
class SubmitAnswerDto {
    userId: string;
    selectedAlternativeId: string;
}

@Controller('assessment/questions')
export class AssessmentController {
    constructor(
        private readonly getQuestionsUseCase: GetQuestionsUseCase,
        private readonly submitAnswerUseCase: SubmitAnswerUseCase,
    ) { }

    @Get()
    async getQuestions(
        @Query('bank') bank?: string,
        @Query('subject') subject?: string,
        @Query('topic') topic?: string,
    ) {
        const result = await this.getQuestionsUseCase.execute({ bank, subject, topic });

        if (result.isLeft()) {
            throw new HttpException(result.value.message, HttpStatus.BAD_REQUEST);
        }

        return {
            data: result.value.map((q) => ({
                id: q.id.toString(),
                bank: q.bank,
                subject: q.subject,
                topic: q.topic,
                year: q.year,
                text: q.text,
                alternatives: q.alternatives.map((a) => ({
                    id: a.id.toString(),
                    text: a.text,
                    // Não enviar 'isCorrect' e 'explanation' pro front no GET pra evitar cheater no React DevTools
                })),
            })),
        };
    }

    @Post(':id/answer')
    async submitAnswer(
        @Param('id') questionId: string,
        @Body() dto: SubmitAnswerDto,
    ) {
        const result = await this.submitAnswerUseCase.execute({
            userId: dto.userId,
            questionId,
            selectedAlternativeId: dto.selectedAlternativeId,
        });

        if (result.isLeft()) {
            throw new HttpException(result.value.message, HttpStatus.BAD_REQUEST);
        }

        return {
            message: 'Resposta registrada com sucesso.',
            data: {
                id: result.value.id.toString(),
                isCorrect: result.value.isCorrect,
                // Aqui no post o frontend precisa do feedback, então ele descobre se acertou
            },
        };
    }
}
