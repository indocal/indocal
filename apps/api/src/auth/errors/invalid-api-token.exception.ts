import { UnauthorizedException } from '@nestjs/common';

export class InvalidApiTokenException extends UnauthorizedException {
  constructor() {
    super('API Token inexistente o no válido');
  }
}

export default InvalidApiTokenException;
