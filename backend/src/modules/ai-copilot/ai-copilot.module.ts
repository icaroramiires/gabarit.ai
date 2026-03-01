import { Module } from '@nestjs/common';
import { AIService } from './domain/services/ai.service';
import { OpenAIAIService } from './infrastructure/services/openai-ai.service';
import { RebalanceScheduleUseCase } from './application/usecases/rebalance-schedule.usecase';

@Module({
    providers: [
        {
            provide: AIService,
            useClass: OpenAIAIService,
        },
        RebalanceScheduleUseCase,
    ],
    exports: [
        AIService,
        RebalanceScheduleUseCase,
    ]
})
export class AiCopilotModule { }
