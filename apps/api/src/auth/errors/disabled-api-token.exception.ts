import { ForbiddenException } from '@nestjs/common';

export class DisabledApiTokenException extends ForbiddenException {
  constructor() {
    super('API Token deshabilitado');
  }
}

export default DisabledApiTokenException;
