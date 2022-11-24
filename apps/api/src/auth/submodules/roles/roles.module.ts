import { Module, forwardRef } from '@nestjs/common';

import { PrismaService } from '@/common';

import { AbilityFactory } from '../../strategies/attribute-based-access-control';

import { UsersRolesPermissionsModule } from '../permissions';
import { UsersModule } from '../users';

import UsersRolesController from './roles.controller';
import UsersRolesService from './roles.service';

@Module({
  imports: [UsersRolesPermissionsModule, forwardRef(() => UsersModule)],
  controllers: [UsersRolesController],
  providers: [PrismaService, UsersRolesService, AbilityFactory],
  exports: [UsersRolesService],
})
export class UsersRolesModule {}

export default UsersRolesModule;
