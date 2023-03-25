import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { isValid } from 'date-fns';

import { ControlledDatePicker } from '@indocal/ui';
import { Form, DateFormFieldConfig } from '@indocal/services';

export interface DateFormFieldProps {
  field: Form['fields'][number];
}

export const DateFormField: React.FC<DateFormFieldProps> = ({ field }) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  const config = useMemo<DateFormFieldConfig | null>(
    () => field.config as DateFormFieldConfig,
    [field.config]
  );

  return (
    <ControlledDatePicker
      name={field.id}
      label={field.title}
      description={field.description}
      control={control}
      datePickerProps={{ disabled: isSubmitting }}
      textFieldProps={{
        required: config?.required,
        FormHelperTextProps: {
          sx: {
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          },
        },
      }}
      controllerProps={{
        rules: {
          required: {
            value: Boolean(config?.required),
            message: 'Debe completar este campo',
          },

          validate: (value) => value && (isValid(value) || 'Formato no válido'),
        },
      }}
    />
  );
};

export default DateFormField;
