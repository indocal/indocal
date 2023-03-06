import { z as zod } from 'zod';

export const filesFormFieldConfigSchema = zod.object({
  accept: zod
    .string({
      description: 'Tipos de archivos aceptados',
      required_error: 'Debe indicar los tipos de archivos aceptados',
      invalid_type_error: 'Formato no válido',
    })
    .array()
    .min(1, 'Debe indicar al menos un tipo de archivo aceptado'),

  multiple: zod.boolean({
    description: '¿Campo múltiple?',
    required_error: 'Debe indicar si el campo es múltiple o no',
    invalid_type_error: 'Formato no válido',
  }),

  minFiles: zod
    .number({
      description: 'Archivos mínimos',
      required_error: 'Debe indicar los archivos mínimos',
      invalid_type_error: 'Formato no válido',
    })
    .or(
      zod.nan({
        description: 'Archivos mínimos',
        required_error: 'Debe indicar los archivos mínimos',
        invalid_type_error: 'Formato no válido',
      })
    )
    .nullable(),

  maxFiles: zod
    .number({
      description: 'Archivos máximos',
      required_error: 'Debe indicar los archivos máximos',
      invalid_type_error: 'Formato no válido',
    })
    .or(
      zod.nan({
        description: 'Archivos máximos',
        required_error: 'Debe indicar los archivos máximos',
        invalid_type_error: 'Formato no válido',
      })
    )
    .nullable(),
});

export default filesFormFieldConfigSchema;
