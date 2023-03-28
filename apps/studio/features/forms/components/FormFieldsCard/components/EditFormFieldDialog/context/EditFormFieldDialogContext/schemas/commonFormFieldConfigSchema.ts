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

  webhook: zod
    .object({
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
        .nullable(),
    })
    .refine(
      (data) =>
        !data.include || (data.include && data.key && data.key.length > 0),
      {
        message: 'Debe ingresar el webhook key',
        path: ['key'],
      }
    ),
});

export default commonFormFieldConfigSchema;
