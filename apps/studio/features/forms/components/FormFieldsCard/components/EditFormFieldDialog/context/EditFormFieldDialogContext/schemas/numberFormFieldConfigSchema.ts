import { z as zod } from 'zod';

export const numberFormFieldConfigSchema = zod.object({
  min: zod
    .number({
      description: 'Valor mínimo',
      required_error: 'Debe indicar el valor mínimo',
      invalid_type_error: 'Formato no válido',
    })
    .or(
      zod.nan({
        description: 'Valor mínimo',
        required_error: 'Debe indicar el valor mínimo',
        invalid_type_error: 'Formato no válido',
      })
    )
    .nullable(),

  max: zod
    .number({
      description: 'Valor máximo',
      required_error: 'Debe indicar el valor máximo',
      invalid_type_error: 'Formato no válido',
    })
    .or(
      zod.nan({
        description: 'Valor máximo',
        required_error: 'Debe indicar el valor máximo',
        invalid_type_error: 'Formato no válido',
      })
    )
    .nullable(),
});

export default numberFormFieldConfigSchema;
