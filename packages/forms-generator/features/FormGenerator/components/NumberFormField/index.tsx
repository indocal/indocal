import { useMemo } from 'react';
import { TextField } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { Form, NumberFormFieldConfig } from '@indocal/services';

export interface NumberFormFieldProps {
  field: Form['fields'][number];
}

export const NumberFormField: React.FC<NumberFormFieldProps> = ({ field }) => {
  const {
    formState: { isSubmitting, errors },
    register,
  } = useFormContext();

  const config = useMemo<NumberFormFieldConfig | null>(
    () => field.config as NumberFormFieldConfig,
    [field.config]
  );

  return (
    <TextField
      type="number"
      required={config?.required}
      label={field.title}
      disabled={isSubmitting}
      inputProps={register(field.id, {
        valueAsNumber: true,

        required: {
          value: Boolean(config?.required),
          message: 'Debe completar este campo',
        },

        ...(typeof config?.min === 'number' &&
          !isNaN(config.min) && {
            min: {
              value: config.min,
              message: `Debe ingresar un valor mayor o igual a ${config.min}`,
            },
          }),

        ...(typeof config?.max === 'number' &&
          !isNaN(config.max) && {
            max: {
              value: config.max,
              message: `Debe ingresar un valor menor o igual a ${config.max}`,
            },
          }),
      })}
      error={Boolean(errors[field.id])}
      helperText={(errors[field.id]?.message as string) || field.description}
    />
  );
};

export default NumberFormField;
