import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { ControlledDniTextField } from '@indocal/ui';
import { Form, DniFormFieldConfig } from '@indocal/services';

export interface DniFormFieldProps {
  field: Form['fields'][number];
}

export const DniFormField: React.FC<DniFormFieldProps> = ({ field }) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  const config = useMemo<DniFormFieldConfig | null>(
    () => field.config as DniFormFieldConfig,
    [field.config]
  );

  return (
    <ControlledDniTextField
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
            value: 13,
            message: 'Debe ingresar un número de cédula válido',
          },

          maxLength: {
            value: 13,
            message: 'Debe ingresar un número de cédula válido',
          },
        },
      }}
    />
  );
};

export default DniFormField;
