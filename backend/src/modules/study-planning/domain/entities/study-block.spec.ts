import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { StudyBlock } from './study-block';

describe('StudyBlock Entity', () => {
    it('should be able to create an open study block', () => {
        const block = StudyBlock.create({
            scheduleId: new UniqueEntityID('schedule-1'),
            subject: 'Direito Constitucional',
            topic: 'Princípios Fundamentais',
            plannedDurationInMinutes: 60,
            status: 'pending',
        });

        expect(block).toBeTruthy();
        expect(block.subject).toEqual('Direito Constitucional');
        expect(block.status).toEqual('pending');
        expect(block.isCompleted).toBe(false);
        expect(block.completedAt).toBeUndefined();
    });

    it('should be able to complete a study block', () => {
        const block = StudyBlock.create({
            scheduleId: new UniqueEntityID('schedule-1'),
            subject: 'Informática',
            topic: 'Redes',
            plannedDurationInMinutes: 45,
        }); // isCompleted defaults to false

        block.start();
        block.markAsCompleted(45); // 45 minutes spent

        expect(block.status).toEqual('completed');
        expect(block.isCompleted).toBe(true);
        expect(block.completedAt).toBeInstanceOf(Date);
        expect(block.elapsedTimeInMinutes).toBe(45);
    });

    it('should be able to pause a block in progress', () => {
        const block = StudyBlock.create({
            scheduleId: new UniqueEntityID('schedule-1'),
            subject: 'Língua Portuguesa',
            topic: 'Crase',
            plannedDurationInMinutes: 30,
        });

        block.start();
        expect(block.status).toEqual('in-progress');
        expect(block.startedAt).toBeInstanceOf(Date);

        block.pause(15);
        expect(block.status).toEqual('pending');
        expect(block.elapsedTimeInMinutes).toBe(15);
    });
});
