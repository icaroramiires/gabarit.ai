import { Entity } from '../../../../core/domain/Entity';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';

interface UserProps {
    name: string;
    email: string;
    passwordHash: string;
    createdAt?: Date;
}

export class User extends Entity<UserProps> {
    get name() {
        return this.props.name;
    }

    get email() {
        return this.props.email;
    }

    get passwordHash() {
        return this.props.passwordHash;
    }

    get createdAt() {
        return this.props.createdAt || new Date();
    }

    private constructor(props: UserProps, id?: UniqueEntityID) {
        super(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),
            },
            id,
        );
    }

    public static create(props: UserProps, id?: UniqueEntityID): User {
        const user = new User(props, id);
        return user;
    }
}
