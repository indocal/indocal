import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { isValid } from 'date-fns';

import { ControlledDateTimePicker } from '@indocal/ui';
import {
  Form,
  TableFormFieldColumn,
  DateTimeFormFieldConfig,
} from '@indocal/services';

export interface DateTimeColumnProps {
  field: Form['fields'][number];
  column: TableFormFieldColumn;
  row: number;
}

export const DateTimeColumn: React.FC<DateTimeColumnProps> = ({
  field,
  column,
  row,
}) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  const config = useMemo<DateTimeFormFieldConfig | null>(
    () => column.config as DateTimeFormFieldConfig,
    [column.config]
  );

  return (
    <ControlledDateTimePicker
      name={`${field.id}.${row}.${column.id}`}
      control={control}
      dateTimePickerProps={{ disabled: isSubmitting }}
      textFieldProps={{
        size: 'small',
        required: config?.required,
        FormHelperTextProps: { sx: { marginX: 0 } },
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

export default DateTimeColumn;
