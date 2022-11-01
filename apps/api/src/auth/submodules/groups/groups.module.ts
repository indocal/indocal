import { Module, forwardRef } from '@nestjs/common';

import { PrismaService } from '@/common';

import { AbilityFactory } from '../../strategies/attribute-based-access-control';

import UsersGroupsController from './groups.controller';
import UsersGroupsService from './groups.service';

import { UsersModule } from '../users';

@Module({
  imports: [forwardRef(() => UsersModule)],
  controllers: [UsersGroupsController],
  providers: [PrismaService, UsersGroupsService, AbilityFactory],
  exports: [UsersGroupsService],
})
export class UsersGroupsModule {}

export default UsersGroupsModule;
