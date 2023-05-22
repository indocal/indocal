import {
  IsBooleanString,
  IsString,
  IsUUID,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { TrimParam, UUID } from '@/common';

export type AttachModel = 'request';

export const AttachModel = { REQUEST: 'request' };

class Attach {
  @IsEnum(AttachModel)
  model: AttachModel;

  @IsUUID()
  entity: UUID;
}

export class CreateCommentDto {
  @IsBooleanString()
  isInternal: string;

  @IsString()
  @TrimParam()
  content: string;

  @IsUUID()
  author: UUID;

  @ValidateNested()
  @Type(() => Attach)
  attach: Attach;
}

export default CreateCommentDto;
