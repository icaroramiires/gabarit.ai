import { Injectable } from '@nestjs/common';
import { AIService, ScheduleRebalanceResult } from '../../domain/services/ai.service';
import { SubjectPerformance } from '../../../assessment/domain/repositories/answer-repository';

@Injectable()
export class OpenAIAIService extends AIService {
    async rebalanceSchedule(totalAvailableMinutes: number, performance: SubjectPerformance[]): Promise<ScheduleRebalanceResult> {
        // MOCK: Integration to actual OpenAI SDK would happen here.
        return {
            subjectAdjustments: [
                {
                    subjectId: "SUBJECT_MATH_ID",
                    subjectName: "Matemática Financeira",
                    recommendedHoursPerWeek: Math.floor(totalAvailableMinutes * 0.4),
                    reasoning: "Desempenho de 30% na última semana. É necessário reforçar os conceitos de Juros Compostos.",
                },
                {
                    subjectId: "SUBJECT_LAW_ID",
                    subjectName: "Direito Constitucional",
                    recommendedHoursPerWeek: Math.floor(totalAvailableMinutes * 0.2),
                    reasoning: "Ótimo desempenho (85%). Carga horária reduzida para focar em áreas mais críticas.",
                },
                {
                    subjectId: "SUBJECT_INFO_ID",
                    subjectName: "Noções de Informática",
                    recommendedHoursPerWeek: Math.floor(totalAvailableMinutes * 0.4),
                    reasoning: "Queda de 15% nos acertos de Segurança da Informação. Alocação aumentada.",
                },
            ]
        };
    }

    async generateFlashcards(sourceText: string, maxCards: number = 5): Promise<{ front: string; back: string; }[]> {
        const mockedCards = [
            { front: "O que diz o Art. 5º, caput da CF/88 sobre o direito à vida?", back: "Garante a inviolabilidade do direito à vida, à liberdade, à igualdade, à segurança e à propriedade." },
            { front: "Quais são os fundamentos da República (Art 1º)?", back: "Soberania, Cidadania, Dignidade da pessoa humana, Valores sociais do trabalho/livre iniciativa e Pluralismo político (SOCIDIVAPLU)." }
        ];

        return mockedCards;
    }
}
