import {
  Controller,
  Get,
  Post,
  Request,
  Body,
  UseGuards,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';

import AuthService from './auth.service';
import { LocalAuthGuard } from './strategies';
import { SkipAuthentication } from './decorators';
import { Session, AuthenticatedUser, RestorePasswordDto } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('local/sign-in')
  @SkipAuthentication()
  @UseGuards(LocalAuthGuard)
  signIn(@Request() req: ExpressRequest): Session {
    return this.authService.generateSession(req.user as AuthenticatedUser);
  }

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
  me(@Request() req: ExpressRequest): AuthenticatedUser {
    return req.user as AuthenticatedUser;
  }
}

export default AuthController;
