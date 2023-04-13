import { useMemo } from 'react';
import { useFormContext, FieldErrors } from 'react-hook-form';

import { NumberTextField } from '@indocal/ui';
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
    <NumberTextField
      required={config?.required}
      fullWidth
      size="small"
      label={item.title}
      disabled={isSubmitting}
      inputProps={register(`${field.id}.${item.id}`, {
        valueAsNumber: true,

        required: {
          value: Boolean(config?.required),
          message: 'Debe completar este campo',
        },

        ...(typeof config?.min === 'number' &&
          !isNaN(config.min) && {
            min: {
              value: config.min,
              message: `Debe ingresar un valor mayor o igual a ${config.min}`,
            },
          }),

        ...(typeof config?.max === 'number' &&
          !isNaN(config.max) && {
            max: {
              value: config.max,
              message: `Debe ingresar un valor menor o igual a ${config.max}`,
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

export default NumberItem;
