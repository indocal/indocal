import { Control } from 'react-hook-form';
import { isValid } from 'date-fns';

import { ControlledTimePicker } from '@indocal/ui';
import {
  Form,
  TableFormFieldColumn,
  TableFormFieldColumnConfig,
} from '@indocal/services';

export interface TimeColumnProps {
  field: Form['fields'][number];
  column: TableFormFieldColumn;
  config: TableFormFieldColumnConfig | null;
  row: number;
  isSubmitting: boolean;
  control: Control;
}

export const TimeColumn: React.FC<TimeColumnProps> = ({
  field,
  column,
  config,
  row,
  isSubmitting,
  control,
}) => (
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

export default TimeColumn;
