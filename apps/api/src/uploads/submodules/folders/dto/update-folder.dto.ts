import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsUUID, IsOptional } from 'class-validator';

import { TrimParam, UUID } from '@/common';

class UpdateFolderDtoSchema {
  @IsString()
  @TrimParam()
  name: string;

  @IsUUID()
  @IsOptional()
  folder: UUID | null;
}

export class UpdateFolderDto extends PartialType(UpdateFolderDtoSchema) {}

export default UpdateFolderDto;
