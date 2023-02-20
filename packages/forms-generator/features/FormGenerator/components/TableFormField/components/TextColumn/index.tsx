import { useMemo } from 'react';
import { TextField } from '@mui/material';
import { useFormContext, FieldErrors } from 'react-hook-form';

import {
  Form,
  TableFormFieldColumn,
  TextFormFieldConfig,
} from '@indocal/services';

export interface TextColumnProps {
  field: Form['fields'][number];
  column: TableFormFieldColumn;
  row: number;
}

export const TextColumn: React.FC<TextColumnProps> = ({
  field,
  column,
  row,
}) => {
  const {
    formState: { isSubmitting, errors },
    register,
  } = useFormContext();

  const config = useMemo<TextFormFieldConfig | null>(
    () => column.config as TextFormFieldConfig,
    [column.config]
  );

  return (
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

export default TextColumn;
