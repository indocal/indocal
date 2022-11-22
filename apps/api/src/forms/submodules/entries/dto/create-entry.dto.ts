import { IsObject, IsUUID, IsOptional } from 'class-validator';

import { UUID } from '@/common';

export class CreateFormEntryDto {
  @IsObject()
  answers: object;

  @IsUUID()
  form: UUID;

  @IsUUID()
  @IsOptional()
  sentBy?: UUID;
}

export default CreateFormEntryDto;
