import { useMemo } from 'react';
import { TextField } from '@mui/material';
import { useFormContext, FieldErrors } from 'react-hook-form';

import {
  Form,
  SectionFormFieldItem,
  NumberFormFieldConfig,
} from '@indocal/services';

export interface NumberItemProps {
  field: Form['fields'][number];
  item: SectionFormFieldItem;
}

export const NumberItem: React.FC<NumberItemProps> = ({ field, item }) => {
  const {
    formState: { isSubmitting, errors },
    register,
  } = useFormContext();

  const config = useMemo<NumberFormFieldConfig | null>(
    () => item.config as NumberFormFieldConfig,
    [item.config]
  );

  return (
    <TextField
      type="number"
      required={config?.required}
      fullWidth
      size="small"
      label={item.title}
      disabled={isSubmitting}
      inputProps={register(`${field.id}.${item.title}`, {
        valueAsNumber: true,

        required: {
          value: Boolean(config?.required),
          message: 'Debe aceptar este campo',
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

export default NumberItem;