import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaService } from 'nestjs-prisma';

import { JWT_MODULE_OPTIONS } from '../../config';
import { JWT } from '../../types';
import {
  InvalidApiTokenException,
  DisabledApiTokenException,
  InvalidUserCredentialsException,
  DisabledUserException,
} from '../../errors';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_MODULE_OPTIONS.secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JWT): Promise<JWT> {
    if (payload.type === 'api-token') {
      const apiToken = await this.prismaService.apiToken.findUnique({
        where: { id: payload.apiToken.id },
      });

      if (!apiToken) throw new InvalidApiTokenException();
      if (apiToken.status === 'DISABLED') throw new DisabledApiTokenException();

      return {
        type: 'api-token',
        apiToken: {
          id: apiToken.id,
          name: apiToken.name,
          description: apiToken.description,
        },
      };
    } else {
      const user = await this.prismaService.user.findUnique({
        where: { id: payload.user.id },
      });

      if (!user) throw new InvalidUserCredentialsException();
      if (user.status === 'DISABLED') throw new DisabledUserException();

      return {
        type: 'user',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
        },
      };
    }
  }
}

export default JwtAuthStrategy;
