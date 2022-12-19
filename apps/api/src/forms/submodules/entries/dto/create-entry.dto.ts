import { IsObject, IsUUID, IsOptional } from 'class-validator';

import { UUID } from '@/common';

import { FormFieldAnswer } from '../entities';

export class CreateFormEntryDto {
  @IsObject({ each: true })
  answers: FormFieldAnswer[];

  @IsUUID()
  form: UUID;

  @IsUUID()
  @IsOptional()
  answeredBy?: UUID;
}

export default CreateFormEntryDto;
