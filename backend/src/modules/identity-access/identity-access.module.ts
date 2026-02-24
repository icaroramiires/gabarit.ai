import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AuthController } from './presentation/controllers/auth.controller';
import { LoginUserUseCase } from './application/usecases/login-user.usecase';
import { RegisterUserUseCase } from './application/usecases/register-user.usecase';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user-repository';
import { BcryptHasher } from './infrastructure/cryptography/bcrypt-hasher';
import { JwtEncrypter } from './infrastructure/cryptography/jwt-encrypter';
import { JwtStrategy, JWT_SECRET } from './infrastructure/auth/jwt.strategy';

@Module({
    imports: [
        PrismaModule,
        PassportModule,
        JwtModule.register({
            secret: JWT_SECRET,
            signOptions: { expiresIn: '7d' }, // 7 days expiration for MVP
        }),
    ],
    controllers: [AuthController],
    providers: [
        // UseCases
        LoginUserUseCase,
        RegisterUserUseCase,

        // Strategies
        JwtStrategy,

        // Infra & Domain implementations (Inversion of Control binds)
        {
            provide: 'UserRepository',
            useClass: PrismaUserRepository,
        },
        {
            provide: 'Hasher',
            useClass: BcryptHasher,
        },
        {
            provide: 'Encrypter',
            useClass: JwtEncrypter,
        },
        // We also need to map the explicit constructor dependencies for the use cases 
        // since NestJS uses type injection, but our UseCases were originally constructor-based.
        // As a factory we wire the injected mapped tokens:
        {
            provide: LoginUserUseCase,
            useFactory: (userRepo, hasher, encrypter) => {
                return new LoginUserUseCase(userRepo, hasher, encrypter);
            },
            inject: ['UserRepository', 'Hasher', 'Encrypter']
        },
        {
            provide: RegisterUserUseCase,
            useFactory: (userRepo, hasher) => {
                return new RegisterUserUseCase(userRepo, hasher);
            },
            inject: ['UserRepository', 'Hasher']
        }
    ],
    exports: [JwtModule, PassportModule],
})
export class IdentityAccessModule { }
