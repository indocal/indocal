import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';

import { TrimParam } from '@/common';

class UpdateUserRolePermissionDtoSchema {
  @IsString()
  @TrimParam()
  action: string;
}

export class UpdateUserRolePermissionDto extends PartialType(
  UpdateUserRolePermissionDtoSchema
) {}

export default UpdateUserRolePermissionDto;
