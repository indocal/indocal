import { Control } from 'react-hook-form';

import { ControlledPhoneTextField } from '@indocal/ui';
import { Form, TableFormFieldColumn } from '@indocal/services';

export interface PhoneColumnProps {
  field: Form['fields'][number];
  column: TableFormFieldColumn;
  row: number;
  isSubmitting: boolean;
  control: Control;
}

export const PhoneColumn: React.FC<PhoneColumnProps> = ({
  field,
  column,
  row,
  isSubmitting,
  control,
}) => (
  <ControlledPhoneTextField
    name={`${field.id}.${row}.${column.heading}`}
    control={control}
    textFieldProps={{
      size: 'small',
      required: field.config?.required,
      disabled: isSubmitting,
      FormHelperTextProps: { sx: { marginX: 0 } },
    }}
    controllerProps={{
      rules: {
        required: {
          value: Boolean(field.config?.required),
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
