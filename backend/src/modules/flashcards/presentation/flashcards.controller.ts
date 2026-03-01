import { Controller, Post, Get, Body, Param, UseGuards, Req, Inject } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateDeckUseCase } from '../application/usecases/create-deck.usecase';
import { GenerateDeckFromTextUseCase } from '../application/usecases/generate-deck-from-text.usecase';
import { ReviewFlashcardUseCase } from '../application/usecases/review-flashcard.usecase';
import { GetDueFlashcardsUseCase } from '../application/usecases/get-due-flashcards.usecase';
import type { FlashcardRepository } from '../domain/repositories/flashcard-repository';
import { UniqueEntityID } from '../../../core/domain/UniqueEntityID';
import { ReviewGrade } from '../domain/entities/flashcard-review';

@Controller('flashcards')
@UseGuards(AuthGuard('jwt'))
export class FlashcardsController {
    constructor(
        private readonly createDeckUseCase: CreateDeckUseCase,
        private readonly generateDeckFromTextUseCase: GenerateDeckFromTextUseCase,
        private readonly reviewFlashcardUseCase: ReviewFlashcardUseCase,
        private readonly getDueFlashcardsUseCase: GetDueFlashcardsUseCase,
        @Inject('FlashcardRepository') private readonly flashcardRepo: FlashcardRepository,
    ) { }

    @Get('decks')
    async getMyDecks(@Req() req: any) {
        const userId = req.user.sub;
        const decks = await this.flashcardRepo.getDecksByUserId(new UniqueEntityID(userId));
        return {
            data: decks.map(d => ({
                id: d.id.toValue(),
                name: d.name,
                description: d.description,
            }))
        };
    }

    @Get('decks/:deckId')
    async getDeckById(@Param('deckId') deckId: string) {
        const deck = await this.flashcardRepo.findDeckById(new UniqueEntityID(deckId));
        return {
            data: deck ? { id: deck.id.toValue(), name: deck.name, description: deck.description } : null
        };
    }

    @Post('decks')
    async createDeck(@Req() req: any, @Body() body: { name: string; description?: string }) {
        const userId = req.user.sub;
        const result = await this.createDeckUseCase.execute(userId, body.name, body.description);

        if (result.isLeft()) {
            return { error: result.value.message };
        }
        return { data: { id: result.value.id.toValue(), name: result.value.name } };
    }

    @Post('decks/generate')
    async generateDeckFromText(@Req() req: any, @Body() body: { name: string; text: string }) {
        const userId = req.user.sub;
        const result = await this.generateDeckFromTextUseCase.execute(userId, body.name, body.text);

        if (result.isLeft()) {
            return { error: result.value.message };
        }
        return { data: { id: result.value.id.toValue(), name: result.value.name } };
    }

    @Get('decks/:deckId/due')
    async getDueFlashcards(@Req() req: any, @Param('deckId') deckId: string) {
        const userId = req.user.sub;
        const result = await this.getDueFlashcardsUseCase.execute(userId, deckId);

        if (result.isLeft()) {
            return { error: result.value.message };
        }

        return {
            data: result.value.map(f => ({
                id: f.id.toValue(),
                front: f.front,
                back: f.back
            }))
        };
    }

    @Post('reviews')
    async reviewCard(@Req() req: any, @Body() body: { flashcardId: string; grade: ReviewGrade }) {
        const userId = req.user.sub;
        const result = await this.reviewFlashcardUseCase.execute(userId, body.flashcardId, body.grade);

        if (result.isLeft()) {
            return { error: result.value.message };
        }

        const review = result.value;
        return {
            data: {
                id: review.id.toValue(),
                repetition: review.repetition,
                interval: review.interval,
                nextReviewDate: review.nextReviewDate,
            }
        };
    }
}
