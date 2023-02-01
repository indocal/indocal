import { BadRequestException } from '@nestjs/common';
import { Supply } from '@prisma/client';

export interface InsufficientQuantityExceptionConstructor {
  supply: Supply | string;
  remaining: number;
  requested: number;
}

export class InsufficientQuantityException extends BadRequestException {
  constructor({
    supply,
    remaining,
    requested,
  }: InsufficientQuantityExceptionConstructor) {
    const name = typeof supply === 'string' ? supply : supply.name;

    const message = `Solo quedan ${remaining} ${name} restantes de ${requested} solicitados.`;

    super(message);
  }
}

export default InsufficientQuantityException;
