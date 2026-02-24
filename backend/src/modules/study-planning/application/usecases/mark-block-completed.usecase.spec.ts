import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { StudyScheduleRepository } from '../../domain/repositories/study-schedule-repository';
import { StudySchedule } from '../../domain/entities/study-schedule';
import { StudyBlock } from '../../domain/entities/study-block';
import { MarkBlockCompletedUseCase } from './mark-block-completed.usecase';

class MockStudyScheduleRepository implements StudyScheduleRepository {
    public items: StudySchedule[] = [];

    async findById(id: UniqueEntityID): Promise<StudySchedule | null> {
        return this.items.find((item) => item.id.equals(id)) || null;
    }

    async findByUserId(userId: UniqueEntityID): Promise<StudySchedule[]> {
        return this.items.filter((item) => item.userId.equals(userId));
    }

    async create(schedule: StudySchedule): Promise<void> {
        this.items.push(schedule);
    }

    async save(schedule: StudySchedule): Promise<void> {
        const itemIndex = this.items.findIndex((item) => item.id.equals(schedule.id));
        this.items[itemIndex] = schedule;
    }
}

let repository: MockStudyScheduleRepository;
let sut: MarkBlockCompletedUseCase;

describe('MarkBlockCompleted UseCase', () => {
    beforeEach(() => {
        repository = new MockStudyScheduleRepository();
        sut = new MarkBlockCompletedUseCase(repository);
    });

    it('should mark a specific block as completed in a schedule', async () => {
        // Arrange
        const scheduleId = new UniqueEntityID('schedule-1');
        const blockId = new UniqueEntityID('block-1');

        const block = StudyBlock.create(
            {
                scheduleId,
                subject: 'Informática',
                topic: 'Hardware',
                plannedDurationInMinutes: 30,
            },
            blockId,
        );

        const schedule = StudySchedule.create(
            {
                userId: new UniqueEntityID('user-1'),
                targetExam: 'Edital XYZ',
                startDate: new Date(),
                blocks: [block],
            },
            scheduleId,
        );

        repository.items.push(schedule);

        // Act
        const result = await sut.execute({
            scheduleId: 'schedule-1',
            blockId: 'block-1',
        });

        // Assert
        expect(result.isRight()).toBe(true);
        if (result.isRight()) {
            const updatedSchedule = result.value;
            const updatedBlock = updatedSchedule.blocks.find((b) => b.id.equals(blockId));
            expect(updatedBlock?.isCompleted).toBe(true);
            expect(updatedBlock?.completedAt).toBeInstanceOf(Date);

            // Asserts save was called (in our mock, item is updated by ref, but we check presence)
            expect(repository.items[0].blocks[0].isCompleted).toBe(true);
        }
    });

    it('should return error if block is not found', async () => {
        const scheduleId = new UniqueEntityID('schedule-1');
        const schedule = StudySchedule.create(
            {
                userId: new UniqueEntityID('user-1'),
                targetExam: 'Edital XYZ',
                startDate: new Date(),
                blocks: [],
            },
            scheduleId,
        );

        repository.items.push(schedule);

        const result = await sut.execute({
            scheduleId: 'schedule-1',
            blockId: 'invalid-block-id',
        });

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(Error);
    });
});
