import { User } from './user';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';

describe('User Entity', () => {
    it('should be able to create a new user', () => {
        const user = User.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            passwordHash: 'hashedpassword123',
        });

        expect(user).toBeTruthy();
        expect(user.id).toBeInstanceOf(UniqueEntityID);
        expect(user.name).toEqual('John Doe');
        expect(user.email).toEqual('johndoe@example.com');
        expect(user.passwordHash).toEqual('hashedpassword123');
        expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('should be able to create a user with provided ID and creation date', () => {
        const id = new UniqueEntityID('custom-id');
        const createdAt = new Date('2024-01-01');

        const user = User.create(
            {
                name: 'Jane Doe',
                email: 'janedoe@example.com',
                passwordHash: 'hashedpassword123',
                createdAt,
            },
            id,
        );

        expect(user.id.toString()).toEqual('custom-id');
        expect(user.createdAt).toEqual(createdAt);
    });
});
