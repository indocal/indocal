import { IsObject, IsUUID, IsOptional } from 'class-validator';

import { UUID } from '@/common';

export class CreateFormEntryDto {
  @IsObject({ each: true })
  answers: object[];

  @IsUUID()
  form: UUID;

  @IsUUID()
  @IsOptional()
  answeredBy?: UUID;
}

export default CreateFormEntryDto;
