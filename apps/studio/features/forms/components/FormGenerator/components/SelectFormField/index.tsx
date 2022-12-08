import { useMemo } from 'react';
import { MenuItem } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { ControlledSelect } from '@indocal/ui';
import { Form, SelectFormFieldConfig } from '@indocal/services';

export interface SelectFormFieldProps {
  field: Form['fields'][number];
}

export const SelectFormField: React.FC<SelectFormFieldProps> = ({ field }) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  const config = useMemo<SelectFormFieldConfig | null>(
    () => field.config as SelectFormFieldConfig,
    [field.config]
  );

  return (
    <ControlledSelect
      name={field.id}
      label={field.title}
      control={control}
      formControlProps={{
        required: config?.required,
        disabled: isSubmitting,
      }}
      selectProps={{ multiple: config?.multiple }}
      controllerProps={{
        defaultValue: config?.multiple ? [] : '',
        rules: {
          required: {
            value: Boolean(config?.required),
            message: 'Debe completar este campo',
          },
        },
      }}
    >
      {!config?.multiple && <MenuItem value="">--</MenuItem>}

      {config?.options?.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </ControlledSelect>
  );
};

export default SelectFormField;
