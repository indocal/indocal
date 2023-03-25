import { useMemo } from 'react';
import { MenuItem } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { ControlledSelect } from '@indocal/ui';
import {
  Form,
  SectionFormFieldItem,
  SelectFormFieldConfig,
} from '@indocal/services';

export interface SelectItemProps {
  field: Form['fields'][number];
  item: SectionFormFieldItem;
}

export const SelectItem: React.FC<SelectItemProps> = ({ field, item }) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  const config = useMemo<SelectFormFieldConfig | null>(
    () => item.config as SelectFormFieldConfig,
    [item.config]
  );

  return (
    <ControlledSelect
      name={`${field.id}.${item.title}`}
      label={item.title}
      description={item.description}
      control={control}
      formControlProps={{
        size: 'small',
        required: config?.required,
        disabled: isSubmitting,
      }}
      formHelperTextProps={{
        sx: {
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        },
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

export default SelectItem;
