import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { isValid } from 'date-fns';

import { ControlledTimePicker } from '@indocal/ui';
import {
  Form,
  TableFormFieldColumn,
  TimeFormFieldConfig,
} from '@indocal/services';

export interface TimeColumnProps {
  field: Form['fields'][number];
  column: TableFormFieldColumn;
  row: number;
}

export const TimeColumn: React.FC<TimeColumnProps> = ({
  field,
  column,
  row,
}) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  const config = useMemo<TimeFormFieldConfig | null>(
    () => column.config as TimeFormFieldConfig,
    [column.config]
  );

  return (
    <ControlledTimePicker
      name={`${field.id}.${row}.${column.heading}`}
      control={control}
      timePickerProps={{ disabled: isSubmitting }}
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

export default TimeColumn;
