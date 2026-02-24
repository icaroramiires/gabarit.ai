import { Entity } from '../../../../core/domain/Entity';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';

export type BlockStatus = 'pending' | 'in-progress' | 'completed';

export interface StudyBlockProps {
    scheduleId: UniqueEntityID;
    subject: string;
    topic: string;
    plannedDurationInMinutes: number;
    status?: BlockStatus;
    startedAt?: Date | null;
    elapsedTimeInMinutes?: number;
    completedAt?: Date | null;
    createdAt?: Date;
}

export class StudyBlock extends Entity<StudyBlockProps> {
    get scheduleId() {
        return this.props.scheduleId;
    }

    get subject() {
        return this.props.subject;
    }

    get topic() {
        return this.props.topic;
    }

    get plannedDurationInMinutes() {
        return this.props.plannedDurationInMinutes;
    }

    get status() {
        return this.props.status || 'pending';
    }

    get startedAt() {
        return this.props.startedAt;
    }

    get elapsedTimeInMinutes() {
        return this.props.elapsedTimeInMinutes || 0;
    }

    get isCompleted() {
        return this.props.status === 'completed';
    }

    get completedAt() {
        return this.props.completedAt;
    }

    public start() {
        if (this.status === 'completed') {
            throw new Error("Cannot start a completed block");
        }
        this.props.status = 'in-progress';
        if (!this.props.startedAt) {
            this.props.startedAt = new Date();
        }
    }

    public pause(elapsedDeltaMinutes: number) {
        if (this.status !== 'in-progress') {
            throw new Error("Cannot pause a block that is not in progress");
        }
        this.props.status = 'pending';
        this.props.elapsedTimeInMinutes = this.elapsedTimeInMinutes + elapsedDeltaMinutes;
    }

    public markAsCompleted(elapsedDeltaMinutes: number = 0) {
        this.props.status = 'completed';
        this.props.completedAt = new Date();
        this.props.elapsedTimeInMinutes = this.elapsedTimeInMinutes + elapsedDeltaMinutes;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    private constructor(props: StudyBlockProps, id?: UniqueEntityID) {
        super(
            {
                ...props,
                status: props.status ?? 'pending',
                elapsedTimeInMinutes: props.elapsedTimeInMinutes ?? 0,
                createdAt: props.createdAt ?? new Date(),
            },
            id,
        );
    }

    public static create(props: StudyBlockProps, id?: UniqueEntityID): StudyBlock {
        const studyBlock = new StudyBlock(props, id);
        return studyBlock;
    }
}
