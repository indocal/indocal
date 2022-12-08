import { z as zod } from 'zod';

import { SectionFormFieldItemType } from '@indocal/services';

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
import usersFormFieldConfigSchema from './usersFormFieldConfigSchema';

const itemConfigSchema = zod.object({
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
  ...usersFormFieldConfigSchema.shape,
});

const itemSchema = zod.object({
  type: zod
    .enum<string, [SectionFormFieldItemType, ...SectionFormFieldItemType[]]>(
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
        description: 'Tipo del campo',
        required_error: 'Debe seleccionar el tipo',
        invalid_type_error: 'Formato no válido',
      }
    )
    .describe('Tipo del campo'),

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
    .nullish(),

  config: itemConfigSchema.partial().nullish(),
});

export const sectionFormFieldConfigSchema = zod.object({
  items: itemSchema.array().min(1, 'Debe definir al menos un campo'),
});

export default sectionFormFieldConfigSchema;
