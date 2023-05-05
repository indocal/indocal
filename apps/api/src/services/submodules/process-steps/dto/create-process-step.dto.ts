import { IsString, IsUUID, ArrayMinSize, IsOptional } from 'class-validator';

import { TrimParam, UUID } from '@/common';

export class CreateServiceProcessStepDto {
  @IsString()
  @TrimParam()
  title: string;

  @IsString()
  @IsOptional()
  @TrimParam()
  description?: string;

  @IsUUID('all', { each: true })
  @ArrayMinSize(1)
  owners: UUID[];
}

export default CreateServiceProcessStepDto;
