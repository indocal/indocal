import { useMemo } from 'react';
import { TextField } from '@mui/material';
import { useFormContext, FieldErrors } from 'react-hook-form';

import {
  Form,
  SectionFormFieldItem,
  EmailFormFieldConfig,
} from '@indocal/services';

export interface EmailItemProps {
  field: Form['fields'][number];
  item: SectionFormFieldItem;
}

export const EmailItem: React.FC<EmailItemProps> = ({ field, item }) => {
  const {
    formState: { isSubmitting, errors },
    register,
  } = useFormContext();

  const config = useMemo<EmailFormFieldConfig | null>(
    () => item.config as EmailFormFieldConfig,
    [item.config]
  );

  return (
    <TextField
      type="email"
      required={config?.required}
      fullWidth
      size="small"
      label={item.title}
      disabled={isSubmitting}
      inputProps={register(`${field.id}.${item.title}`, {
        required: {
          value: Boolean(config?.required),
          message: 'Debe aceptar este campo',
        },

        pattern: {
          value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          message: 'Debe ingresar un correo electrónico válido',
        },
      })}
      error={
        errors[field.id] &&
        Boolean((errors[field.id] as FieldErrors)[item.title])
      }
      helperText={
        errors[field.id] &&
        ((errors[field.id] as FieldErrors)[item.title]?.message as string)
      }
    />
  );
};

export default EmailItem;
