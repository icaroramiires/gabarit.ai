import { UpdateStreakUseCase } from './update-streak.usecase';
import { StudentProfileRepository } from '../../domain/repositories/student-profile-repository';
import { StudentProfile } from '../../domain/entities/student-profile';
import { describe, it, expect, vi, Mocked, beforeEach } from 'vitest';

describe('UpdateStreakUseCase', () => {
    let mockRepo: Mocked<StudentProfileRepository>;
    let usecase: UpdateStreakUseCase;

    beforeEach(() => {
        mockRepo = {
            findByUserId: vi.fn(),
            save: vi.fn(),
            getTopProfiles: vi.fn(),
        } as unknown as Mocked<StudentProfileRepository>;

        usecase = new UpdateStreakUseCase(mockRepo);
    });

    it('should create profile and start streak if it does not exist', async () => {
        mockRepo.findByUserId.mockResolvedValueOnce(null);

        const result = await usecase.execute('user-1');

        expect(result.userId).toBe('user-1');
        expect(result.currentStreak).toBe(1);
        expect(result.longestStreak).toBe(1);
        expect(result.lastActivityAt).toBeDefined();
        expect(mockRepo.save).toHaveBeenCalledTimes(1);
    });

    it('should update streak of existing profile', async () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const existingProfile = StudentProfile.create({
            userId: 'user-1',
            currentStreak: 5,
            longestStreak: 5,
            lastActivityAt: yesterday
        });

        mockRepo.findByUserId.mockResolvedValueOnce(existingProfile);

        const result = await usecase.execute('user-1');

        expect(result.currentStreak).toBe(6);
        expect(result.longestStreak).toBe(6);
        expect(mockRepo.save).toHaveBeenCalledTimes(1);
    });
});
