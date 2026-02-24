import { RegisterUserUseCase } from './register-user.usecase';
import { UserRepository } from '../../domain/repositories/user-repository';
import { User } from '../../domain/entities/user';
import { Hasher } from '../cryptography/hasher';

// Mocks
class MockUserRepository implements UserRepository {
    public items: User[] = [];

    async findByEmail(email: string): Promise<User | null> {
        const user = this.items.find((item) => item.email === email);
        return user || null;
    }

    async create(user: User): Promise<void> {
        this.items.push(user);
    }

    async save(user: User): Promise<void> {
        const itemIndex = this.items.findIndex((item) => item.id.equals(user.id));
        this.items[itemIndex] = user;
    }
}

class MockHasher implements Hasher {
    async hash(plain: string): Promise<string> {
        return plain.concat('-hashed');
    }

    async compare(plain: string, hash: string): Promise<boolean> {
        return plain.concat('-hashed') === hash;
    }
}

let userRepository: MockUserRepository;
let hasher: MockHasher;
let sut: RegisterUserUseCase; // System Under Test

describe('Register User UseCase', () => {
    beforeEach(() => {
        userRepository = new MockUserRepository();
        hasher = new MockHasher();
        sut = new RegisterUserUseCase(userRepository, hasher);
    });

    it('should be able to register a new user', async () => {
        const result = await sut.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'mypassword123',
        });

        expect(result.isRight()).toBe(true);
        expect(userRepository.items[0]).toEqual(result.value);
        expect(userRepository.items[0].passwordHash).toEqual('mypassword123-hashed');
    });

    it('should not be able to register an user with an already used email', async () => {
        const user = User.create({
            name: 'Jane Doe',
            email: 'janedoe@example.com',
            passwordHash: 'oldpassword-hashed',
        });
        userRepository.items.push(user);

        const result = await sut.execute({
            name: 'John Doe',
            email: 'janedoe@example.com', // Same email
            password: 'mypassword123',
        });

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(Error);
        expect((result.value as Error).message).toEqual('User with this email already exists.');
    });
});
