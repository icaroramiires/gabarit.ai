import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { StudyPlanningModule } from './modules/study-planning/study-planning.module';
import { AssessmentModule } from './modules/assessment/assessment.module';
import { IdentityAccessModule } from './modules/identity-access/identity-access.module';
import { GamificationModule } from './modules/gamification/gamification.module';
import { CheckoutModule } from './modules/checkout/checkout.module';

@Module({
  imports: [PrismaModule, IdentityAccessModule, StudyPlanningModule, AssessmentModule, GamificationModule, CheckoutModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
