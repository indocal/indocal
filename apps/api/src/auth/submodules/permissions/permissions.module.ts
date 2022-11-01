import { Module } from '@nestjs/common';

import { PrismaService } from '@/common';

import { AbilityFactory } from '../../strategies/attribute-based-access-control';

import UsersRolesPermissionsController from './permissions.controller';
import UsersRolesPermissionsService from './permissions.service';

@Module({
  controllers: [UsersRolesPermissionsController],
  providers: [PrismaService, UsersRolesPermissionsService, AbilityFactory],
  exports: [UsersRolesPermissionsService],
})
export class UsersRolesPermissionsModule {}

export default UsersRolesPermissionsModule;
