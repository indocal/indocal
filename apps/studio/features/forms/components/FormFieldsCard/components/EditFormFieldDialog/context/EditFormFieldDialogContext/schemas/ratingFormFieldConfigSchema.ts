import { z as zod } from 'zod';

export const ratingFormFieldConfigSchema = zod.object({
  levels: zod
    .number({
      description: 'Niveles de puntuación',
      required_error: 'Debe indicar los niveles de puntuación',
      invalid_type_error: 'Formato no válido',
    })
    .or(
      zod.nan({
        description: 'Niveles de puntuación',
        required_error: 'Debe indicar los niveles de puntuación',
        invalid_type_error: 'Formato no válido',
      })
    )
    .nullable(),
});

export default ratingFormFieldConfigSchema;
