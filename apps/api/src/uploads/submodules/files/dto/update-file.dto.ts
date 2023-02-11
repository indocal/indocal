import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsUUID, IsOptional } from 'class-validator';

import { TrimParam, UUID } from '@/common';

class UpdateFileDtoSchema {
  @IsString()
  @TrimParam()
  name: string;

  @IsString()
  @TrimParam()
  @IsOptional()
  caption?: string;

  @IsString()
  @TrimParam()
  @IsOptional()
  alt?: string;

  @IsUUID()
  @IsOptional()
  folder?: UUID;
}

export class UpdateFileDto extends PartialType(UpdateFileDtoSchema) {}

export default UpdateFileDto;
