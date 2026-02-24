import { Entity } from '../../../../core/domain/Entity';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';

interface StudentProfileProps {
    userId: string;
    xp: number;
    level: number;
    currentStreak: number;
    longestStreak: number;
    lastActivityAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export class StudentProfile extends Entity<StudentProfileProps> {

    get userId(): string { return this.props.userId; }
    get xp(): number { return this.props.xp; }
    get level(): number { return this.props.level; }
    get currentStreak(): number { return this.props.currentStreak; }
    get longestStreak(): number { return this.props.longestStreak; }
    get lastActivityAt(): Date | undefined { return this.props.lastActivityAt; }

    private constructor(props: StudentProfileProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(
        props: Omit<StudentProfileProps, 'xp' | 'level' | 'currentStreak' | 'longestStreak'> & Partial<Pick<StudentProfileProps, 'xp' | 'level' | 'currentStreak' | 'longestStreak'>>,
        id?: UniqueEntityID,
    ): StudentProfile {
        return new StudentProfile({
            userId: props.userId,
            xp: props.xp ?? 0,
            level: props.level ?? 1,
            currentStreak: props.currentStreak ?? 0,
            longestStreak: props.longestStreak ?? 0,
            lastActivityAt: props.lastActivityAt,
            createdAt: props.createdAt ?? new Date(),
            updatedAt: props.updatedAt ?? new Date(),
        }, id);
    }

    public addXp(amount: number) {
        if (amount < 0) throw new Error("XP cannot be negative");
        this.props.xp += amount;
        this.calculateLevel();
    }

    private calculateLevel() {
        // Base logic MVP: 1 level per 100 XP
        this.props.level = Math.floor(this.props.xp / 100) + 1;
    }

    public recordActivity(date: Date = new Date()) {
        const targetDate = new Date(date);
        targetDate.setUTCHours(0, 0, 0, 0); // Normalize to Midnight UTC

        if (!this.props.lastActivityAt) {
            this.props.currentStreak = 1;
            this.props.longestStreak = 1;
            this.props.lastActivityAt = new Date(date);
            return;
        }

        const lastActiveDate = new Date(this.props.lastActivityAt);
        lastActiveDate.setUTCHours(0, 0, 0, 0);

        const diffTime = targetDate.getTime() - lastActiveDate.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            // Same day activity, do nothing to streaks, just update date pointer to latest time
            this.props.lastActivityAt = new Date(date);
            return;
        }

        if (diffDays === 1) {
            // Consecutive day
            this.props.currentStreak += 1;
            if (this.props.currentStreak > this.props.longestStreak) {
                this.props.longestStreak = this.props.currentStreak;
            }
        } else if (diffDays > 1) {
            // Streak broken
            this.props.currentStreak = 1;
        }

        this.props.lastActivityAt = new Date(date);
    }
}
