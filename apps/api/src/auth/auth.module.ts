import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { PrismaService, NodemailerService } from '@/common';

import AuthController from './auth.controller';
import AuthService from './auth.service';
import {
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
