import { Control } from 'react-hook-form';

import { ControlledCheckbox } from '@indocal/ui';
import {
  Form,
  TableFormFieldColumn,
  TableFormFieldColumnConfig,
} from '@indocal/services';

export interface CheckboxColumnProps {
  field: Form['fields'][number];
  column: TableFormFieldColumn;
  config: TableFormFieldColumnConfig | null;
  row: number;
  isSubmitting: boolean;
  control: Control;
}

export const CheckboxColumn: React.FC<CheckboxColumnProps> = ({
  field,
  column,
  config,
  row,
  isSubmitting,
  control,
}) => (
  <ControlledCheckbox
    name={`${field.id}.${row}.${column.heading}`}
    control={control}
    formControlProps={{
      disabled: isSubmitting,
      required: config?.required,
    }}
    formHelperTextProps={{ sx: { marginTop: '2px', marginX: 0 } }}
    controllerProps={{
      rules: {
        required: {
          value: Boolean(config?.required),
          message: 'Debe aceptar este campo',
        },
      },
    }}
  />
);

export default CheckboxColumn;
