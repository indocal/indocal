import { UnauthorizedException } from '@nestjs/common';

export class InvalidCredentialsException extends UnauthorizedException {
  constructor() {
    super('Usuario inexistente o credenciales no válidas');
  }
}

export default InvalidCredentialsException;
