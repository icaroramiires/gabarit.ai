import { UserRepository } from '../../domain/repositories/user-repository';
import { Hasher } from '../cryptography/hasher';
import { Encrypter } from '../cryptography/encrypter';
import { LoginUserRequestDto, LoginUserResponseDto } from '../dtos/login-user.dto';
import { Either, left, right } from '../../../../core/logic/Either';

export class LoginUserUseCase {
    constructor(
        private userRepository: UserRepository,
        private hasher: Hasher,
        private encrypter: Encrypter,
    ) { }

    async execute({
        email,
        password,
    }: LoginUserRequestDto): Promise<Either<Error, LoginUserResponseDto>> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            return left(new Error('Credenciais inválidas.'));
        }

        const passwordMatches = await this.hasher.compare(password, user.passwordHash);

        if (!passwordMatches) {
            return left(new Error('Credenciais inválidas.'));
        }

        const accessToken = await this.encrypter.encrypt({
            sub: user.id.toString(),
            email: user.email,
        });

        return right({
            accessToken,
        });
    }
}
