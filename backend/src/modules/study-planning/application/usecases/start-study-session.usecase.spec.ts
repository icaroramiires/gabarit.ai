import { StartStudySessionUseCase } from './start-study-session.usecase';
import { StudyScheduleRepository } from '../../domain/repositories/study-schedule-repository';
import { StudySchedule } from '../../domain/entities/study-schedule';
import { StudyBlock } from '../../domain/entities/study-block';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';

describe('Start Study Session UseCase', () => {
    let useCase: StartStudySessionUseCase;
    let mockRepository: jest.Mocked<StudyScheduleRepository>;

    beforeEach(() => {
        mockRepository = {
            create: jest.fn(),
            findByUserId: jest.fn(),
            findById: jest.fn(),
            save: jest.fn(),
        };
        useCase = new StartStudySessionUseCase(mockRepository);
    });

    it('should start a study block and update its status', async () => {
        const scheduleId = new UniqueEntityID('sched-1');
        const blockId = new UniqueEntityID('block-1');

        const block = StudyBlock.create({
            scheduleId,
            subject: 'Constitucional',
            topic: 'Direitos',
            plannedDurationInMinutes: 30,
        }, blockId);

        const schedule = StudySchedule.create({
            userId: new UniqueEntityID('user-1'),
            targetExam: 'TJ',
            startDate: new Date(),
            blocks: [block],
        }, scheduleId);

        mockRepository.findById.mockResolvedValue(schedule);

        await useCase.execute(scheduleId.toString(), blockId.toString());

        expect(mockRepository.save).toHaveBeenCalledTimes(1);
        expect(block.status).toBe('in-progress');
        expect(block.startedAt).toBeInstanceOf(Date);
    });

    it('should throw error if another block is already in progress', async () => {
        const scheduleId = new UniqueEntityID('sched-1');

        const inProgressBlock = StudyBlock.create({
            scheduleId,
            subject: 'Penal',
            topic: 'Crimes',
            plannedDurationInMinutes: 60,
            status: 'in-progress'
        }, new UniqueEntityID('block-1'));

        const newBlock = StudyBlock.create({
            scheduleId,
            subject: 'Civil',
            topic: 'Contratos',
            plannedDurationInMinutes: 30,
        }, new UniqueEntityID('block-2'));

        const schedule = StudySchedule.create({
            userId: new UniqueEntityID('user-1'),
            targetExam: 'TJ',
            startDate: new Date(),
            blocks: [inProgressBlock, newBlock],
        }, scheduleId);

        mockRepository.findById.mockResolvedValue(schedule);

        await expect(useCase.execute(scheduleId.toString(), newBlock.id.toString())).rejects.toThrow(
            'There is already a study session in progress on this schedule. Pause or finish it first.'
        );
    });
});
