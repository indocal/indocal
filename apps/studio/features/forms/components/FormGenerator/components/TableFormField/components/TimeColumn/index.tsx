import { Control } from 'react-hook-form';
import { isValid } from 'date-fns';

import { ControlledTimePicker } from '@indocal/ui';
import { Form, TableFormFieldColumn } from '@indocal/services';

export interface TimeColumnProps {
  field: Form['fields'][0];
  column: TableFormFieldColumn;
  row: number;
  isSubmitting: boolean;
  control: Control;
}

export const TimeColumn: React.FC<TimeColumnProps> = ({
  field,
  column,
  row,
  isSubmitting,
  control,
}) => (
  <ControlledTimePicker
    name={`${field.id}.${row}.${column.heading}`}
    label={column.heading}
    control={control}
    timePickerProps={{ disabled: isSubmitting }}
    textFieldProps={{ size: 'small', required: field.config?.required }}
    controllerProps={{
      rules: {
        required: {
          value: Boolean(field.config?.required),
          message: 'Debe completar este campo',
        },

        validate: (value) => value && (isValid(value) || 'Formato no válido'),
      },
    }}
  />
);

export default TimeColumn;