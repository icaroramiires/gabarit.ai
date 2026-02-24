import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { StudySchedule } from '../../domain/entities/study-schedule';
import { StudyBlock } from '../../domain/entities/study-block';
import { StudyScheduleRepository } from '../../domain/repositories/study-schedule-repository';
import { GenerateBaseScheduleUseCase } from './generate-base-schedule.usecase';

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
let sut: GenerateBaseScheduleUseCase;

describe('GenerateBaseSchedule UseCase', () => {
    beforeEach(() => {
        repository = new MockStudyScheduleRepository();
        sut = new GenerateBaseScheduleUseCase(repository);
    });

    it('should generate a base study schedule with blocks for a user', async () => {
        const request = {
            userId: 'user-1',
            targetExam: 'Receita Federal',
            dailyHours: 4,
            startDate: new Date(),
        };

        const result = await sut.execute(request);

        expect(result.isRight()).toBe(true);

        if (result.isRight()) {
            const schedule = result.value;
            expect(schedule).toBeInstanceOf(StudySchedule);
            expect(schedule.userId.toString()).toEqual('user-1');
            expect(schedule.blocks.length).toBeGreaterThan(0);

            // Since it's a basic generation, it should have some predefined blocks based on hours
            expect(schedule.blocks[0]).toBeInstanceOf(StudyBlock);
            expect(schedule.getTotalDurationInMinutes()).toBeGreaterThanOrEqual(request.dailyHours * 60); // 4 hours in minutes

            // Should save to repository
            expect(repository.items).toHaveLength(1);
        }
    });

    it('should return error if daily hours is less than 1', async () => {
        const request = {
            userId: 'user-1',
            targetExam: 'Polícia Federal',
            dailyHours: 0,
            startDate: new Date(),
        };

        const result = await sut.execute(request);

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(Error);
    });
});
