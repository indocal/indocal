import { PartialType } from '@nestjs/mapped-types';
import { IsUUID, IsOptional } from 'class-validator';

import { UUID } from '@/common';

class UploadFilesParamsDtoSchema {
  @IsUUID()
  @IsOptional()
  folder?: UUID;
}

export class UploadFilesParamsDto extends PartialType(
  UploadFilesParamsDtoSchema
) {}

export default UploadFilesParamsDto;
