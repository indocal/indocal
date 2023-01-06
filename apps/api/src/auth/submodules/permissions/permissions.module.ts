import { Module } from '@nestjs/common';

import { PrismaService } from '@/prisma';

import { AbilityFactory } from '../../strategies/attribute-based-access-control';

import UsersRolesPermissionsController from './permissions.controller';

@Module({
  controllers: [UsersRolesPermissionsController],
  providers: [PrismaService, AbilityFactory],
})
export class UsersRolesPermissionsModule {}

export default UsersRolesPermissionsModule;
