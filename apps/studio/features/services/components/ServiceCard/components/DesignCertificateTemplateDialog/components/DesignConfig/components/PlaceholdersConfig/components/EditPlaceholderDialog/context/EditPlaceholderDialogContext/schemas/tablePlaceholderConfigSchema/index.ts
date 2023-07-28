import { z as zod } from 'zod';

import { ServiceCertificateTemplateTablePlaceholderColumnType } from '@indocal/services';

const column = zod.object(
  {
    type: zod.enum(
      [
        ServiceCertificateTemplateTablePlaceholderColumnType.TEXT,
        ServiceCertificateTemplateTablePlaceholderColumnType.SIGNATURE,
      ],
      {
        description: 'Tipo de la columna',
        required_error: 'Debe ingresar el tipo de la columna',
        invalid_type_error: 'Formato no válido',
      }
    ),

    name: zod
      .string({
        description: 'Nombre de la columna',
        required_error: 'Debe ingresar el nombre de la columna',
        invalid_type_error: 'Formato no válido',
      })
      .min(1, 'Debe ingresar el nombre de la columna'),

    heading: zod
      .string({
        description: 'Encabezado de la columna',
        required_error: 'Debe ingresar el encabezado de la columna',
        invalid_type_error: 'Formato no válido',
      })
      .min(1, 'Debe ingresar el encabezado de la columna'),
  },
  {
    description: 'Datos de la columna',
    required_error: 'Debe ingresar los datos de la columna',
    invalid_type_error: 'Formato no válido',
  }
);

export const tablePlaceholderConfigSchema = zod.object(
  {
    columns: column.array(),
  },
  {
    description: 'Configuración del placeholder',
    required_error: 'Debe ingresar la configuración del placeholder',
    invalid_type_error: 'Formato no válido',
  }
);

export default tablePlaceholderConfigSchema;
