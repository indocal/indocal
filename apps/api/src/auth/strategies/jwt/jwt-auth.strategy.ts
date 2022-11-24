import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { UsersService } from '../../submodules';

import { JWT_MODULE_OPTIONS } from '../../config';
import { AuthenticatedUser } from '../../types';
import {
  InvalidCredentialsException,
  DisabledUserException,
} from '../../errors';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_MODULE_OPTIONS.secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: AuthenticatedUser): Promise<AuthenticatedUser> {
    const user = await this.usersService.findUnique({ id: payload.id });

    if (!user) throw new InvalidCredentialsException();
    if (user.status === 'DISABLED') throw new DisabledUserException();

    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }
}

export default JwtAuthStrategy;
