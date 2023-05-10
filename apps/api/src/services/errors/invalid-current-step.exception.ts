import { BadRequestException } from '@nestjs/common';

export class InvalidCurrentStepException extends BadRequestException {
  constructor() {
    const message = `La solicitud esta cerrada o no tiene un paso actual que pueda ser aprobado o rechazado.`;

    super(message);
  }
}

export default InvalidCurrentStepException;
