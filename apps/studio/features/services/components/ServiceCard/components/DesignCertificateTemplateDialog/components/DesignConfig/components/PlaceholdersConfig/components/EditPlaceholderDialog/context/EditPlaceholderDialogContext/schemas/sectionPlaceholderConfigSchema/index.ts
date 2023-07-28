import { z as zod } from 'zod';

import { ServiceCertificateTemplateSectionPlaceholderItemType } from '@indocal/services';

const itemSchema = zod.object(
  {
    type: zod.enum(
      [
        ServiceCertificateTemplateSectionPlaceholderItemType.TEXT,
        ServiceCertificateTemplateSectionPlaceholderItemType.SIGNATURE,
      ],
      {
        description: 'Tipo del campo',
        required_error: 'Debe ingresar el tipo del campo',
        invalid_type_error: 'Formato no válido',
      }
    ),

    name: zod
      .string({
        description: 'Nombre del campo',
        required_error: 'Debe ingresar el nombre del campo',
        invalid_type_error: 'Formato no válido',
      })
      .min(1, 'Debe ingresar el nombre del campo'),

    title: zod
      .string({
        description: 'Título del campo',
        required_error: 'Debe ingresar el título del campo',
        invalid_type_error: 'Formato no válido',
      })
      .min(1, 'Debe ingresar el título del campo'),
  },
  {
    description: 'Datos del campo',
    required_error: 'Debe ingresar los datos del campo',
    invalid_type_error: 'Formato no válido',
  }
);

export const sectionPlaceholderConfigSchema = zod.object(
  {
    items: itemSchema.array(),
  },
  {
    description: 'Configuración del placeholder',
    required_error: 'Debe ingresar la configuración del placeholder',
    invalid_type_error: 'Formato no válido',
  }
);

export default sectionPlaceholderConfigSchema;
