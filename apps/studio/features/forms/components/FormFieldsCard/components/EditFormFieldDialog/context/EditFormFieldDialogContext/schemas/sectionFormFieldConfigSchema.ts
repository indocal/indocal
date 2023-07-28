import { z as zod } from 'zod';

import { SectionFormFieldItemType } from '@indocal/services';

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
import ratingFormFieldConfigSchema from './ratingFormFieldConfigSchema';
import netPromoterScoreFormFieldConfigSchema from './netPromoterScoreFormFieldConfigSchema';
import signatureFormFieldConfigSchema from './signatureFormFieldConfigSchema';
import filesFormFieldConfigSchema from './filesFormFieldConfigSchema';
import usersFormFieldConfigSchema from './usersFormFieldConfigSchema';

const commonItemConfigSchema = zod.object({
  required: zod.boolean({
    description: '¿Campo requerido?',
    required_error: 'Debe indicar si el campo es requerido o no',
    invalid_type_error: 'Formato no válido',
  }),

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

const itemConfigSchema = zod.object({
  ...commonItemConfigSchema.shape,
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
  ...ratingFormFieldConfigSchema.shape,
  ...netPromoterScoreFormFieldConfigSchema.shape,
  ...signatureFormFieldConfigSchema.shape,
  ...filesFormFieldConfigSchema.shape,
  ...usersFormFieldConfigSchema.shape,
});

const itemSchema = zod.object({
  id: zod
    .string({
      description: 'ID del campo',
      required_error: 'Debe ingresar el ID del campo',
      invalid_type_error: 'Formato no válido',
    })
    .uuid('Debe ingresar un UUID válido'),

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

        'RATING',
        'NET_PROMOTER_SCORE',

        'SIGNATURE',

        'FILES',

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
