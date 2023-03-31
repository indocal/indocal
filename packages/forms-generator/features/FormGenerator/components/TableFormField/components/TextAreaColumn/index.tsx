import { useMemo } from 'react';
import { TextField } from '@mui/material';
import { useFormContext, FieldErrors } from 'react-hook-form';

import {
  Form,
  TableFormFieldColumn,
  TextAreaFormFieldConfig,
} from '@indocal/services';

export interface TextAreaColumnProps {
  field: Form['fields'][number];
  column: TableFormFieldColumn;
  row: number;
}

export const TextAreaColumn: React.FC<TextAreaColumnProps> = ({
  field,
  column,
  row,
}) => {
  const {
    formState: { isSubmitting, errors },
    register,
  } = useFormContext();

  const config = useMemo<TextAreaFormFieldConfig | null>(
    () => column.config as TextAreaFormFieldConfig,
    [column.config]
  );

  return (
    <TextField
      multiline
      required={config?.required}
      fullWidth
      size="small"
      placeholder="abc xyz ..."
      disabled={isSubmitting}
      inputProps={register(`${field.id}.${row}.${column.id}`, {
        required: {
          value: Boolean(config?.required),
          message: 'Debe completar este campo',
        },

        ...(typeof config?.minLength === 'number' &&
          !isNaN(config.minLength) && {
            minLength: {
              value: config.minLength,
              message: `Debe ingresar un mínimo de ${config.minLength} caracteres`,
            },
          }),

        ...(typeof config?.maxLength === 'number' &&
          !isNaN(config.maxLength) && {
            maxLength: {
              value: config.maxLength,
              message: `Debe ingresar un máximo de ${config.maxLength} caracteres`,
            },
          }),
      })}
      error={Boolean(
        errors[field.id] &&
          (errors[field.id] as FieldErrors)[row] &&
          ((errors[field.id] as FieldErrors)[row] as FieldErrors)[column.id]
      )}
      helperText={
        errors[field.id] &&
        (errors[field.id] as FieldErrors)[row] &&
        ((errors[field.id] as FieldErrors)[row] as FieldErrors)[column.id] &&
        (((errors[field.id] as FieldErrors)[row] as FieldErrors)[column.id]
          ?.message as string)
      }
      FormHelperTextProps={{ sx: { marginX: 0 } }}
    />
  );
};

export default TextAreaColumn;
