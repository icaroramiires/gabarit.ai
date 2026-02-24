import { LoginUserUseCase } from './login-user.usecase';
import { UserRepository } from '../../domain/repositories/user-repository';
import { User } from '../../domain/entities/user';
import { Hasher } from '../cryptography/hasher';
import { Encrypter } from '../cryptography/encrypter';

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

class MockEncrypter implements Encrypter {
    async encrypt(payload: Record<string, unknown>): Promise<string> {
        return JSON.stringify(payload) + '-token';
    }
}

let userRepository: MockUserRepository;
let hasher: MockHasher;
let encrypter: MockEncrypter;
let sut: LoginUserUseCase; // System Under Test

describe('Login User UseCase', () => {
    beforeEach(() => {
        userRepository = new MockUserRepository();
        hasher = new MockHasher();
        encrypter = new MockEncrypter();
        sut = new LoginUserUseCase(userRepository, hasher, encrypter);
    });

    it('should be able to log in an existing user', async () => {
        // Arrange: Create a user directly
        const user = User.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            passwordHash: 'mypassword123-hashed',
        });
        userRepository.items.push(user);

        // Act
        const result = await sut.execute({
            email: 'johndoe@example.com',
            password: 'mypassword123',
        });

        // Assert
        expect(result.isRight()).toBe(true);
        if (result.isRight()) {
            expect(result.value.accessToken).toBeTruthy();
            expect(typeof result.value.accessToken).toBe('string');
            expect(result.value.accessToken).toContain('-token');
        }
    });

    it('should not be able to log in with an incorrect password', async () => {
        const user = User.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            passwordHash: 'correctpassword-hashed',
        });
        userRepository.items.push(user);

        const result = await sut.execute({
            email: 'johndoe@example.com',
            password: 'wrongpassword',
        });

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(Error);
        expect((result.value as Error).message).toEqual('Credenciais inválidas.');
    });

    it('should not be able to log in with an inexistent email', async () => {
        const result = await sut.execute({
            email: 'notfound@example.com',
            password: 'wrongpassword',
        });

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(Error);
        expect((result.value as Error).message).toEqual('Credenciais inválidas.');
    });
});
