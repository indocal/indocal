import { useMemo } from 'react';
import { FormControlLabel, Radio } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { ControlledRadioGroup } from '@indocal/ui';
import {
  Form,
  TableFormFieldColumn,
  RadioFormFieldConfig,
} from '@indocal/services';

export interface RadioColumnProps {
  field: Form['fields'][number];
  column: TableFormFieldColumn;
  row: number;
}

export const RadioColumn: React.FC<RadioColumnProps> = ({
  field,
  column,
  row,
}) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  const config = useMemo<RadioFormFieldConfig | null>(
    () => column.config as RadioFormFieldConfig | null,
    [column.config]
  );

  return (
    <ControlledRadioGroup
      name={`${field.id}.${row}.${column.id}`}
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
      {config?.options.map((option) => (
        <FormControlLabel
          key={option}
          value={option}
          label={option}
          control={<Radio />}
        />
      ))}
    </ControlledRadioGroup>
  );
};

export default RadioColumn;
