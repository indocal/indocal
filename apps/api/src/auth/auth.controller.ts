import { Controller, Get, Post, Req, Body, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import AuthService from './auth.service';
import { LocalAuthGuard } from './strategies';
import { SkipAuthentication } from './decorators';
import { Session, AuthenticatedUser, JWT, RestorePasswordDto } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('local/sign-in')
  @SkipAuthentication()
  @UseGuards(LocalAuthGuard)
  signIn(@Req() req: Request): Session {
    return this.authService.generateSession(req.user as AuthenticatedUser);
  }

  // TODO: complete this feature
  @Post('local/restore-password')
  @SkipAuthentication()
  async restorePassword(
    @Body() restorePasswordDto: RestorePasswordDto
  ): Promise<void> {
    return await this.authService.sendRestorePasswordEmail(
      restorePasswordDto.email
    );
  }

  @Get('me')
  me(@Req() req: Request): JWT {
    return req.user as JWT;
  }
}

export default AuthController;
