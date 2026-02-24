import { AddXpUseCase } from './add-xp.usecase';
import { StudentProfileRepository } from '../../domain/repositories/student-profile-repository';
import { StudentProfile } from '../../domain/entities/student-profile';
import { describe, it, expect, vi, Mocked, beforeEach } from 'vitest';

describe('AddXpUseCase', () => {
    let mockRepo: Mocked<StudentProfileRepository>;
    let usecase: AddXpUseCase;

    beforeEach(() => {
        mockRepo = {
            findByUserId: vi.fn(),
            save: vi.fn(),
            getTopProfiles: vi.fn(),
        } as unknown as Mocked<StudentProfileRepository>;

        usecase = new AddXpUseCase(mockRepo);
    });

    it('should create profile and add XP if profile does not exist', async () => {
        mockRepo.findByUserId.mockResolvedValueOnce(null);

        const result = await usecase.execute('user-1', 150);

        expect(result.userId).toBe('user-1');
        expect(result.xp).toBe(150);
        expect(result.level).toBe(2);
        expect(mockRepo.save).toHaveBeenCalledTimes(1);
    });

    it('should load existing profile and append XP', async () => {
        const existingProfile = StudentProfile.create({ userId: 'user-1', xp: 200, level: 3 });
        mockRepo.findByUserId.mockResolvedValueOnce(existingProfile);

        const result = await usecase.execute('user-1', 50);

        expect(result.xp).toBe(250);
        expect(result.level).toBe(3);
        expect(mockRepo.save).toHaveBeenCalledTimes(1);
    });
});
