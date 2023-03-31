import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { isValid } from 'date-fns';

import { ControlledDateTimePicker } from '@indocal/ui';
import {
  Form,
  SectionFormFieldItem,
  DateTimeFormFieldConfig,
} from '@indocal/services';

export interface DateTimeItemProps {
  field: Form['fields'][number];
  item: SectionFormFieldItem;
}

export const DateTimeItem: React.FC<DateTimeItemProps> = ({ field, item }) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  const config = useMemo<DateTimeFormFieldConfig | null>(
    () => item.config as DateTimeFormFieldConfig,
    [item.config]
  );

  return (
    <ControlledDateTimePicker
      name={`${field.id}.${item.id}`}
      label={item.title}
      description={item.description}
      control={control}
      dateTimePickerProps={{ disabled: isSubmitting }}
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

export default DateTimeItem;
