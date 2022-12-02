import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import {
  Form,
  TableFormFieldColumn,
  TableFormFieldColumnType,
} from '@indocal/services';

export type EditFormFieldDialogData = zod.infer<typeof schema>;

const tableFormFieldColumnSchema: zod.ZodSchema<TableFormFieldColumn> =
  zod.object({
    type: zod
      .enum<string, [TableFormFieldColumnType, ...TableFormFieldColumnType[]]>(
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

          'USERS',
        ],
        {
          description: 'Tipo de la columna',
          required_error: 'Debe seleccionar el tipo',
          invalid_type_error: 'Formato no válido',
        }
      )
      .describe('Tipo de la columna'),

    heading: zod
      .string({
        description: 'Encabezado de la columna',
        required_error: 'Debe ingresar el encabezado',
        invalid_type_error: 'Formato no válido',
      })
      .min(1, 'Debe ingresar el encabezado'),

    config: zod
      .object({
        required: zod.boolean({
          description: '¿Campo requerido?',
          required_error: 'Debe indicar si el campo es requerido o no',
          invalid_type_error: 'Formato no válido',
        }),

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
      })
      .partial(),
  });

const schema = zod
  .object(
    {
      title: zod
        .string({
          description: 'Título del campo',
          required_error: 'Debe ingresar el título del campo',
          invalid_type_error: 'Formato no válido',
        })
        .min(1, 'Debe ingresar el título del campo')
        .trim(),

      description: zod
        .string({
          description: 'Descripción del campo',
          required_error: 'Debe ingresar la descripción del campo',
          invalid_type_error: 'Formato no válido',
        })
        .trim()
        .nullable(),

      config: zod
        .object(
          {
            required: zod.boolean({
              description: '¿Campo requerido?',
              required_error: 'Debe indicar si el campo es requerido o no',
              invalid_type_error: 'Formato no válido',
            }),

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

            minLength: zod
              .number({
                description: 'Caracteres o filas mínimas',
                required_error: 'Debe indicar los caracteres o filas mínimas',
                invalid_type_error: 'Formato no válido',
              })
              .or(
                zod.nan({
                  description: 'Caracteres o filas mínimas',
                  required_error: 'Debe indicar los caracteres o filas mínimas',
                  invalid_type_error: 'Formato no válido',
                })
              )
              .nullable(),

            maxLength: zod
              .number({
                description: 'Caracteres o filas máximas',
                required_error: 'Debe indicar los caracteres o filas máximas',
                invalid_type_error: 'Formato no válido',
              })
              .or(
                zod.nan({
                  description: 'Caracteres o filas máximas',
                  required_error: 'Debe indicar los caracteres o filas máximas',
                  invalid_type_error: 'Formato no válido',
                })
              )
              .nullable(),

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

            columns: tableFormFieldColumnSchema
              .array()
              .min(1, 'Debe definir al menos una columna'),
          },
          {
            description: 'Configuración del campo',
            required_error: 'Debe ingresar la configuración del campo',
            invalid_type_error: 'Formato no válido',
          }
        )
        .partial(),
    },
    {
      description: 'Datos del campo',
      required_error: 'Debe ingresar los datos del campo',
      invalid_type_error: 'Formato no válido',
    }
  )
  .partial();

export interface EditFormFieldDialogProviderProps {
  field: Form['fields'][number];
}

export const EditFormFieldDialogProvider: React.FC<
  React.PropsWithChildren<EditFormFieldDialogProviderProps>
> = ({ field, children }) => {
  const methods = useForm<EditFormFieldDialogData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: field.title,
      description: field.description,
      ...(field.config && { config: field.config }),
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

export default EditFormFieldDialogProvider;
