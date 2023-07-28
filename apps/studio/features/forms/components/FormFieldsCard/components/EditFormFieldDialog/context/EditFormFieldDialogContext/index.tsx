import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import { Form } from '@indocal/services';

import {
  commonFormFieldConfigSchema,
  textFormFieldConfigSchema,
  textAreaFormFieldConfigSchema,
  numberFormFieldConfigSchema,
  dniFormFieldConfigSchema,
  phoneFormFieldConfigSchema,
  emailFormFieldConfigSchema,
  checkboxFormFieldConfigSchema,
  selectFormFieldConfigSchema,
  radioFormFieldConfigSchema,
  timeFormFieldConfigSchema,
  dateFormFieldConfigSchema,
  dateTimeFormFieldConfigSchema,
  ratingFormFieldConfigSchema,
  netPromoterScoreFormFieldConfigSchema,
  signatureFormFieldConfigSchema,
  filesFormFieldConfigSchema,
  usersFormFieldConfigSchema,
  sectionFormFieldConfigSchema,
  tableFormFieldConfigSchema,
} from './schemas';

export type EditFormFieldDialogData = zod.infer<typeof schema>;

const configSchema = zod.object({
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
  ...ratingFormFieldConfigSchema.shape,
  ...netPromoterScoreFormFieldConfigSchema.shape,
  ...signatureFormFieldConfigSchema.shape,
  ...filesFormFieldConfigSchema.shape,
  ...usersFormFieldConfigSchema.shape,
  ...sectionFormFieldConfigSchema.shape,
  ...tableFormFieldConfigSchema.shape,
});

const schema = zod.object(
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
      .nullish(),

    config: configSchema.partial().optional(),
  },
  {
    description: 'Datos del campo',
    required_error: 'Debe ingresar los datos del campo',
    invalid_type_error: 'Formato no válido',
  }
);

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
