import { Either, left, right } from '../../../../core/logic/Either';
import { StudySchedule } from '../../domain/entities/study-schedule';
import { StudyBlock } from '../../domain/entities/study-block';
import { StudyScheduleRepository } from '../../domain/repositories/study-schedule-repository';
import { GenerateBaseScheduleRequestDto } from '../dtos/generate-base-schedule.dto';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';

export class GenerateBaseScheduleUseCase {
    constructor(private scheduleRepository: StudyScheduleRepository) { }

    async execute(
        request: GenerateBaseScheduleRequestDto,
    ): Promise<Either<Error, StudySchedule>> {
        if (request.dailyHours < 1) {
            return left(new Error('A carga horária diária deve ser de no mínimo 1 hora.'));
        }

        const userId = new UniqueEntityID(request.userId);
        const scheduleId = new UniqueEntityID(); // Create an ID upfront to pass to blocks

        // Mock logic for MVP: Create a basic block based on the first day
        const baseDuration = request.dailyHours * 60; // Total daily minutes

        // Breaking into 2 blocks for the example of the MVP Schedule (Pomodoro style)
        const block1 = StudyBlock.create({
            scheduleId,
            subject: 'Direito Constitucional', // In a real scenario, this comes from the AI/Exam parsing
            topic: 'Direitos Fundamentais',
            plannedDurationInMinutes: Math.floor(baseDuration / 2),
        });

        const block2 = StudyBlock.create({
            scheduleId,
            subject: 'Língua Portuguesa',
            topic: 'Compreensão de Textos',
            plannedDurationInMinutes: Math.ceil(baseDuration / 2),
        });

        const schedule = StudySchedule.create(
            {
                userId,
                targetExam: request.targetExam,
                startDate: request.startDate || new Date(),
                blocks: [block1, block2],
            },
            scheduleId,
        );

        await this.scheduleRepository.create(schedule);

        return right(schedule);
    }
}
