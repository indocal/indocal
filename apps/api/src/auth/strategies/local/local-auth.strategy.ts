import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { PrismaService } from 'nestjs-prisma';
import * as bcrypt from 'bcrypt';

import { AuthenticatedUser } from '../../types';
import {
  InvalidUserCredentialsException,
  DisabledUserException,
} from '../../errors';

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private prismaService: PrismaService) {
    super();
  }

  async validate(
    username: string,
    password: string
  ): Promise<AuthenticatedUser> {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });

    if (!user || !bcrypt.compareSync(password, user.password))
      throw new InvalidUserCredentialsException();

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
