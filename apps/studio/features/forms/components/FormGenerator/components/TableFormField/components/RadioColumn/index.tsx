import { FormControlLabel, Radio } from '@mui/material';
import { Control } from 'react-hook-form';

import { ControlledRadioGroup } from '@indocal/ui';
import { Form, TableFormFieldColumn } from '@indocal/services';

export interface RadioColumnProps {
  field: Form['fields'][number];
  column: TableFormFieldColumn;
  row: number;
  isSubmitting: boolean;
  control: Control;
}

export const RadioColumn: React.FC<RadioColumnProps> = ({
  field,
  column,
  row,
  isSubmitting,
  control,
}) => (
  <ControlledRadioGroup
    name={`${field.id}.${row}.${column.heading}`}
    control={control}
    formControlProps={{
      required: field.config?.required,
      disabled: isSubmitting,
    }}
    formHelperTextProps={{ sx: { marginX: 0 } }}
    controllerProps={{
      rules: {
        required: {
          value: Boolean(field.config?.required),
          message: 'Debe completar este campo',
        },
      },
    }}
  >
    {['Opción 1', 'Opción 2', 'Opción 3'].map((option) => (
      <FormControlLabel
        key={option}
        value={option}
        label={option}
        control={<Radio />}
      />
    ))}
  </ControlledRadioGroup>
);

export default RadioColumn;
