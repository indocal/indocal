import { z as zod } from 'zod';

import { TableFormFieldColumnType } from '@indocal/services';

import commonFormFieldConfigSchema from './commonFormFieldConfigSchema';
import textFormFieldConfigSchema from './textFormFieldConfigSchema';
import textAreaFormFieldConfigSchema from './textAreaFormFieldConfigSchema';
import numberFormFieldConfigSchema from './numberFormFieldConfigSchema';
import dniFormFieldConfigSchema from './dniFormFieldConfigSchema';
import phoneFormFieldConfigSchema from './phoneFormFieldConfigSchema';
import emailFormFieldConfigSchema from './emailFormFieldConfigSchema';
import checkboxFormFieldConfigSchema from './checkboxFormFieldConfigSchema';
import selectFormFieldConfigSchema from './selectFormFieldConfigSchema';
import radioFormFieldConfigSchema from './radioFormFieldConfigSchema';
import timeFormFieldConfigSchema from './timeFormFieldConfigSchema';
import dateFormFieldConfigSchema from './dateFormFieldConfigSchema';
import dateTimeFormFieldConfigSchema from './dateTimeFormFieldConfigSchema';
import filesFormFieldConfigSchema from './filesFormFieldConfigSchema';
import usersFormFieldConfigSchema from './usersFormFieldConfigSchema';

const columnConfigSchema = zod.object({
  ...commonFormFieldConfigSchema.shape,
  ...textFormFieldConfigSchema.shape,
  ...textAreaFormFieldConfigSchema.shape,
  ...numberFormFieldConfigSchema.shape,
  ...dniFormFieldConfigSchema.shape,
  ...phoneFormFieldConfigSchema.shape,
  ...emailFormFieldConfigSchema.shape,
  ...checkboxFormFieldConfigSchema.shape,
  ...selectFormFieldConfigSchema.shape,
  ...radioFormFieldConfigSchema.shape,
  ...timeFormFieldConfigSchema.shape,
  ...dateFormFieldConfigSchema.shape,
  ...dateTimeFormFieldConfigSchema.shape,
  ...filesFormFieldConfigSchema.shape,
  ...usersFormFieldConfigSchema.shape,
});

const columnSchema = zod.object({
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

        'FILES',

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
    .min(1, 'Debe ingresar el encabezado')
    .trim(),

  config: columnConfigSchema.partial().nullish(),
});

export const tableFormFieldConfigSchema = zod.object({
  minRows: zod
    .number({
      description: 'Filas mínimas',
      required_error: 'Debe indicar los filas mínimas',
      invalid_type_error: 'Formato no válido',
    })
    .or(
      zod.nan({
        description: 'Filas mínimas',
        required_error: 'Debe indicar los filas mínimas',
        invalid_type_error: 'Formato no válido',
      })
    )
    .nullable(),

  maxRows: zod
    .number({
      description: 'Filas máximas',
      required_error: 'Debe indicar los filas máximas',
      invalid_type_error: 'Formato no válido',
    })
    .or(
      zod.nan({
        description: 'Filas máximas',
        required_error: 'Debe indicar los filas máximas',
        invalid_type_error: 'Formato no válido',
      })
    )
    .nullable(),

  columns: columnSchema.array().min(1, 'Debe definir al menos una columna'),
});

export default tableFormFieldConfigSchema;
