import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsUUID,
  IsEnum,
  IsOptional,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { TrimParam, UUID } from '@/common';

import { UserRoleConfig, UserRoleAccessType } from '../entities';

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

  @IsObject() // TODO: Validate this object
  permissions: UserRolePermissions;
}

export class UpdateUserRoleDto extends PartialType(UpdateUserRoleDtoSchema) {}

export default UpdateUserRoleDto;

////////////////////////////
// UserRoleConfig Schemas //
////////////////////////////

class UserRoleConfigAccessSchema {
  @IsEnum({ NONE: 'NONE', STANDARD: 'STANDARD', ADMIN: 'ADMIN' })
  studio: UserRoleAccessType;

  @IsEnum({ NONE: 'NONE', STANDARD: 'STANDARD', ADMIN: 'ADMIN' })
  hub: UserRoleAccessType;

  @IsEnum({ NONE: 'NONE', STANDARD: 'STANDARD', ADMIN: 'ADMIN' })
  app: UserRoleAccessType;

  @IsEnum({ NONE: 'NONE', STANDARD: 'STANDARD', ADMIN: 'ADMIN' })
  nobu: UserRoleAccessType;

  @IsEnum({ NONE: 'NONE', STANDARD: 'STANDARD', ADMIN: 'ADMIN' })
  warehouse: UserRoleAccessType;
}

class UserRoleConfigSchema {
  @IsOptional()
  @ValidateNested()
  @Type(() => UserRoleConfigAccessSchema)
  access?: UserRoleConfigAccessSchema;
}
