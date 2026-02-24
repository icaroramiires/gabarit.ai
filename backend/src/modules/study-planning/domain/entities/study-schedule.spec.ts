import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { StudySchedule } from './study-schedule';
import { StudyBlock } from './study-block';

describe('StudySchedule Entity', () => {
    it('should be able to create a new study schedule with blocks', () => {
        const block1 = StudyBlock.create({
            scheduleId: new UniqueEntityID('new-schedule'),
            subject: 'Direito',
            topic: 'Contratos',
            plannedDurationInMinutes: 60,
        });

        const schedule = StudySchedule.create({
            userId: new UniqueEntityID('user-1'),
            targetExam: 'Polícia Federal',
            startDate: new Date('2024-05-01'),
            blocks: [block1],
        });

        expect(schedule).toBeTruthy();
        expect(schedule.userId.toString()).toEqual('user-1');
        expect(schedule.targetExam).toEqual('Polícia Federal');
        expect(schedule.blocks).toHaveLength(1);
        expect(schedule.blocks[0]).toBeInstanceOf(StudyBlock);
    });

    it('should calculate the total planned minutes of the schedule', () => {
        const scheduleId = new UniqueEntityID('schedule-2');

        const block1 = StudyBlock.create({
            scheduleId,
            subject: 'Matemática',
            topic: 'Lógica',
            plannedDurationInMinutes: 45,
        });

        const block2 = StudyBlock.create({
            scheduleId,
            subject: 'Português',
            topic: 'Crase',
            plannedDurationInMinutes: 30,
        });

        const schedule = StudySchedule.create({
            userId: new UniqueEntityID('user-1'),
            targetExam: 'Concurso BB',
            startDate: new Date(),
            blocks: [block1, block2],
        });

        expect(schedule.getTotalDurationInMinutes()).toEqual(75);
    });
});
