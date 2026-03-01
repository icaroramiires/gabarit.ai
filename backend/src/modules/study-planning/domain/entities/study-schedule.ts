import { Entity } from '../../../../core/domain/Entity';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';
import { StudyBlock } from './study-block';

export interface StudyScheduleProps {
    userId: UniqueEntityID;
    targetExam: string;
    startDate: Date;
    blocks: StudyBlock[];
    createdAt?: Date;
}

export class StudySchedule extends Entity<StudyScheduleProps> {
    get userId() {
        return this.props.userId;
    }

    get targetExam() {
        return this.props.targetExam;
    }

    get startDate() {
        return this.props.startDate;
    }

    get blocks() {
        return this.props.blocks;
    }

    get createdAt() {
        return this.props.createdAt || new Date();
    }

    public getTotalDurationInMinutes(): number {
        return this.props.blocks.reduce((total, block) => total + block.plannedDurationInMinutes, 0);
    }

    public addBlock(block: StudyBlock): void {
        this.props.blocks.push(block);
    }

    public clearPendingBlocks(): void {
        this.props.blocks = this.props.blocks.filter(b => b.status === 'completed');
    }

    private constructor(props: StudyScheduleProps, id?: UniqueEntityID) {
        super(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),
            },
            id,
        );
    }

    public static create(props: StudyScheduleProps, id?: UniqueEntityID): StudySchedule {
        const studySchedule = new StudySchedule(props, id);
        return studySchedule;
    }
}
