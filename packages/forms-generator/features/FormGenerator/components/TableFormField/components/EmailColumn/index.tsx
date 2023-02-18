import { TextField } from '@mui/material';
import { UseFormRegister, FieldValues, FieldErrors } from 'react-hook-form';

import {
  Form,
  TableFormFieldColumn,
  TableFormFieldColumnConfig,
} from '@indocal/services';

export interface EmailColumnProps {
  field: Form['fields'][number];
  column: TableFormFieldColumn;
  config: TableFormFieldColumnConfig | null;
  row: number;
  isSubmitting: boolean;
  errors: FieldErrors;
  register: UseFormRegister<FieldValues>;
}

export const EmailColumn: React.FC<EmailColumnProps> = ({
  field,
  column,
  config,
  row,
  isSubmitting,
  errors,
  register,
}) => (
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
        ((errors[field.id] as FieldErrors)[row] as FieldErrors)[column.heading]
    )}
    helperText={
      errors[field.id] &&
      (errors[field.id] as FieldErrors)[row] &&
      ((errors[field.id] as FieldErrors)[row] as FieldErrors)[column.heading] &&
      (((errors[field.id] as FieldErrors)[row] as FieldErrors)[column.heading]
        ?.message as string)
    }
    FormHelperTextProps={{ sx: { marginX: 0 } }}
  />
);

export default EmailColumn;
