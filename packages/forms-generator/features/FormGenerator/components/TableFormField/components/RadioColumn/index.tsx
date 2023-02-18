import { FormControlLabel, Radio } from '@mui/material';
import { Control } from 'react-hook-form';

import { ControlledRadioGroup } from '@indocal/ui';
import {
  Form,
  TableFormFieldColumn,
  TableFormFieldColumnConfig,
  RadioFormFieldConfig,
} from '@indocal/services';

export interface RadioColumnProps {
  field: Form['fields'][number];
  column: TableFormFieldColumn;
  config: TableFormFieldColumnConfig | null;
  row: number;
  isSubmitting: boolean;
  control: Control;
}

export const RadioColumn: React.FC<RadioColumnProps> = ({
  field,
  column,
  config,
  row,
  isSubmitting,
  control,
}) => (
  <ControlledRadioGroup
    name={`${field.id}.${row}.${column.heading}`}
    control={control}
    formControlProps={{
      disabled: isSubmitting,
      required: config?.required,
    }}
    formHelperTextProps={{ sx: { marginX: 0 } }}
    radioGroupProps={{ row: true }}
    controllerProps={{
      rules: {
        required: {
          value: Boolean(config?.required),
          message: 'Debe completar este campo',
        },
      },
    }}
  >
    {(config as RadioFormFieldConfig | null)?.options.map((option) => (
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
