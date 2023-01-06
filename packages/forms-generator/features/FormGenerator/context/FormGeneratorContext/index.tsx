import { FormProvider, useForm } from 'react-hook-form';

export const FormGeneratorProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const methods = useForm();

  return <FormProvider {...methods}>{children}</FormProvider>;
};

export default FormGeneratorProvider;
