import { AIService, ScheduleRebalanceResult } from '../../domain/services/ai.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RebalanceScheduleUseCase {
    constructor(private readonly aiService: AIService) { }

    async execute(userId: string, totalAvailableHours: number, recentPerformance: any): Promise<ScheduleRebalanceResult> {
        // Here we could sanitize the recentPerformance before sending to the LLM
        // For example, aggregate questions answered, hit rate per subject, etc.

        console.log(`[AI Copilot] Processing rebalance for user ${userId}...`);

        const recommendations = await this.aiService.rebalanceSchedule(
            totalAvailableHours * 60, // converting to minutes as interface expects
            recentPerformance
        );

        return recommendations;
    }
}
