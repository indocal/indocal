import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';
import { StandardPageSize } from '@react-pdf/types';

import { STANDARD_PAGE_SIZES } from '../../config';

export type DesignCertificateTemplateDialogData = Partial<{
  variables: string[];

  layout: Partial<{
    orientation: 'portrait' | 'landscape';
  }>;

  background: Partial<{
    include: boolean;
    image: File[];
  }>;

  qr: Partial<{
    include: boolean;
    size: number;
    position: Partial<{
      top: number;
      left: number;
      right: number;
      bottom: number;
    }>;
  }>;

  content: string;
}>;

export const DesignCertificateTemplateDialogProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const schema = zod.object(
    {
      variables: zod
        .string({
          description: 'Variables',
          required_error: 'Debe ingresar el nombre de la variable',
          invalid_type_error: 'Formato no válido',
        })
        .min(1, 'Debe ingresar el nombre de la variable')
        .array(),

      layout: zod
        .object(
          {
            orientation: zod.enum(['portrait', 'landscape'], {
              description: 'Orientación',
              required_error: 'Debe seleccionar una orientación',
              invalid_type_error: 'Formato no válido',
            }),

            size: zod.enum(STANDARD_PAGE_SIZES as [StandardPageSize], {
              description: 'Tamaño',
              required_error: 'Debe seleccionar un tamaño',
              invalid_type_error: 'Formato no válido',
            }),
          },
          {
            description: 'Disposición',
            required_error: 'Debe ingresar los datos de la disposición',
            invalid_type_error: 'Formato no válido',
          }
        )
        .partial(),

      background: zod
        .object(
          {
            include: zod.boolean({
              description: 'Incluir fondo',
              required_error: 'Debe indicar si desea incluir el fondo',
              invalid_type_error: 'Formato no válido',
            }),

            image: zod
              .instanceof(File, {
                message: 'Debe seleccionar el fondo a cargar',
              })
              .array()
              .max(1, 'Solo se permite cargar un archivo'),
          },
          {
            description: 'Fondo',
            required_error: 'Debe ingresar los datos del fondo',
            invalid_type_error: 'Formato no válido',
          }
        )
        .partial()
        .refine((data) => !data.include, {
          message: 'Debe seleccionar el fondo a cargar',
          path: ['image'],
        }),

      qr: zod
        .object(
          {
            include: zod.boolean({
              description: 'Incluir código QR',
              required_error: 'Debe indicar si desea incluir el código QR',
              invalid_type_error: 'Formato no válido',
            }),

            position: zod.object(
              {
                top: zod.number({
                  description: 'Posición superior',
                  required_error: 'Debe ingresar la posición superior',
                  invalid_type_error: 'Formato no válido',
                }),

                left: zod.number({
                  description: 'Posición izquierda',
                  required_error: 'Debe ingresar la posición izquierda',
                  invalid_type_error: 'Formato no válido',
                }),

                right: zod.number({
                  description: 'Posición derecha',
                  required_error: 'Debe ingresar la posición derecha',
                  invalid_type_error: 'Formato no válido',
                }),

                bottom: zod.number({
                  description: 'Posición inferior',
                  required_error: 'Debe ingresar la posición inferior',
                  invalid_type_error: 'Formato no válido',
                }),
              },
              {
                description: 'Posición del código QR',
                required_error: 'Debe ingresar la posición del código QR',
                invalid_type_error: 'Formato no válido',
              }
            ),
          },
          {
            description: 'Código QR',
            required_error: 'Debe ingresar los datos del código QR',
            invalid_type_error: 'Formato no válido',
          }
        )
        .partial()
        .refine((data) => !data.include, {
          message: 'Debe ingresar la posición del código QR',
          path: ['position'],
        }),

      content: zod
        .string({
          description: 'Contenido',
          required_error: 'Debe ingresar el contenido',
          invalid_type_error: 'Formato no válido',
        })
        .min(1, 'Debe ingresar el contenido'),
    },
    {
      description: 'Datos del certificado',
      required_error: 'Debe ingresar los datos del certificado',
      invalid_type_error: 'Formato no válido',
    }
  );

  const methods = useForm<DesignCertificateTemplateDialogData>({
    resolver: zodResolver(schema),
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

export default DesignCertificateTemplateDialogProvider;
