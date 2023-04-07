import { UnauthorizedException } from '@nestjs/common';

export class InvalidUserCredentialsException extends UnauthorizedException {
  constructor() {
    super('Usuario inexistente o credenciales no válidas');
  }
}

export default InvalidUserCredentialsException;
