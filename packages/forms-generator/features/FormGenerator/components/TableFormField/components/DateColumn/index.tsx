import { Control } from 'react-hook-form';
import { isValid } from 'date-fns';

import { ControlledDatePicker } from '@indocal/ui';
import {
  Form,
  TableFormFieldColumn,
  TableFormFieldColumnConfig,
} from '@indocal/services';

export interface DateColumnProps {
  field: Form['fields'][number];
  column: TableFormFieldColumn;
  config: TableFormFieldColumnConfig | null;
  row: number;
  isSubmitting: boolean;
  control: Control;
}

export const DateColumn: React.FC<DateColumnProps> = ({
  field,
  column,
  config,
  row,
  isSubmitting,
  control,
}) => (
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
          message: 'Debe aceptar este campo',
        },

        validate: (value) => value && (isValid(value) || 'Formato no válido'),
      },
    }}
  />
);

export default DateColumn;
