import { Either, left, right } from '../../../../core/logic/Either';
import { FlashcardRepository } from '../../domain/repositories/flashcard-repository';
import { AIService } from '../../../ai-copilot/domain/services/ai.service';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { Deck } from '../../domain/entities/deck';
import { Flashcard } from '../../domain/entities/flashcard';

export class GenerateDeckFromTextUseCase {
    constructor(
        private flashcardRepository: FlashcardRepository,
        private aiService: AIService
    ) { }

    async execute(userId: string, deckName: string, sourceText: string): Promise<Either<Error, Deck>> {
        if (!sourceText || sourceText.length < 50) {
            return left(new Error('O texto base precisa ter ao menos 50 caracteres para extração.'));
        }

        if (!deckName || deckName.trim().length === 0) {
            deckName = "Resumo Automático";
        }

        // 1. Invoca a IA pedindo para abstrair em Flashcards
        let generatedCards;
        try {
            generatedCards = await this.aiService.generateFlashcards(sourceText, 10);
        } catch (error) {
            return left(new Error('Falha na geração via AI Copilot. Tente novamente mais tarde.'));
        }

        if (!generatedCards || generatedCards.length === 0) {
            return left(new Error('A IA não conseguiu extrair blocos de informação úteis do texto.'));
        }

        // 2. Cria o Baralho
        const deck = Deck.create({
            userId: new UniqueEntityID(userId),
            name: deckName,
            description: `Deck gerado pelo AI Copilot via JSON Extractor.`,
        });

        await this.flashcardRepository.createDeck(deck);

        // 3. Monta e Insere os Flashcards no Banco
        const flashcards = generatedCards.map(c => Flashcard.create({
            deckId: deck.id,
            front: c.front,
            back: c.back,
        }));

        await this.flashcardRepository.createManyFlashcards(flashcards);

        return right(deck);
    }
}
