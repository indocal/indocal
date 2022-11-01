import { ForbiddenException } from '@nestjs/common';

export class DisabledUserException extends ForbiddenException {
  constructor() {
    super('Usuario deshabilitado');
  }
}

export default DisabledUserException;
