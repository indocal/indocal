import { TextField } from '@mui/material';
import { UseFormRegister, FieldValues, FieldErrors } from 'react-hook-form';

import { Form, TableFormFieldColumn } from '@indocal/services';

export interface NumberColumnProps {
  field: Form['fields'][0];
  column: TableFormFieldColumn;
  row: number;
  isSubmitting: boolean;
  errors: FieldErrors;
  register: UseFormRegister<FieldValues>;
}

export const NumberColumn: React.FC<NumberColumnProps> = ({
  field,
  column,
  row,
  isSubmitting,
  errors,
  register,
}) => (
  <TextField
    type="number"
    required={field.config?.required}
    fullWidth
    size="small"
    placeholder="#"
    disabled={isSubmitting}
    inputProps={register(`${field.id}.${row}.${column.heading}`, {
      valueAsNumber: true,

      required: {
        value: Boolean(field.config?.required),
        message: 'Debe completar este campo',
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

export default NumberColumn;
