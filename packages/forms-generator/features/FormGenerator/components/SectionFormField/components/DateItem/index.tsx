import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { isValid } from 'date-fns';

import { ControlledDatePicker } from '@indocal/ui';
import {
  Form,
  SectionFormFieldItem,
  DateFormFieldConfig,
} from '@indocal/services';

export interface DateItemProps {
  field: Form['fields'][number];
  item: SectionFormFieldItem;
}

export const DateItem: React.FC<DateItemProps> = ({ field, item }) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  const config = useMemo<DateFormFieldConfig | null>(
    () => item.config as DateFormFieldConfig | null,
    [item.config]
  );

  return (
    <ControlledDatePicker
      name={`${field.id}.${item.id}`}
      label={item.title}
      description={item.description}
      control={control}
      datePickerProps={{ disabled: isSubmitting }}
      textFieldProps={{
        size: 'small',
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

export default DateItem;
