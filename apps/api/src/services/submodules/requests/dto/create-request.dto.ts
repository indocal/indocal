import { IsObject, IsUUID } from 'class-validator';

import { UUID } from '@/common';

import { FormFieldAnswer } from '../../../../forms/submodules/entries/entities';

export class CreateServiceRequestDto {
  @IsObject({ each: true })
  answers: FormFieldAnswer[]; // TODO: Validate this object

  @IsUUID()
  service: UUID;

  @IsUUID()
  requestedBy: UUID;
}

export default CreateServiceRequestDto;
