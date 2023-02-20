import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { isValid } from 'date-fns';

import { ControlledDatePicker } from '@indocal/ui';
import {
  Form,
  TableFormFieldColumn,
  DateFormFieldConfig,
} from '@indocal/services';

export interface DateColumnProps {
  field: Form['fields'][number];
  column: TableFormFieldColumn;
  row: number;
}

export const DateColumn: React.FC<DateColumnProps> = ({
  field,
  column,
  row,
}) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  const config = useMemo<DateFormFieldConfig | null>(
    () => column.config as DateFormFieldConfig,
    [column.config]
  );

  return (
    <ControlledDatePicker
      name={`${field.id}.${row}.${column.heading}`}
      control={control}
      datePickerProps={{ disabled: isSubmitting }}
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

export default DateColumn;
