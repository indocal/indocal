import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsEmail } from 'class-validator';

import { TrimParam } from '@/common';

class UpdateEventGuestDtoSchema {
  @IsString()
  @TrimParam()
  dni: string;

  @IsString()
  @TrimParam()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @TrimParam()
  phone: string;

  @IsString()
  @TrimParam()
  from: string;

  @IsString()
  @TrimParam()
  position: string;
}

export class UpdateEventGuestDto extends PartialType(
  UpdateEventGuestDtoSchema
) {}

export default UpdateEventGuestDto;
