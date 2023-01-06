import { TextField } from '@mui/material';
import { UseFormRegister, FieldValues, FieldErrors } from 'react-hook-form';

import {
  Form,
  TableFormFieldColumn,
  TableFormFieldColumnConfig,
  TextAreaFormFieldConfig,
} from '@indocal/services';

export interface TextAreaColumnProps {
  field: Form['fields'][number];
  column: TableFormFieldColumn;
  config: TableFormFieldColumnConfig | null;
  row: number;
  isSubmitting: boolean;
  errors: FieldErrors;
  register: UseFormRegister<FieldValues>;
}

export const TextAreaColumn: React.FC<TextAreaColumnProps> = ({
  field,
  column,
  config,
  row,
  isSubmitting,
  errors,
  register,
}) => (
  <TextField
    multiline
    required={config?.required}
    fullWidth
    size="small"
    placeholder="abc xyz ..."
    disabled={isSubmitting}
    inputProps={register(`${field.id}.${row}.${column.heading}`, {
      required: {
        value: Boolean(config?.required),
        message: 'Debe completar este campo',
      },

      ...((config as TextAreaFormFieldConfig)?.minLength && {
        minLength: {
          value: (config as TextAreaFormFieldConfig).minLength,
          message: `Debe ingresar un mínimo de ${
            (config as TextAreaFormFieldConfig).minLength
          } caracteres`,
        },
      }),

      ...((config as TextAreaFormFieldConfig)?.maxLength && {
        maxLength: {
          value: (config as TextAreaFormFieldConfig).maxLength,
          message: `Debe ingresar un máximo de ${
            (config as TextAreaFormFieldConfig).maxLength
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

export default TextAreaColumn;
