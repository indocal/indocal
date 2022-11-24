import { Module, forwardRef } from '@nestjs/common';

import { PrismaService } from '@/common';

import { AbilityFactory } from '../../strategies/attribute-based-access-control';

import { UsersRolesModule } from '../roles';
import { UsersGroupsModule } from '../groups';

import UsersController from './users.controller';
import UsersService from './users.service';

@Module({
  imports: [
    forwardRef(() => UsersRolesModule),
    forwardRef(() => UsersGroupsModule),
  ],
  controllers: [UsersController],
  providers: [PrismaService, UsersService, AbilityFactory],
  exports: [UsersService],
})
export class UsersModule {}

export default UsersModule;
