import { useMemo } from 'react';
import { TextField } from '@mui/material';
import { useFormContext, FieldErrors } from 'react-hook-form';

import {
  Form,
  SectionFormFieldItem,
  TextFormFieldConfig,
} from '@indocal/services';

export interface TextItemProps {
  field: Form['fields'][number];
  item: SectionFormFieldItem;
}

export const TextItem: React.FC<TextItemProps> = ({ field, item }) => {
  const {
    formState: { isSubmitting, errors },
    register,
  } = useFormContext();

  const config = useMemo<TextFormFieldConfig | null>(
    () => item.config as TextFormFieldConfig | null,
    [item.config]
  );

  return (
    <TextField
      required={config?.required}
      fullWidth
      size="small"
      label={item.title}
      disabled={isSubmitting}
      inputProps={register(`${field.id}.${item.id}`, {
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
      error={
        errors[field.id] && Boolean((errors[field.id] as FieldErrors)[item.id])
      }
      helperText={
        (errors[field.id] &&
          ((errors[field.id] as FieldErrors)[item.id]?.message as string)) ||
        item.description
      }
    />
  );
};

export default TextItem;
