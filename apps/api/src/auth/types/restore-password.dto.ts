import { IsEmail } from 'class-validator';

export class RestorePasswordDto {
  @IsEmail()
  email: string;
}

export default RestorePasswordDto;
