import { User } from '../../domain/entities/user';
import { UserRepository } from '../../domain/repositories/user-repository';
import { Hasher } from '../cryptography/hasher';
import { RegisterUserRequestDto } from '../dtos/register-user.dto';
import { Either, left, right } from '../../../../core/logic/Either';

export class RegisterUserUseCase {
    constructor(
        private userRepository: UserRepository,
        private hasher: Hasher,
    ) { }

    async execute({
        name,
        email,
        password,
    }: RegisterUserRequestDto): Promise<Either<Error, User>> {
        const userWithSameEmail = await this.userRepository.findByEmail(email);

        if (userWithSameEmail) {
            return left(new Error('User with this email already exists.'));
        }

        const hashedPassword = await this.hasher.hash(password);

        const user = User.create({
            name,
            email,
            passwordHash: hashedPassword,
        });

        await this.userRepository.create(user);

        return right(user);
    }
}
