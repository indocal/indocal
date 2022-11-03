import { Module, forwardRef } from '@nestjs/common';

import { PrismaService } from '@/common';

import { AbilityFactory } from '../../strategies/attribute-based-access-control';

import UsersRolesController from './roles.controller';
import UsersRolesService from './roles.service';

import { UsersRolesPermissionsModule } from '../permissions';
import { UsersModule } from '../users';

@Module({
  imports: [UsersRolesPermissionsModule, forwardRef(() => UsersModule)],
  controllers: [UsersRolesController],
  providers: [PrismaService, UsersRolesService, AbilityFactory],
  exports: [UsersRolesService],
})
export class UsersRolesModule {}

export default UsersRolesModule;
