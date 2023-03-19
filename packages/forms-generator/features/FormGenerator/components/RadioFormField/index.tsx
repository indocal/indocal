import { useMemo } from 'react';
import { Box, FormControlLabel, Radio } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { ControlledRadioGroup } from '@indocal/ui';
import { Form, RadioFormFieldConfig } from '@indocal/services';

export interface RadioFormFieldProps {
  field: Form['fields'][number];
}

export const RadioFormField: React.FC<RadioFormFieldProps> = ({ field }) => {
  const {
    formState: { isSubmitting, errors },
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
        border: (theme) =>
          errors[field.id]
            ? `1px solid ${theme.palette.error.main}`
            : `1px solid ${theme.palette.divider}`,

        ...((errors[field.id] || field.description) && {
          paddingBottom: (theme) => theme.spacing(1.5),
        }),
      }}
    >
      <ControlledRadioGroup
        name={field.id}
        label={field.title}
        description={field.description}
        control={control}
        formControlProps={{
          required: config?.required,
          disabled: isSubmitting,
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
        {config?.options?.map((option) => (
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
