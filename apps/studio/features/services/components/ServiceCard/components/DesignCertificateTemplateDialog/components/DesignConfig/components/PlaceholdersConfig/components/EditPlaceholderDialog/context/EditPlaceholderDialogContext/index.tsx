import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import { ServiceCertificateTemplatePlaceholder } from '@indocal/services';

import {
  textPlaceholderConfigSchema,
  signaturePlaceholderConfigSchema,
  sectionPlaceholderConfigSchema,
  tablePlaceholderConfigSchema,
} from './schemas';

export type EditPlaceholderDialogData = zod.infer<typeof schema>;

const configSchema = zod.object({
  ...textPlaceholderConfigSchema.shape,
  ...signaturePlaceholderConfigSchema.shape,
  ...sectionPlaceholderConfigSchema.shape,
  ...tablePlaceholderConfigSchema.shape,
});

const schema = zod.object(
  {
    name: zod
      .string({
        description: 'Nombre del placeholder',
        required_error: 'Debe ingresar el nombre del placeholder',
        invalid_type_error: 'Formato no válido',
      })
      .min(1, 'Debe ingresar el nombre del placeholder'),

    title: zod
      .string({
        description: 'Título del placeholder',
        required_error: 'Debe ingresar el título del placeholder',
        invalid_type_error: 'Formato no válido',
      })
      .min(1, 'Debe ingresar el título del placeholder'),

    config: configSchema.partial().optional(),
  },
  {
    description: 'Placeholders del certificado',
    required_error: 'Debe ingresar los placeholders del certificado',
    invalid_type_error: 'Formato no válido',
  }
);

export interface EditPlaceholderDialogProviderProps {
  placeholder: ServiceCertificateTemplatePlaceholder;
}

export const EditPlaceholderDialogProvider: React.FC<
  React.PropsWithChildren<EditPlaceholderDialogProviderProps>
> = ({ placeholder, children }) => {
  const methods = useForm<EditPlaceholderDialogData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: placeholder.name,
      title: placeholder.title,
      ...(placeholder.config && { config: placeholder.config }),
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

export default EditPlaceholderDialogProvider;
