export class GenerateBaseScheduleRequestDto {
    userId: string;
    targetExam: string;
    dailyHours: number;
    startDate?: Date;
}
