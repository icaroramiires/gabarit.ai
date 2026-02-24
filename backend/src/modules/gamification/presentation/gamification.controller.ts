import { Controller, Get, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { GetLeaderboardUseCase } from '../application/usecases/get-leaderboard.usecase';
import { StudentProfileRepository } from '../domain/repositories/student-profile-repository';

@Controller('gamification')
export class GamificationController {
    constructor(
        private readonly getLeaderboard: GetLeaderboardUseCase,
        private readonly studentRepo: StudentProfileRepository
    ) { }

    @Get('leaderboard')
    async fetchLeaderboard(@Query('limit') limit?: number) {
        try {
            const parsedLimit = limit ? parseInt(limit.toString()) : 10;
            const ranking = await this.getLeaderboard.execute(parsedLimit);
            return {
                message: 'Leaderboard fetched successfully',
                data: ranking,
            };
        } catch (error: any) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Get('profile/:userId')
    async getProfile(@Param('userId') userId: string) {
        try {
            const profile = await this.studentRepo.findByUserId(userId);
            if (!profile) {
                return {
                    message: 'Profile not found. Defaulting.',
                    data: { xp: 0, level: 1, currentStreak: 0, longestStreak: 0 }
                };
            }
            return {
                message: 'Profile fetched successfully',
                data: {
                    xp: profile.xp,
                    level: profile.level,
                    currentStreak: profile.currentStreak,
                    longestStreak: profile.longestStreak
                }
            };
        } catch (error: any) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}
