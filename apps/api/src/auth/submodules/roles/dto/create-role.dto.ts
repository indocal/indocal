import { IsString } from 'class-validator';

import { TrimParam } from '@/common';

export class CreateUserRoleDto {
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

export default CreateUserRoleDto;
