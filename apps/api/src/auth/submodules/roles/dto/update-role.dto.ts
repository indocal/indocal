import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';

import { TrimParam } from '@/common';

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
}

export class UpdateUserRoleDto extends PartialType(UpdateUserRoleDtoSchema) {}

export default UpdateUserRoleDto;
