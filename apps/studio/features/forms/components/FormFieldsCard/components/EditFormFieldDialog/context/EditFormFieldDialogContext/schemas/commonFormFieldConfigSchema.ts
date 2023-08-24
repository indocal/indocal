import { z as zod } from 'zod';

export const commonFormFieldConfigSchema = zod.object({
  required: zod.boolean({
    description: '¿Campo requerido?',
    required_error: 'Debe indicar si el campo es requerido o no',
    invalid_type_error: 'Formato no válido',
  }),

  hint: zod
    .object({
      include: zod.boolean({
        description: '¿Incluir leyenda?',
        required_error: 'Debe indicar si desea incluir la leyenda o no',
        invalid_type_error: 'Formato no válido',
      }),

      position: zod
        .enum<string, ['BEFORE' | 'AFTER', ...('BEFORE' | 'AFTER')[]]>(
          ['BEFORE', 'AFTER'],
          {
            description: 'Posición de la leyenda',
            required_error: 'Debe seleccionar la posición de la leyenda',
            invalid_type_error: 'Formato no válido',
          }
        )
        .describe('Posición de la leyenda'),

      content: zod
        .string({
          description: 'Contenido de la leyenda',
          required_error: 'Debe ingresar el contenido de la leyenda',
          invalid_type_error: 'Formato no válido',
        })
        .nullish(),
    })
    .refine(
      (data) =>
        !data.include ||
        (data.include && data.content && data.content.length > 0),
      {
        message: 'Debe ingresar el contenido de la leyenda',
        path: ['content'],
      }
    ),
});

export default commonFormFieldConfigSchema;
