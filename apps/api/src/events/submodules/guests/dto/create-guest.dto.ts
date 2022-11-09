import { IsString, IsEmail } from 'class-validator';

import { TrimParam } from '@/common';

export class CreateEventGuestDto {
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

export default CreateEventGuestDto;
