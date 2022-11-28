import { Control } from 'react-hook-form';

import { ControlledDniTextField } from '@indocal/ui';
import { Form, TableFormFieldColumn } from '@indocal/services';

export interface DniColumnProps {
  field: Form['fields'][0];
  column: TableFormFieldColumn;
  row: number;
  isSubmitting: boolean;
  control: Control;
}

export const DniColumn: React.FC<DniColumnProps> = ({
  field,
  column,
  row,
  isSubmitting,
  control,
}) => (
  <ControlledDniTextField
    name={`${field.id}.${row}.${column.heading}`}
    label={column.heading}
    control={control}
    textFieldProps={{
      size: 'small',
      required: field.config?.required,
      disabled: isSubmitting,
    }}
    controllerProps={{
      rules: {
        required: {
          value: Boolean(field.config?.required),
          message: 'Debe completar este campo',
        },

        minLength: {
          value: 13,
          message: 'Debe ingresar un número de cédula válido',
        },

        maxLength: {
          value: 13,
          message: 'Debe ingresar un número de cédula válido',
        },
      },
    }}
  />
);

export default DniColumn;
