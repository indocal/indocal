import { BadRequestException } from '@nestjs/common';

export class InvalidReceivedQuantityException extends BadRequestException {
  constructor(supply: string, remaining: number, received: number) {
    super(
      `Cantidad recibida del recurso ${supply} no válida, la cantidad restante es ${remaining} y se recibió ${received}`
    );
  }
}

export default InvalidReceivedQuantityException;
