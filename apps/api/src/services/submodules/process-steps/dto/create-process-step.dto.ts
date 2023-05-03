import { IsString, IsOptional } from 'class-validator';

import { TrimParam } from '@/common';

export class CreateServiceProcessStepDto {
  @IsString()
  @TrimParam()
  title: string;

  @IsString()
  @IsOptional()
  @TrimParam()
  description?: string;
}

export default CreateServiceProcessStepDto;
