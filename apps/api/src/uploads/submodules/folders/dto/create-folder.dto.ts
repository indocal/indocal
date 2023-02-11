import { IsString, IsUUID, IsOptional } from 'class-validator';

import { TrimParam, UUID } from '@/common';

export class CreateFolderDto {
  @IsString()
  @TrimParam()
  name: string;

  @IsUUID()
  @IsOptional()
  folder?: UUID;
}

export default CreateFolderDto;
