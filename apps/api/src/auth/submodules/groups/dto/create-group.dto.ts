import { IsString, IsOptional } from 'class-validator';

import { TrimParam } from '@/common';

export class CreateUserGroupDto {
  @IsString()
  @TrimParam()
  name: string;

  @IsString()
  @IsOptional()
  @TrimParam()
  description?: string;
}

export default CreateUserGroupDto;
