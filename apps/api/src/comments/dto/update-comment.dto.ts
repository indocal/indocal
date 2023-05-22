import { PartialType } from '@nestjs/mapped-types';
import { IsBooleanString, IsString } from 'class-validator';

import { TrimParam } from '@/common';

class UpdateCommentDtoSchema {
  @IsBooleanString()
  isInternal: string;

  @IsString()
  @TrimParam()
  content: string;
}

export class UpdateCommentDto extends PartialType(UpdateCommentDtoSchema) {}

export default UpdateCommentDto;
