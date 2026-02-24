import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { StudentProfileRepository } from '../../domain/repositories/student-profile-repository';
import { StudentProfile } from '../../domain/entities/student-profile';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StudentProfilePrismaRepository implements StudentProfileRepository {
    constructor(private prisma: PrismaService) { }

    async findByUserId(userId: string): Promise<StudentProfile | null> {
        const raw = await this.prisma.studentProfile.findUnique({
            where: { userId }
        });

        if (!raw) return null;

        return StudentProfile.create({
            userId: raw.userId,
            xp: raw.xp,
            level: raw.level,
            currentStreak: raw.currentStreak,
            longestStreak: raw.longestStreak,
            lastActivityAt: raw.lastActivityAt || undefined,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        }, new UniqueEntityID(raw.id));
    }

    async save(profile: StudentProfile): Promise<void> {
        await this.prisma.studentProfile.upsert({
            where: { id: profile.id.toString() },
            update: {
                xp: profile.xp,
                level: profile.level,
                currentStreak: profile.currentStreak,
                longestStreak: profile.longestStreak,
                lastActivityAt: profile.lastActivityAt || null,
            },
            create: {
                id: profile.id.toString(),
                userId: profile.userId,
                xp: profile.xp,
                level: profile.level,
                currentStreak: profile.currentStreak,
                longestStreak: profile.longestStreak,
                lastActivityAt: profile.lastActivityAt || null,
            }
        });
    }

    async getTopProfiles(limit: number): Promise<StudentProfile[]> {
        const rawProfiles = await this.prisma.studentProfile.findMany({
            orderBy: { xp: 'desc' },
            take: limit
        });

        return rawProfiles.map(raw => StudentProfile.create({
            userId: raw.userId,
            xp: raw.xp,
            level: raw.level,
            currentStreak: raw.currentStreak,
            longestStreak: raw.longestStreak,
            lastActivityAt: raw.lastActivityAt || undefined,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        }, new UniqueEntityID(raw.id)));
    }
}
