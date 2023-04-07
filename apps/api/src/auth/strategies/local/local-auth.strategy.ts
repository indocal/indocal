import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '../../auth.service';
import { AuthenticatedUser } from '../../types';
import {
  InvalidUserCredentialsException,
  DisabledUserException,
} from '../../errors';

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(
    username: string,
    password: string
  ): Promise<AuthenticatedUser> {
    const user = await this.authService.validateUserByCredentials(
      username,
      password
    );

    if (!user) throw new InvalidUserCredentialsException();
    if (user.status === 'DISABLED') throw new DisabledUserException();

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
    };
  }
}

export default LocalAuthStrategy;
