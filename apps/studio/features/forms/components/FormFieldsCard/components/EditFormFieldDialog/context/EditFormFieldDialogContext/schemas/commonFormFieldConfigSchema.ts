import { z as zod } from 'zod';

export const commonFormFieldConfigSchema = zod.object({
  required: zod.boolean({
    description: '¿Campo requerido?',
    required_error: 'Debe indicar si el campo es requerido o no',
    invalid_type_error: 'Formato no válido',
  }),
});

export default commonFormFieldConfigSchema;
