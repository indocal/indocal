import { IsObject, IsUUID } from 'class-validator';

import { UUID } from '@/common';

import { FormFieldAnswer } from '../../../../forms/submodules/entries/entities';

export class CreateServiceRequestDto {
  @IsObject({ each: true })
  formAnswers: FormFieldAnswer[]; // TODO: Validate this object

  @IsUUID()
  requestedBy: UUID;

  @IsUUID()
  service: UUID;
}

export default CreateServiceRequestDto;
