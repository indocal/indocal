import { Control } from 'react-hook-form';

import { ControlledDniTextField } from '@indocal/ui';
import {
  Form,
  TableFormFieldColumn,
  TableFormFieldColumnConfig,
} from '@indocal/services';

export interface DniColumnProps {
  field: Form['fields'][number];
  column: TableFormFieldColumn;
  config: TableFormFieldColumnConfig | null;
  row: number;
  isSubmitting: boolean;
  control: Control;
}

export const DniColumn: React.FC<DniColumnProps> = ({
  field,
  column,
  config,
  row,
  isSubmitting,
  control,
}) => (
  <ControlledDniTextField
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
