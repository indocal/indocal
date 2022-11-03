import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsUUID } from 'class-validator';

import { TrimParam, UUID } from '@/common';

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
}

export class UpdateUserRoleDto extends PartialType(UpdateUserRoleDtoSchema) {}

export default UpdateUserRoleDto;
