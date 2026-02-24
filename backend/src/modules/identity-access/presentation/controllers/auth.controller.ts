import { Body, Controller, HttpCode, HttpStatus, Post, UnauthorizedException, ConflictException } from '@nestjs/common';
import { RegisterUserUseCase } from '../../application/usecases/register-user.usecase';
import { LoginUserUseCase } from '../../application/usecases/login-user.usecase';
import { RegisterUserRequestDto } from '../../application/dtos/register-user.dto';
import { LoginUserRequestDto } from '../../application/dtos/login-user.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private registerUser: RegisterUserUseCase,
        private loginUser: LoginUserUseCase,
    ) { }

    @Post('register')
    async register(@Body() body: RegisterUserRequestDto) {
        const result = await this.registerUser.execute(body);

        if (result.isLeft()) {
            throw new ConflictException(result.value.message);
        }

        const user = result.value;

        // Na prática, pode-se logar automaticamente o usuário e devolver o Access Token 
        // ou apenas devolver Http 201 Created. 
        // No Clean Arch, o ideal seria que o caso de uso ou outro orquestrador fizesse. Vamos logar pra simplificar on boarding:
        const loginAttempt = await this.loginUser.execute({
            email: user.email,
            password: body.password // raw password injected back via DTO
        });

        if (loginAttempt.isLeft()) {
            throw new UnauthorizedException();
        }

        return {
            message: 'User created successfully',
            data: {
                user: { id: user.id.toString(), name: user.name, email: user.email },
                accessToken: loginAttempt.value.accessToken
            }
        };
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() body: LoginUserRequestDto) {
        const result = await this.loginUser.execute(body);

        if (result.isLeft()) {
            throw new UnauthorizedException(result.value.message);
        }

        return {
            message: 'Logged in successfully',
            data: {
                accessToken: result.value.accessToken
            }
        };
    }
}
