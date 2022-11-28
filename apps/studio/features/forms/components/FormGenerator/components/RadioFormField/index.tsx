import { useMemo } from 'react';
import { Box, FormControlLabel, Radio } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { ControlledRadioGroup } from '@indocal/ui';
import { Form, RadioFormFieldConfig } from '@indocal/services';

export interface RadioFormFieldProps {
  field: Form['fields'][0];
}

export const RadioFormField: React.FC<RadioFormFieldProps> = ({ field }) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  const config = useMemo<RadioFormFieldConfig | null>(
    () => field.config as RadioFormFieldConfig,
    [field.config]
  );

  return (
    <Box
      sx={{
        padding: (theme) => theme.spacing(1.5, 1.5, 0.5),
        borderRadius: (theme) => theme.spacing(0.5),
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <ControlledRadioGroup
        name={field.id}
        label={field.title}
        control={control}
        formControlProps={{
          required: config?.required,
          disabled: isSubmitting,
        }}
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
    </Box>
  );
};

export default RadioFormField;
