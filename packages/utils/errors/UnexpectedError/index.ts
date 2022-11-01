export type UnexpectedErrorConstructor = {
  message?: string;
  options?: ErrorOptions;
};

export class UnexpectedError extends Error {
  constructor(constructor?: UnexpectedErrorConstructor) {
    super(
      constructor?.message || 'Ha ocurrido un error inesperado',
      constructor?.options
    );
  }
}

export default UnexpectedError;
