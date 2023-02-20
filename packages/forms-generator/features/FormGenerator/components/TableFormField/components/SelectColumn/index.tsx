import { useMemo } from 'react';
import { MenuItem } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { ControlledSelect } from '@indocal/ui';
import {
  Form,
  TableFormFieldColumn,
  SelectFormFieldConfig,
} from '@indocal/services';

export interface SelectColumnProps {
  field: Form['fields'][number];
  column: TableFormFieldColumn;
  row: number;
}

export const SelectColumn: React.FC<SelectColumnProps> = ({
  field,
  column,
  row,
}) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  const config = useMemo<SelectFormFieldConfig | null>(
    () => column.config as SelectFormFieldConfig,
    [column.config]
  );

  return (
    <ControlledSelect
      name={`${field.id}.${row}.${column.heading}`}
      control={control}
      formControlProps={{
        fullWidth: true,

        disabled: isSubmitting,
        required: config?.required,
      }}
      formHelperTextProps={{ sx: { marginX: 0 } }}
      selectProps={{
        size: 'small',
        displayEmpty: true,
        multiple: config?.multiple,
        sx: { textAlign: 'start' },
      }}
      controllerProps={{
        defaultValue: config?.multiple ? [] : '',
        rules: {
          required: {
            value: Boolean(config?.required),
            message: 'Debe completar este campo',
          },
        },
      }}
    >
      <MenuItem value={config?.multiple ? [] : ''}>
        <em>{column.heading}</em>
      </MenuItem>

      {config?.options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </ControlledSelect>
  );
};

export default SelectColumn;
