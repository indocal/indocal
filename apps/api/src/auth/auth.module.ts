import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { PrismaService } from '@/prisma';
import { NodemailerService } from '@/mailer';

import AuthController from './auth.controller';
import AuthService from './auth.service';
import {
  JwtAuthGuard,
  LocalAuthStrategy,
  JwtAuthStrategy,
  AbilityFactory,
} from './strategies';
import { JWT_MODULE_OPTIONS } from './config';

import {
  UsersModule,
  UsersRolesModule,
  UsersRolesPermissionsModule,
  UsersGroupsModule,
} from './submodules';

@Module({
  imports: [
    UsersModule,
    UsersRolesModule,
    UsersRolesPermissionsModule,
    UsersGroupsModule,
    PassportModule,
    JwtModule.register(JWT_MODULE_OPTIONS),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    PrismaService,
    NodemailerService,
    AuthService,
    LocalAuthStrategy,
    JwtAuthStrategy,
    AbilityFactory,
  ],
  exports: [AbilityFactory],
})
export class AuthModule {}

export default AuthModule;
