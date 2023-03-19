import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { isValid } from 'date-fns';

import { ControlledTimePicker } from '@indocal/ui';
import { Form, TimeFormFieldConfig } from '@indocal/services';

export interface TimeFormFieldProps {
  field: Form['fields'][number];
}

export const TimeFormField: React.FC<TimeFormFieldProps> = ({ field }) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  const config = useMemo<TimeFormFieldConfig | null>(
    () => field.config as TimeFormFieldConfig,
    [field.config]
  );

  return (
    <ControlledTimePicker
      name={field.id}
      label={field.title}
      description={field.description}
      control={control}
      timePickerProps={{ disabled: isSubmitting }}
      textFieldProps={{ required: config?.required }}
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

export default TimeFormField;
