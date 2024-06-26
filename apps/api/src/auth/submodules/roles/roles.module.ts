import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { AbilityFactory } from '../../strategies/attribute-based-access-control';

import UsersRolesController from './roles.controller';

@Module({
  controllers: [UsersRolesController],
  providers: [PrismaService, AbilityFactory],
})
export class UsersRolesModule {}

export default UsersRolesModule;
