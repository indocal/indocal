import { IsString, IsNumber, IsUUID, IsOptional } from 'class-validator';

import { TrimParam, UUID } from '@/common';

export class CreateFileDto {
  @IsString()
  @TrimParam()
  path: string;

  @IsString()
  @TrimParam()
  mime: string;

  @IsString()
  @TrimParam()
  extension: string;

  @IsNumber()
  size: number;

  @IsNumber(undefined, { each: true })
  dimensions: number[];

  @IsString()
  @TrimParam()
  name: string;

  @IsString()
  @TrimParam()
  @IsOptional()
  caption?: string;

  @IsString()
  @TrimParam()
  @IsOptional()
  alt?: string;

  @IsUUID()
  @IsOptional()
  folder?: UUID;
}

export default CreateFileDto;
