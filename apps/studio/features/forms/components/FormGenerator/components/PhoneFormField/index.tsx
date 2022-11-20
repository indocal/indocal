import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { ControlledPhoneTextField } from '@indocal/ui';
import { Form, PhoneFormFieldConfig } from '@indocal/services';

export interface PhoneFormFieldProps {
  field: Form['fields'][0];
}

export const PhoneFormField: React.FC<PhoneFormFieldProps> = ({ field }) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  const config = useMemo<PhoneFormFieldConfig | null>(
    () => field.config as PhoneFormFieldConfig,
    [field.config]
  );

  return (
    <ControlledPhoneTextField
      name={field.id}
      label={field.title}
      control={control}
      textFieldProps={{
        required: config?.required,
        disabled: isSubmitting,
      }}
      controllerProps={{
        rules: {
          required: {
            value: Boolean(config?.required),
            message: 'Debe completar este campo',
          },

          minLength: {
            value: 14,
            message: 'Debe ingresar un número de teléfono válido',
          },

          maxLength: {
            value: 14,
            message: 'Debe ingresar un número de teléfono válido',
          },
        },
      }}
    />
  );
};

export default PhoneFormField;
