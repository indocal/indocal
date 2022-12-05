import { z as zod } from 'zod';

export const radioFormFieldConfigSchema = zod.object({
  options: zod
    .string({
      description: 'Opción',
      required_error: 'Debe ingresar la opción',
      invalid_type_error: 'Formato no válido',
    })
    .min(1, 'Debe ingresar la opción')
    .array()
    .min(1, 'Debe ingresar al menos una opción'),
});

export default radioFormFieldConfigSchema;
