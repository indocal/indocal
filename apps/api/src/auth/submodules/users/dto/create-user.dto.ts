import { IsString, IsEmail } from 'class-validator';

import { TrimParam } from '@/common';

export class CreateUserDto {
  @IsString()
  @TrimParam()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export default CreateUserDto;
