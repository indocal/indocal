import { MenuItem } from '@mui/material';
import { Control } from 'react-hook-form';

import { ControlledSelect } from '@indocal/ui';
import {
  Form,
  TableFormFieldColumn,
  TableFormFieldColumnConfig,
  SelectFormFieldConfig,
} from '@indocal/services';

export interface SelectColumnProps {
  field: Form['fields'][number];
  column: TableFormFieldColumn;
  config: TableFormFieldColumnConfig | null;
  row: number;
  isSubmitting: boolean;
  control: Control;
}

export const SelectColumn: React.FC<SelectColumnProps> = ({
  field,
  column,
  config,
  row,
  isSubmitting,
  control,
}) => (
  <ControlledSelect
    name={`${field.id}.${row}.${column.heading}`}
    control={control}
    formControlProps={{
      fullWidth: true,
      required: config?.required,
      disabled: isSubmitting,
    }}
    formHelperTextProps={{ sx: { marginX: 0 } }}
    selectProps={{
      size: 'small',
      displayEmpty: true,
      multiple: (config as SelectFormFieldConfig)?.multiple,
    }}
    controllerProps={{
      defaultValue: (config as SelectFormFieldConfig)?.multiple ? [] : '',
      rules: {
        required: {
          value: Boolean(config?.required),
          message: 'Debe completar este campo',
        },
      },
    }}
  >
    <MenuItem value={(config as SelectFormFieldConfig)?.multiple ? [] : ''}>
      <em>{column.heading}</em>
    </MenuItem>

    {(config as SelectFormFieldConfig)?.options.map((option) => (
      <MenuItem key={option} value={option}>
        {option}
      </MenuItem>
    ))}
  </ControlledSelect>
);

export default SelectColumn;
