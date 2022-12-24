import { z as zod } from 'zod';

export const commonFormFieldConfigSchema = zod.object({
  required: zod.boolean({
    description: '¿Campo requerido?',
    required_error: 'Debe indicar si el campo es requerido o no',
    invalid_type_error: 'Formato no válido',
  }),

  webhook: zod.object({
    include: zod.boolean({
      description: '¿Incluir en el webhook?',
      required_error: 'Debe indicar si el campo debe ser incluido o no',
      invalid_type_error: 'Formato no válido',
    }),

    key: zod
      .string({
        description: 'Webhook key',
        required_error: 'Debe ingresar el webhook key',
        invalid_type_error: 'Formato no válido',
      })
      .min(1, 'Debe ingresar el webhook key'),
  }),
});

export default commonFormFieldConfigSchema;
