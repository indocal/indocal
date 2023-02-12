import { BadRequestException } from '@nestjs/common';
import { Supply } from '@prisma/client';

export interface InvalidQuantityExceptionConstructor {
  supply: Supply | string;
  quantity: number;
}

export class InvalidQuantityException extends BadRequestException {
  constructor({ supply, quantity }: InvalidQuantityExceptionConstructor) {
    const name = typeof supply === 'string' ? supply : supply.name;

    const message = `La cantidad solicitada (${quantity}) no es válida para el recurso ${name}.`;

    super(message);
  }
}

export default InvalidQuantityException;
