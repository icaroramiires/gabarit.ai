import { Controller, Post, Patch, Param, Body, HttpException, HttpStatus, Get } from '@nestjs/common';
import { GenerateBaseScheduleUseCase } from '../application/usecases/generate-base-schedule.usecase';
import { MarkBlockCompletedUseCase } from '../application/usecases/mark-block-completed.usecase';
import { GetSchedulesUseCase } from '../application/usecases/get-schedules.usecase';
import { StartStudySessionUseCase } from '../application/usecases/start-study-session.usecase';
import { PauseStudySessionUseCase } from '../application/usecases/pause-study-session.usecase';
import { GenerateBaseScheduleRequestDto } from '../application/dtos/generate-base-schedule.dto';

@Controller('study-schedules')
export class StudyPlanningController {
    constructor(
        private readonly generateBaseSchedule: GenerateBaseScheduleUseCase,
        private readonly markBlockCompleted: MarkBlockCompletedUseCase,
        private readonly getSchedulesUseCase: GetSchedulesUseCase,
        private readonly startStudySession: StartStudySessionUseCase,
        private readonly pauseStudySession: PauseStudySessionUseCase,
    ) { }

    @Post('user/:userId/generate')
    async generateSchedule(@Param('userId') userId: string, @Body() dto: GenerateBaseScheduleRequestDto) {
        const result = await this.generateBaseSchedule.execute({ ...dto, userId });

        if (result.isLeft()) {
            throw new HttpException(result.value.message, HttpStatus.BAD_REQUEST);
        }

        return {
            message: 'Cronograma gerado com sucesso.',
            data: {
                id: result.value.id.toString(),
                blocks: result.value.blocks.map((block) => ({
                    id: block.id.toString(),
                    subject: block.subject,
                    topic: block.topic,
                    status: block.status,
                    plannedDurationInMinutes: block.plannedDurationInMinutes,
                    elapsedTimeInMinutes: block.elapsedTimeInMinutes,
                    completedAt: block.completedAt,
                })),
            },
        };
    }

    @Get('user/:userId')
    async getSchedules(@Param('userId') userId: string) {
        const schedules = await this.getSchedulesUseCase.execute(userId);

        return {
            data: schedules.map(s => ({
                id: s.id.toString(),
                targetExam: s.targetExam,
                blocks: s.blocks.map(b => ({
                    id: b.id.toString(),
                    subject: b.subject,
                    topic: b.topic,
                    plannedDurationInMinutes: b.plannedDurationInMinutes,
                    status: b.status,
                    elapsedTimeInMinutes: b.elapsedTimeInMinutes,
                    startedAt: b.startedAt,
                    completedAt: b.completedAt,
                })),
            })),
        };
    }

    @Patch(':scheduleId/blocks/:blockId/start')
    async startBlock(
        @Param('scheduleId') scheduleId: string,
        @Param('blockId') blockId: string,
    ) {
        try {
            await this.startStudySession.execute(scheduleId, blockId);
            return {
                message: 'Study session started successfully',
                data: { blockId, status: 'in-progress' }
            };
        } catch (error: any) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Patch(':scheduleId/blocks/:blockId/pause')
    async pauseBlock(
        @Param('scheduleId') scheduleId: string,
        @Param('blockId') blockId: string,
        @Body('elapsedMinutes') elapsedMinutes: number
    ) {
        try {
            await this.pauseStudySession.execute(scheduleId, blockId, elapsedMinutes || 0);
            return {
                message: 'Study session paused successfully',
                data: { blockId, status: 'pending' }
            };
        } catch (error: any) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Patch(':scheduleId/blocks/:blockId/complete')
    async completeBlock(
        @Param('scheduleId') scheduleId: string,
        @Param('blockId') blockId: string,
    ) {
        const result = await this.markBlockCompleted.execute({ scheduleId, blockId });

        if (result.isLeft()) {
            throw new HttpException(result.value.message, HttpStatus.BAD_REQUEST);
        }

        return {
            message: 'Bloco marcado como concluído com sucesso.',
            data: {
                completedBlockId: blockId,
            },
        };
    }
}
