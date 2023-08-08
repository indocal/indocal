import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsUUID,
  IsEnum,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { TrimParam, UUID } from '@/common';

import { UserRoleConfig, UserRoleAccessType } from '../entities';
import { IsUserRolePermissions } from '../decorators';

export type UserRolePermissions = Record<string, Record<string, boolean>>;

class UpdateUserRoleDtoSchema {
  @IsString()
  @TrimParam()
  type: string;

  @IsString()
  @TrimParam()
  name: string;

  @IsString()
  @TrimParam()
  description: string;

  @IsUUID('all', { each: true })
  users: UUID[];

  @ValidateNested()
  @Type(() => UserRoleConfigSchema)
  config: UserRoleConfig;

  @IsUserRolePermissions()
  permissions: UserRolePermissions;
}

export class UpdateUserRoleDto extends PartialType(UpdateUserRoleDtoSchema) {}

export default UpdateUserRoleDto;

////////////////////////////
// UserRoleConfig Schemas //
////////////////////////////

class UserRoleConfigAccessSchema {
  @IsEnum({ FORBIDDEN: 'FORBIDDEN', ALLOWED: 'ALLOWED' })
  studio: UserRoleAccessType;

  @IsEnum({ FORBIDDEN: 'FORBIDDEN', ALLOWED: 'ALLOWED' })
  hub: UserRoleAccessType;

  @IsEnum({ FORBIDDEN: 'FORBIDDEN', ALLOWED: 'ALLOWED' })
  app: UserRoleAccessType;

  @IsEnum({ FORBIDDEN: 'FORBIDDEN', ALLOWED: 'ALLOWED' })
  nobu: UserRoleAccessType;

  @IsEnum({ FORBIDDEN: 'FORBIDDEN', ALLOWED: 'ALLOWED' })
  warehouse: UserRoleAccessType;
}

class UserRoleConfigSchema {
  @IsOptional()
  @ValidateNested()
  @Type(() => UserRoleConfigAccessSchema)
  access?: UserRoleConfigAccessSchema;
}
