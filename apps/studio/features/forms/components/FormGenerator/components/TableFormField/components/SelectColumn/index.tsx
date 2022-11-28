import { MenuItem } from '@mui/material';
import { Control } from 'react-hook-form';

import { ControlledSelect } from '@indocal/ui';
import { Form, TableFormFieldColumn } from '@indocal/services';

export interface SelectColumnProps {
  field: Form['fields'][0];
  column: TableFormFieldColumn;
  row: number;
  isSubmitting: boolean;
  control: Control;
}

export const SelectColumn: React.FC<SelectColumnProps> = ({
  field,
  column,
  row,
  isSubmitting,
  control,
}) => (
  <ControlledSelect
    name={`${field.id}.${row}.${column.heading}`}
    control={control}
    formControlProps={{
      fullWidth: true,
      required: field.config?.required,
      disabled: isSubmitting,
    }}
    formHelperTextProps={{ sx: { marginX: 0 } }}
    selectProps={{
      size: 'small',
      displayEmpty: true,
      multiple: field.config?.multiple,
    }}
    controllerProps={{
      defaultValue: field.config?.multiple ? [] : '',
      rules: {
        required: {
          value: Boolean(field.config?.required),
          message: 'Debe completar este campo',
        },
      },
    }}
  >
    <MenuItem value={field.config?.multiple ? [] : ''}>
      <em>{field.config?.multiple ? 'Opciones' : 'Opción'}</em>
    </MenuItem>

    {['Opción 1', 'Opción 2', 'Opción 3'].map((option) => (
      <MenuItem key={option} value={option}>
        {option}
      </MenuItem>
    ))}
  </ControlledSelect>
);

export default SelectColumn;
