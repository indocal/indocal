import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsUUID, IsOptional } from 'class-validator';

import { TrimParam, UUID } from '@/common';

class UpdateUserGroupDtoSchema {
  @IsString()
  @TrimParam()
  name: string;

  @IsString()
  @IsOptional()
  @TrimParam()
  description: string | null;

  @IsUUID('all', { each: true })
  members: UUID[];
}

export class UpdateUserGroupDto extends PartialType(UpdateUserGroupDtoSchema) {}

export default UpdateUserGroupDto;
