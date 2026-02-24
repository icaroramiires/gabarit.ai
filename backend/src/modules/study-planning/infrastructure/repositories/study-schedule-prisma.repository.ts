import { Injectable } from '@nestjs/common';
import { StudyScheduleRepository } from '../../domain/repositories/study-schedule-repository';
import { StudySchedule } from '../../domain/entities/study-schedule';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { StudyBlock } from '../../domain/entities/study-block';

@Injectable()
export class StudySchedulePrismaRepository implements StudyScheduleRepository {
    constructor(private prisma: PrismaService) { }

    async findById(id: UniqueEntityID): Promise<StudySchedule | null> {
        const data = await this.prisma.studySchedule.findUnique({
            where: { id: id.toString() },
            include: { blocks: true },
        });

        if (!data) return null;

        return this.mapToDomain(data);
    }

    async findByUserId(userId: UniqueEntityID): Promise<StudySchedule[]> {
        const dataList = await this.prisma.studySchedule.findMany({
            where: { userId: userId.toString() },
            include: { blocks: true },
        });

        return dataList.map((data) => this.mapToDomain(data));
    }

    async create(schedule: StudySchedule): Promise<void> {
        await this.prisma.studySchedule.create({
            data: {
                id: schedule.id.toString(),
                userId: schedule.userId.toString(),
                targetExam: schedule.targetExam,
                startDate: schedule.startDate,
                createdAt: schedule.createdAt,
                blocks: {
                    create: schedule.blocks.map((block) => ({
                        id: block.id.toString(),
                        subject: block.subject,
                        topic: block.topic,
                        plannedDurationInMinutes: block.plannedDurationInMinutes,
                        status: block.status,
                        startedAt: block.startedAt,
                        elapsedTimeInMinutes: block.elapsedTimeInMinutes,
                        completedAt: block.completedAt,
                        createdAt: block.createdAt,
                    })),
                },
            },
        });
    }

    async save(schedule: StudySchedule): Promise<void> {
        // In a real scenario you would update the aggregate.
        // Simplifying by updating the schedule basic info and upserting blocks.
        await this.prisma.studySchedule.update({
            where: { id: schedule.id.toString() },
            data: {
                targetExam: schedule.targetExam,
                startDate: schedule.startDate,
            },
        });

        for (const block of schedule.blocks) {
            await this.prisma.studyBlock.upsert({
                where: { id: block.id.toString() },
                create: {
                    id: block.id.toString(),
                    scheduleId: schedule.id.toString(),
                    subject: block.subject,
                    topic: block.topic,
                    plannedDurationInMinutes: block.plannedDurationInMinutes,
                    status: block.status,
                    startedAt: block.startedAt,
                    elapsedTimeInMinutes: block.elapsedTimeInMinutes,
                    completedAt: block.completedAt,
                    createdAt: block.createdAt,
                },
                update: {
                    status: block.status,
                    startedAt: block.startedAt,
                    elapsedTimeInMinutes: block.elapsedTimeInMinutes,
                    completedAt: block.completedAt,
                },
            });
        }
    }

    private mapToDomain(raw: any): StudySchedule {
        const blocks = raw.blocks.map((b: any) =>
            StudyBlock.create(
                {
                    scheduleId: new UniqueEntityID(raw.id),
                    subject: b.subject,
                    topic: b.topic,
                    plannedDurationInMinutes: b.plannedDurationInMinutes,
                    status: b.status as any,
                    startedAt: b.startedAt || undefined,
                    elapsedTimeInMinutes: b.elapsedTimeInMinutes,
                    completedAt: b.completedAt || undefined,
                    createdAt: b.createdAt,
                },
                new UniqueEntityID(b.id),
            ),
        );

        return StudySchedule.create(
            {
                userId: new UniqueEntityID(raw.userId),
                targetExam: raw.targetExam,
                startDate: raw.startDate,
                blocks,
                createdAt: raw.createdAt,
            },
            new UniqueEntityID(raw.id),
        );
    }
}
