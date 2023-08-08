import { z as zod } from 'zod';

import { FormFieldType } from '@indocal/services';

export const signaturePlaceholderConfigSchema = zod.object(
  {
    associatedField: zod
      .object(
        {
          id: zod
            .string({
              description: 'UUID del campo',
              required_error: 'Debe ingresar el UUID del campo',
              invalid_type_error: 'Formato no válido',
            })
            .uuid('Debe ingresar un UUID válido'),

          type: zod
            .enum<string, [FormFieldType, ...FormFieldType[]]>(
              [
                'TEXT',
                'TEXTAREA',
                'NUMBER',

                'DNI',
                'PHONE',
                'EMAIL',

                'CHECKBOX',
                'SELECT',
                'RADIO',

                'TIME',
                'DATE',
                'DATETIME',

                'RATING',
                'NET_PROMOTER_SCORE',

                'SIGNATURE',

                'FILES',

                'USERS',

                'SECTION',
                'TABLE',
              ],
              {
                description: 'Tipo del campo',
                required_error: 'Debe seleccionar el tipo del campo',
                invalid_type_error: 'Formato no válido',
              }
            )
            .describe('Tipo del campo'),

          name: zod
            .string({
              description: 'Nombre del campo',
              required_error: 'Debe ingresar el nombre del campo',
              invalid_type_error: 'Formato no válido',
            })
            .min(1, 'Debe ingresar el nombre del campo'),

          description: zod
            .string({
              description: 'Descripción del campo',
              required_error: 'Debe ingresar la descripción del campo',
              invalid_type_error: 'Formato no válido',
            })
            .nullish(),
        },
        {
          description: 'Datos del campo asociado',
          required_error: 'Debe ingresar los datos del campo asociado',
          invalid_type_error: 'Formato no válido',
        }
      )
      .nullish(),
  },
  {
    description: 'Configuración del placeholder',
    required_error: 'Debe ingresar la configuración del placeholder',
    invalid_type_error: 'Formato no válido',
  }
);

export default signaturePlaceholderConfigSchema;
