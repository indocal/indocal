import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { isValid } from 'date-fns';

import { ControlledTimePicker } from '@indocal/ui';
import {
  Form,
  SectionFormFieldItem,
  TimeFormFieldConfig,
} from '@indocal/services';

export interface TimeItemProps {
  field: Form['fields'][number];
  item: SectionFormFieldItem;
}

export const TimeItem: React.FC<TimeItemProps> = ({ field, item }) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  const config = useMemo<TimeFormFieldConfig | null>(
    () => item.config as TimeFormFieldConfig,
    [item.config]
  );

  return (
    <ControlledTimePicker
      name={`${field.id}.${item.title}`}
      label={item.title}
      control={control}
      timePickerProps={{ disabled: isSubmitting }}
      textFieldProps={{
        size: 'small',
        required: config?.required,
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

export default TimeItem;
