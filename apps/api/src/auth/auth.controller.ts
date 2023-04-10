import { Controller, Get, Post, Req, Body, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';
import { Request } from 'express';
import { addHours } from 'date-fns';

import { NodemailerService } from '@/mailer';

import { LocalAuthGuard } from './strategies';
import { SkipAuthentication } from './decorators';
import { restorePasswordEmailTemplate } from './mails';
import { InvalidEmailException } from './errors';
import {
  JWT,
  UserJwt,
  AuthenticatedUser,
  Session,
  ResetPasswordToken,
  RestorePasswordDto,
} from './types';

@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private nodemailerService: NodemailerService,
    private prismaService: PrismaService
  ) {}

  @Post('local/sign-in')
  @SkipAuthentication()
  @UseGuards(LocalAuthGuard)
  signIn(@Req() req: Request): Session {
    const payload = req.user as AuthenticatedUser;

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

  @Post('local/restore-password')
  @SkipAuthentication()
  async restorePassword(
    @Body() restorePasswordDto: RestorePasswordDto
  ): Promise<void> {
    const user = await this.prismaService.user.findUnique({
      where: { email: restorePasswordDto.email },
    });

    if (!user) throw new InvalidEmailException();

    const payload: AuthenticatedUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
    };

    const token: ResetPasswordToken = {
      token: this.jwtService.sign({ user: payload }, { expiresIn: '1h' }),
      expiresAt: addHours(Date.now(), 1),
    };

    await this.nodemailerService.transporter.sendMail({
      from: process.env.NODEMAILER_FROM,
      to: user.email,
      subject: `Restablecer contraseña: ${user.username}`,
      html: restorePasswordEmailTemplate({
        user: payload,
        reset_token: token,
        redirectUrl: restorePasswordDto.redirectUrl,
      }),
    });
  }

  @Get('me')
  me(@Req() req: Request): JWT {
    return req.user as JWT;
  }
}

export default AuthController;
