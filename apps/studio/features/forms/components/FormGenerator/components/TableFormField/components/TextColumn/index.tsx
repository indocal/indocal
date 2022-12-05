import { TextField } from '@mui/material';
import { UseFormRegister, FieldValues, FieldErrors } from 'react-hook-form';

import {
  Form,
  TableFormFieldColumn,
  TableFormFieldColumnConfig,
  TextFormFieldConfig,
} from '@indocal/services';

export interface TextColumnProps {
  field: Form['fields'][number];
  column: TableFormFieldColumn;
  config: TableFormFieldColumnConfig | null;
  row: number;
  isSubmitting: boolean;
  errors: FieldErrors;
  register: UseFormRegister<FieldValues>;
}

export const TextColumn: React.FC<TextColumnProps> = ({
  field,
  column,
  config,
  row,
  isSubmitting,
  errors,
  register,
}) => (
  <TextField
    required={config?.required}
    fullWidth
    size="small"
    placeholder="abc"
    disabled={isSubmitting}
    inputProps={register(`${field.id}.${row}.${column.heading}`, {
      required: {
        value: Boolean(config?.required),
        message: 'Debe completar este campo',
      },

      ...((config as TextFormFieldConfig)?.minLength && {
        minLength: {
          value: (config as TextFormFieldConfig).minLength,
          message: `Debe ingresar un mínimo de ${
            (config as TextFormFieldConfig).minLength
          } caracteres`,
        },
      }),

      ...((config as TextFormFieldConfig)?.maxLength && {
        maxLength: {
          value: (config as TextFormFieldConfig).maxLength,
          message: `Debe ingresar un máximo de ${
            (config as TextFormFieldConfig).maxLength
          } caracteres`,
        },
      }),
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

export default TextColumn;
