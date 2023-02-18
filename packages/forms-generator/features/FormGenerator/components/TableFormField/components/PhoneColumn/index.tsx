import { Control } from 'react-hook-form';

import { ControlledPhoneTextField } from '@indocal/ui';
import {
  Form,
  TableFormFieldColumn,
  TableFormFieldColumnConfig,
} from '@indocal/services';

export interface PhoneColumnProps {
  field: Form['fields'][number];
  column: TableFormFieldColumn;
  config: TableFormFieldColumnConfig | null;
  row: number;
  isSubmitting: boolean;
  control: Control;
}

export const PhoneColumn: React.FC<PhoneColumnProps> = ({
  field,
  column,
  config,
  row,
  isSubmitting,
  control,
}) => (
  <ControlledPhoneTextField
    name={`${field.id}.${row}.${column.heading}`}
    control={control}
    textFieldProps={{
      size: 'small',

      disabled: isSubmitting,
      required: config?.required,
      FormHelperTextProps: { sx: { marginX: 0 } },
    }}
    controllerProps={{
      rules: {
        required: {
          value: Boolean(config?.required),
          message: 'Debe completar este campo',
        },

        minLength: {
          value: 14,
          message: 'Debe ingresar un número de teléfono válido',
        },

        maxLength: {
          value: 14,
          message: 'Debe ingresar un número de teléfono válido',
        },
      },
    }}
  />
);

export default PhoneColumn;
