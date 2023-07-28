import { FormProvider, useForm, FieldValues } from 'react-hook-form';

import { ServiceCertificateData } from '@indocal/services';

export interface GenerateCertificateDialogProviderProps {
  defaultValues?: ServiceCertificateData;
}

export const GenerateCertificateDialogProvider: React.FC<
  React.PropsWithChildren<GenerateCertificateDialogProviderProps>
> = ({ defaultValues, children }) => {
  const methods = useForm({ defaultValues: defaultValues as FieldValues });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

export default GenerateCertificateDialogProvider;
