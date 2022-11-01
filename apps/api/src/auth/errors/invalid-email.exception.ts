import { NotFoundException } from '@nestjs/common';

export class InvalidEmailException extends NotFoundException {
  constructor() {
    super('No existe usuario registrado con el correo electrónico previsto');
  }
}

export default InvalidEmailException;
