import { z as zod } from 'zod';

export const textFormFieldConfigSchema = zod.object({
  minLength: zod
    .number({
      description: 'Caracteres mínimos',
      required_error: 'Debe indicar los caracteres mínimos',
      invalid_type_error: 'Formato no válido',
    })
    .or(
      zod.nan({
        description: 'Caracteres mínimos',
        required_error: 'Debe indicar los caracteres mínimos',
        invalid_type_error: 'Formato no válido',
      })
    )
    .nullable(),

  maxLength: zod
    .number({
      description: 'Caracteres máximos',
      required_error: 'Debe indicar los caracteres máximos',
      invalid_type_error: 'Formato no válido',
    })
    .or(
      zod.nan({
        description: 'Caracteres máximos',
        required_error: 'Debe indicar los caracteres máximos',
        invalid_type_error: 'Formato no válido',
      })
    )
    .nullable(),
});

export default textFormFieldConfigSchema;
