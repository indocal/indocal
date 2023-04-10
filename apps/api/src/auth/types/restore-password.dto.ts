import { IsEmail, IsUrl } from 'class-validator';

export class RestorePasswordDto {
  @IsEmail()
  email: string;

  @IsUrl()
  redirectUrl: string;
}

export default RestorePasswordDto;
