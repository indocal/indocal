import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { isValid } from 'date-fns';

import { ControlledDateTimePicker } from '@indocal/ui';
import { Form, DateTimeFormFieldConfig } from '@indocal/services';

export interface DateTimeFormFieldProps {
  field: Form['fields'][number];
}

export const DateTimeFormField: React.FC<DateTimeFormFieldProps> = ({
  field,
}) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  const config = useMemo<DateTimeFormFieldConfig | null>(
    () => field.config as DateTimeFormFieldConfig | null,
    [field.config]
  );

  return (
    <ControlledDateTimePicker
      name={field.id}
      label={field.title}
      description={field.description}
      control={control}
      dateTimePickerProps={{ disabled: isSubmitting }}
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

export default DateTimeFormField;
