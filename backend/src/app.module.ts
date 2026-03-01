import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { StudyPlanningModule } from './modules/study-planning/study-planning.module';
import { AssessmentModule } from './modules/assessment/assessment.module';
import { IdentityAccessModule } from './modules/identity-access/identity-access.module';
import { GamificationModule } from './modules/gamification/gamification.module';
import { CheckoutModule } from './modules/checkout/checkout.module';
import { AiCopilotModule } from './modules/ai-copilot/ai-copilot.module';
import { FlashcardsModule } from './modules/flashcards/flashcards.module';
import { PerformanceModule } from './modules/performance/performance.module';

@Module({
  imports: [
    PrismaModule,
    IdentityAccessModule,
    StudyPlanningModule,
    AssessmentModule,
    GamificationModule,
    CheckoutModule,
    AiCopilotModule,
    FlashcardsModule,
    PerformanceModule,
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
