import { TextField } from '@mui/material';
import { UseFormRegister, FieldValues, FieldErrors } from 'react-hook-form';

import {
  Form,
  TableFormFieldColumn,
  TableFormFieldColumnConfig,
  NumberFormFieldConfig,
} from '@indocal/services';

export interface NumberColumnProps {
  field: Form['fields'][number];
  column: TableFormFieldColumn;
  config: TableFormFieldColumnConfig | null;
  row: number;
  isSubmitting: boolean;
  errors: FieldErrors;
  register: UseFormRegister<FieldValues>;
}

export const NumberColumn: React.FC<NumberColumnProps> = ({
  field,
  column,
  config,
  row,
  isSubmitting,
  errors,
  register,
}) => (
  <TextField
    type="number"
    required={config?.required}
    fullWidth
    size="small"
    placeholder="#"
    disabled={isSubmitting}
    inputProps={register(`${field.id}.${row}.${column.heading}`, {
      valueAsNumber: true,

      required: {
        value: Boolean(config?.required),
        message: 'Debe aceptar este campo',
      },

      ...((config as NumberFormFieldConfig)?.min && {
        min: {
          value: (config as NumberFormFieldConfig).min,
          message: `Debe ingresar un valor mayor o igual a ${
            (config as NumberFormFieldConfig).min
          }`,
        },
      }),

      ...((config as NumberFormFieldConfig)?.max && {
        max: {
          value: (config as NumberFormFieldConfig).max,
          message: `Debe ingresar un valor menor o igual a ${
            (config as NumberFormFieldConfig).max
          }`,
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

export default NumberColumn;
