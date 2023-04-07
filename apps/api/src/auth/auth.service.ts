import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { UUID } from '@/common';
import { NodemailerService } from '@/mailer';

import {
  InvalidUserCredentialsException,
  InvalidEmailException,
} from './errors';
import { Session, AuthenticatedUser, UserJwt } from './types';
import { restorePasswordEmailTemplate } from './mails';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private nodemailerService: NodemailerService
  ) {}

  generateSession(payload: AuthenticatedUser): Session {
    const jwt: UserJwt = {
      type: 'user',
      user: payload,
    };

    return {
      user: payload,
      access_token: this.jwtService.sign(jwt),
      issued_at: new Date().toISOString(),
    };
  }

  async validateUserByCredentials(
    username: string,
    password: string
  ): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });

    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    } else {
      return null;
    }
  }

  // TODO: complete this feature
  async sendRestorePasswordEmail(email: string): Promise<void> {
    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (!user) throw new InvalidEmailException();

    await this.nodemailerService.transporter.sendMail({
      from: process.env.NODEMAILER_FROM,
      to: user.email,
      subject: `Restablecer contraseña: ${user.username}`,
      html: restorePasswordEmailTemplate(user),
    });
  }

  async changePassword(
    target: UUID | AuthenticatedUser,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.prismaService.user.findUnique({
      where: { id: typeof target === 'string' ? target : target.id },
    });

    if (!user || !bcrypt.compareSync(currentPassword, user.password))
      throw new InvalidUserCredentialsException();

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(newPassword, salt);

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { password: hash },
    });
  }
}

export default AuthService;
