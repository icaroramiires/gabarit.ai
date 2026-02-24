import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { UserRepository } from '../../domain/repositories/user-repository';
import { User } from '../../domain/entities/user';
import { UniqueEntityID } from '../../../../core/domain/UniqueEntityID';

@Injectable()
export class PrismaUserRepository implements UserRepository {
    constructor(private prisma: PrismaService) { }

    async findByEmail(email: string): Promise<User | null> {
        const raw = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!raw) return null;

        return User.create(
            {
                name: raw.name,
                email: raw.email,
                passwordHash: raw.passwordHash,
                createdAt: raw.createdAt,
            },
            new UniqueEntityID(raw.id),
        );
    }

    async create(user: User): Promise<void> {
        await this.prisma.user.create({
            data: {
                id: user.id.toString(),
                name: user.name,
                email: user.email,
                passwordHash: user.passwordHash,
                createdAt: user.createdAt,
            },
        });
    }

    async save(user: User): Promise<void> {
        await this.prisma.user.update({
            where: { id: user.id.toString() },
            data: {
                name: user.name,
                email: user.email,
                passwordHash: user.passwordHash,
            },
        });
    }
}
