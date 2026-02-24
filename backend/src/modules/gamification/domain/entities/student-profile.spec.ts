import { StudentProfile } from './student-profile';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { describe, it, expect } from 'vitest';

describe('StudentProfile Entity', () => {
    it('should create a new student profile with default values', () => {
        const profile = StudentProfile.create({ userId: 'user-1' });

        expect(profile.userId).toBe('user-1');
        expect(profile.xp).toBe(0);
        expect(profile.level).toBe(1);
        expect(profile.currentStreak).toBe(0);
        expect(profile.longestStreak).toBe(0);
        expect(profile.lastActivityAt).toBeUndefined();
    });

    describe('addXp', () => {
        it('should add XP and calculate level correctly (100 XP per level)', () => {
            const profile = StudentProfile.create({ userId: 'user-1' });

            profile.addXp(50);
            expect(profile.xp).toBe(50);
            expect(profile.level).toBe(1);

            profile.addXp(60); // Total 110 XP
            expect(profile.xp).toBe(110);
            expect(profile.level).toBe(2);

            profile.addXp(200); // Total 310 XP
            expect(profile.xp).toBe(310);
            expect(profile.level).toBe(4);
        });
    });

    describe('recordActivity (Streaks)', () => {
        it('should start a streak of 1 on first activity', () => {
            const profile = StudentProfile.create({ userId: 'user-1' });
            profile.recordActivity(new Date());

            expect(profile.currentStreak).toBe(1);
            expect(profile.longestStreak).toBe(1);
            expect(profile.lastActivityAt).toBeDefined();
        });

        it('should not increase streak if activity is on the same day', () => {
            const profile = StudentProfile.create({ userId: 'user-1' });
            const today = new Date('2026-02-24T10:00:00Z');
            const slightlyLaterToday = new Date('2026-02-24T14:00:00Z');

            profile.recordActivity(today);
            expect(profile.currentStreak).toBe(1);

            profile.recordActivity(slightlyLaterToday);
            expect(profile.currentStreak).toBe(1); // Still 1
        });

        it('should increment streak if activity is on the next day', () => {
            const profile = StudentProfile.create({ userId: 'user-1' });
            const today = new Date('2026-02-24T10:00:00Z');
            const tomorrow = new Date('2026-02-25T10:00:00Z');

            profile.recordActivity(today);
            profile.recordActivity(tomorrow);

            expect(profile.currentStreak).toBe(2);
            expect(profile.longestStreak).toBe(2);
        });

        it('should break streak if activity is 2 or more days later', () => {
            const profile = StudentProfile.create({ userId: 'user-1' });
            const today = new Date('2026-02-24T10:00:00Z');
            const threeDaysLater = new Date('2026-02-27T10:00:00Z');

            profile.recordActivity(today);
            profile.recordActivity(threeDaysLater);

            expect(profile.currentStreak).toBe(1); // Broke streak
            expect(profile.longestStreak).toBe(1); // Kept previous longest (which was 1)
        });

        it('should maintain longest streak when current streak breaks', () => {
            const profile = StudentProfile.create({ userId: 'user-1' });

            // First run of 3 days
            profile.recordActivity(new Date('2026-02-20T10:00:00Z'));
            profile.recordActivity(new Date('2026-02-21T10:00:00Z'));
            profile.recordActivity(new Date('2026-02-22T10:00:00Z'));

            expect(profile.currentStreak).toBe(3);
            expect(profile.longestStreak).toBe(3);

            // Break it by studying on 2026-02-25 (3 days later)
            profile.recordActivity(new Date('2026-02-25T10:00:00Z'));

            expect(profile.currentStreak).toBe(1);
            expect(profile.longestStreak).toBe(3); // Preserved
        });
    });
});
