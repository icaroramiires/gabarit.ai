import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// Chave hardcodada por MVP local. Mas a regra natural seria Process.env.JWT_SECRET
export const JWT_SECRET = 'gabaritai-secret-key-super-secure-2026';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: JWT_SECRET,
        });
    }

    async validate(payload: { sub: string; email: string }) {
        return { userId: payload.sub, email: payload.email };
    }
}
