import { useMemo } from 'react';
import { TextField } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { Form, TextAreaFormFieldConfig } from '@indocal/services';

export interface TextAreaFormFieldProps {
  field: Form['fields'][0];
}

export const TextAreaFormField: React.FC<TextAreaFormFieldProps> = ({
  field,
}) => {
  const {
    formState: { isSubmitting, errors },
    register,
  } = useFormContext();

  const config = useMemo<TextAreaFormFieldConfig | null>(
    () => field.config as TextAreaFormFieldConfig,
    [field.config]
  );

  return (
    <TextField
      multiline
      required={config?.required}
      label={field.title}
      disabled={isSubmitting}
      inputProps={register(field.id, {
        required: {
          value: Boolean(config?.required),
          message: 'Debe completar este campo',
        },

        ...(config?.minLength && {
          minLength: {
            value: config.minLength,
            message: `Debe ingresar un mínimo de ${config.minLength} caracteres`,
          },
        }),

        ...(config?.maxLength && {
          maxLength: {
            value: config.maxLength,
            message: `Debe ingresar un máximo de ${config.maxLength} caracteres`,
          },
        }),
      })}
      error={Boolean(errors[field.id])}
      helperText={errors[field.id]?.message as string}
    />
  );
};

export default TextAreaFormField;