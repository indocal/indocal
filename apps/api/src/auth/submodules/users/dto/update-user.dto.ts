import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsEmail, IsEnum, IsUUID } from 'class-validator';
import { UserStatus } from '@prisma/client';

import { TrimParam, UUID } from '@/common';

class UpdateUserDtoSchema {
  @IsString()
  @TrimParam()
  username: string;

  @IsEmail()
  email: string;

  @IsEnum(UserStatus)
  status: UserStatus;

  @IsUUID('all', { each: true })
  roles: UUID[];

  @IsUUID('all', { each: true })
  groups: UUID[];
}

export class UpdateUserDto extends PartialType(UpdateUserDtoSchema) {}

export default UpdateUserDto;
