import { Injectable } from '@nestjs/common';
import { Hasher } from '../../application/cryptography/hasher';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptHasher implements Hasher {
    private readonly SALT_ROUNDS = 10;

    async hash(plain: string): Promise<string> {
        return bcrypt.hash(plain, this.SALT_ROUNDS);
    }

    async compare(plain: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plain, hash);
    }
}
