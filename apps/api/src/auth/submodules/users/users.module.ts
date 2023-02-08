import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { AbilityFactory } from '../../strategies/attribute-based-access-control';

import UsersController from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [PrismaService, AbilityFactory],
})
export class UsersModule {}

export default UsersModule;
