import { z as zod } from 'zod';

export const selectFormFieldConfigSchema = zod.object({
  multiple: zod.boolean({
    description: '¿Campo múltiple?',
    required_error: 'Debe indicar si el campo es múltiple o no',
    invalid_type_error: 'Formato no válido',
  }),

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

export default selectFormFieldConfigSchema;
