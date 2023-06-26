import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import {
  CertificateTemplateLayout,
  CertificateTemplateLayoutOrientation,
  CertificateTemplateLayoutPlaceholder,
} from '../../types';

export type DesignCertificateTemplateDialogData = {
  layout: CertificateTemplateLayout;
  content: string;
  styles: string;
  placeholders: CertificateTemplateLayoutPlaceholder[];
};

export const DesignCertificateTemplateDialogProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const schema = zod.object(
    {
      layout: zod.object(
        {
          orientation: zod.enum(
            [
              CertificateTemplateLayoutOrientation.PORTRAIT,
              CertificateTemplateLayoutOrientation.LANDSCAPE,
            ],
            {
              description: 'Orientación del certificado',
              required_error: 'Debe ingresar la orientación del certificado',
              invalid_type_error: 'Formato no válido',
            }
          ),
        },
        {
          description: 'Diseño del certificado',
          required_error: 'Debe ingresar el diseño del certificado',
          invalid_type_error: 'Formato no válido',
        }
      ),

      content: zod
        .string({
          description: 'Contenido del certificado',
          required_error: 'Debe ingresar el contenido del certificado',
          invalid_type_error: 'Formato no válido',
        })
        .min(1, 'Debe ingresar el contenido del certificado'),

      styles: zod
        .string({
          description: 'Estilos del certificado',
          required_error: 'Debe ingresar los estilos del certificado',
          invalid_type_error: 'Formato no válido',
        })
        .min(1, 'Debe ingresar los estilos del certificado'),

      placeholders: zod
        .object(
          {
            name: zod
              .string({
                description: 'Nombre del placeholder',
                required_error: 'Debe ingresar el nombre del placeholder',
                invalid_type_error: 'Formato no válido',
              })
              .min(1, 'Debe ingresar el nombre del placeholder'),
          },
          {
            description: 'Placeholders del certificado',
            required_error: 'Debe ingresar los placeholders del certificado',
            invalid_type_error: 'Formato no válido',
          }
        )
        .array(),
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
