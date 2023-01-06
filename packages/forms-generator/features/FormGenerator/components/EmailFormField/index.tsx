import { useMemo } from 'react';
import { TextField } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { Form, EmailFormFieldConfig } from '@indocal/services';

export interface EmailFormFieldProps {
  field: Form['fields'][number];
}

export const EmailFormField: React.FC<EmailFormFieldProps> = ({ field }) => {
  const {
    formState: { isSubmitting, errors },
    register,
  } = useFormContext();

  const config = useMemo<EmailFormFieldConfig | null>(
    () => field.config as EmailFormFieldConfig,
    [field.config]
  );

  return (
    <TextField
      type="email"
      required={config?.required}
      label={field.title}
      disabled={isSubmitting}
      inputProps={register(field.id, {
        required: {
          value: Boolean(config?.required),
          message: 'Debe completar este campo',
        },

        pattern: {
          value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          message: 'Debe ingresar un correo electrónico válido',
        },
      })}
      error={Boolean(errors[field.id])}
      helperText={errors[field.id]?.message as string}
    />
  );
};

export default EmailFormField;
