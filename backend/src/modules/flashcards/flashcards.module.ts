import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AiCopilotModule } from '../ai-copilot/ai-copilot.module';
import { FlashcardsController } from './presentation/flashcards.controller';
import { FlashcardPrismaRepository } from './infrastructure/repositories/flashcard-prisma.repository';
import { CreateDeckUseCase } from './application/usecases/create-deck.usecase';
import { GenerateDeckFromTextUseCase } from './application/usecases/generate-deck-from-text.usecase';
import { GetDueFlashcardsUseCase } from './application/usecases/get-due-flashcards.usecase';
import { ReviewFlashcardUseCase } from './application/usecases/review-flashcard.usecase';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AIService } from '../ai-copilot/domain/services/ai.service';
import { FlashcardRepository } from './domain/repositories/flashcard-repository';

@Module({
    imports: [PrismaModule, AiCopilotModule],
    controllers: [FlashcardsController],
    providers: [
        {
            provide: 'FlashcardRepository',
            useClass: FlashcardPrismaRepository,
        },
        {
            provide: CreateDeckUseCase,
            useFactory: (repo: FlashcardRepository) => new CreateDeckUseCase(repo),
            inject: ['FlashcardRepository']
        },
        {
            provide: GenerateDeckFromTextUseCase,
            useFactory: (repo: FlashcardRepository, ai: AIService) => new GenerateDeckFromTextUseCase(repo, ai),
            inject: ['FlashcardRepository', AIService]
        },
        {
            provide: GetDueFlashcardsUseCase,
            useFactory: (repo: FlashcardRepository) => new GetDueFlashcardsUseCase(repo),
            inject: ['FlashcardRepository']
        },
        {
            provide: ReviewFlashcardUseCase,
            useFactory: (repo: FlashcardRepository) => new ReviewFlashcardUseCase(repo),
            inject: ['FlashcardRepository']
        }
    ],
    exports: ['FlashcardRepository']
})
export class FlashcardsModule { }
