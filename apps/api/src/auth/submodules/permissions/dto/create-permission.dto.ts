import { IsString } from 'class-validator';

import { TrimParam } from '@/common';

export class CreateUserRolePermissionDto {
  @IsString()
  @TrimParam()
  action: string;
}

export default CreateUserRolePermissionDto;
