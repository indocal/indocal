import { Module, forwardRef } from '@nestjs/common';

import { PrismaService } from '@/common';

import { AbilityFactory } from '../../strategies/attribute-based-access-control';

import UsersController from './users.controller';
import UsersService from './users.service';

import { UsersRolesModule } from '../roles';
import { UsersGroupsModule } from '../groups';

@Module({
  imports: [UsersRolesModule, forwardRef(() => UsersGroupsModule)],
  controllers: [UsersController],
  providers: [PrismaService, UsersService, AbilityFactory],
  exports: [UsersService],
})
export class UsersModule {}

export default UsersModule;
