import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsObject, IsUUID } from 'class-validator';

import { TrimParam, UUID } from '@/common';

export type UserRoleAccessType = 'NONE' | 'STANDARD' | 'ADMIN';

export type UserRoleConfig = Partial<{
  access: Record<string, UserRoleAccessType>;
}>;

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

  @IsObject()
  config: UserRoleConfig;

  @IsObject()
  permissions: UserRolePermissions;

  @IsUUID('all', { each: true })
  users: UUID[];
}

export class UpdateUserRoleDto extends PartialType(UpdateUserRoleDtoSchema) {}

export default UpdateUserRoleDto;
