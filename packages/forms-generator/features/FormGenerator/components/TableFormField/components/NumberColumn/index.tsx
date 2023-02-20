import { useMemo } from 'react';
import { TextField } from '@mui/material';
import { useFormContext, FieldErrors } from 'react-hook-form';

import {
  Form,
  TableFormFieldColumn,
  NumberFormFieldConfig,
} from '@indocal/services';

export interface NumberColumnProps {
  field: Form['fields'][number];
  column: TableFormFieldColumn;
  row: number;
}

export const NumberColumn: React.FC<NumberColumnProps> = ({
  field,
  column,

  row,
}) => {
  const {
    formState: { isSubmitting, errors },
    register,
  } = useFormContext();

  const config = useMemo<NumberFormFieldConfig | null>(
    () => column.config as NumberFormFieldConfig,
    [column.config]
  );

  return (
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
          message: 'Debe completar este campo',
        },

        ...(config?.min && {
          min: {
            value: config.min,
            message: `Debe ingresar un valor mayor o igual a ${config.min}`,
          },
        }),

        ...(config?.max && {
          max: {
            value: config.max,
            message: `Debe ingresar un valor menor o igual a ${config.max}`,
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

export default NumberColumn;
