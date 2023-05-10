import { IsBooleanString, IsString, IsUUID } from 'class-validator';

import { TrimParam, UUID } from '@/common';

export class CreateServiceRequestCommentDto {
  @IsBooleanString()
  isInternal: string;

  @IsString()
  @TrimParam()
  content: string;

  @IsUUID()
  author: UUID;
}

export default CreateServiceRequestCommentDto;
