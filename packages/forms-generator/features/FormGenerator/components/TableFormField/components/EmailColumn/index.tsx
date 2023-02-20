import { useMemo } from 'react';
import { TextField } from '@mui/material';
import { useFormContext, FieldErrors } from 'react-hook-form';

import {
  Form,
  TableFormFieldColumn,
  EmailFormFieldConfig,
} from '@indocal/services';

export interface EmailColumnProps {
  field: Form['fields'][number];
  column: TableFormFieldColumn;
  row: number;
}

export const EmailColumn: React.FC<EmailColumnProps> = ({
  field,
  column,

  row,
}) => {
  const {
    formState: { isSubmitting, errors },
    register,
  } = useFormContext();

  const config = useMemo<EmailFormFieldConfig | null>(
    () => column.config as EmailFormFieldConfig,
    [column.config]
  );

  return (
    <TextField
      type="email"
      required={config?.required}
      fullWidth
      size="small"
      placeholder="example@domain.com"
      disabled={isSubmitting}
      inputProps={register(`${field.id}.${row}.${column.heading}`, {
        required: {
          value: Boolean(config?.required),
          message: 'Debe completar este campo',
        },

        pattern: {
          value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          message: 'Debe ingresar un correo electrónico válido',
        },
      })}
      error={Boolean(
        errors[field.id] &&
          (errors[field.id] as FieldErrors)[row] &&
          ((errors[field.id] as FieldErrors)[row] as FieldErrors)[
            column.heading
          ]
      )}
      helperText={
        errors[field.id] &&
        (errors[field.id] as FieldErrors)[row] &&
        ((errors[field.id] as FieldErrors)[row] as FieldErrors)[
          column.heading
        ] &&
        (((errors[field.id] as FieldErrors)[row] as FieldErrors)[column.heading]
          ?.message as string)
      }
      FormHelperTextProps={{ sx: { marginX: 0 } }}
    />
  );
};

export default EmailColumn;
