import { PartialType } from '@nestjs/mapped-types';
import { IsBooleanString, IsString } from 'class-validator';

import { TrimParam } from '@/common';

class UpdateServiceRequestCommentDtoSchema {
  @IsBooleanString()
  isInternal: string;

  @IsString()
  @TrimParam()
  content: string;
}

export class UpdateServiceRequestCommentDto extends PartialType(
  UpdateServiceRequestCommentDtoSchema
) {}

export default UpdateServiceRequestCommentDto;
