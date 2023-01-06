import { Module } from '@nestjs/common';

import { PrismaService } from '@/prisma';

import { AbilityFactory } from '../../strategies/attribute-based-access-control';

import UsersGroupsController from './groups.controller';

@Module({
  controllers: [UsersGroupsController],
  providers: [PrismaService, AbilityFactory],
})
export class UsersGroupsModule {}

export default UsersGroupsModule;
