import { StatusCodes } from 'http-status-codes';

export type ServiceErrorConstructor = {
  status: StatusCodes;
  type: string;
  message: string;
  details?: string[];
  options?: ErrorOptions;
};

export class ServiceError extends Error {
  readonly status: StatusCodes;
  readonly type: string;
  readonly details?: string[];

  constructor(constructor: ServiceErrorConstructor) {
    super(constructor.message, constructor?.options);

    this.name = `ServiceError: ${constructor.type}`;
    this.status = constructor.status;
    this.type = constructor.type;
    this.details = constructor.details;
  }
}

export default ServiceError;
