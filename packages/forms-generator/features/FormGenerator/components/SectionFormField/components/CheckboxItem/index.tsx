import { useMemo } from 'react';
import { Box } from '@mui/material';
import { useFormContext, FieldErrors } from 'react-hook-form';

import { ControlledCheckbox } from '@indocal/ui';
import {
  Form,
  SectionFormFieldItem,
  CheckboxFormFieldConfig,
} from '@indocal/services';

export interface CheckboxItemProps {
  field: Form['fields'][number];
  item: SectionFormFieldItem;
}

export const CheckboxItem: React.FC<CheckboxItemProps> = ({ field, item }) => {
  const {
    formState: { isSubmitting, errors },
    control,
  } = useFormContext();

  const config = useMemo<CheckboxFormFieldConfig | null>(
    () => item.config as CheckboxFormFieldConfig,
    [item.config]
  );

  return (
    <Box
      sx={{
        padding: (theme) => theme.spacing(0.5, 1.5, 0.125),
        borderRadius: (theme) => theme.spacing(0.5),
        border: (theme) =>
          errors[field.id] && (errors[field.id] as FieldErrors)[item.id]
            ? `1px solid ${theme.palette.error.main}`
            : `1px solid ${theme.palette.divider}`,

        ...(((errors[field.id] && (errors[field.id] as FieldErrors)[item.id]) ||
          item.description) && {
          paddingBottom: (theme) => theme.spacing(1.25),
        }),
      }}
    >
      <ControlledCheckbox
        name={`${field.id}.${item.id}`}
        label={item.title}
        description={item.description}
        control={control}
        formControlProps={{
          disabled: isSubmitting,
          required: config?.required,
        }}
        formHelperTextProps={{
          sx: {
            marginX: 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          },
        }}
        checkboxProps={{ size: 'small' }}
        controllerProps={{
          rules: {
            required: {
              value: Boolean(config?.required),
              message: 'Debe aceptar este campo',
            },
          },
        }}
      />
    </Box>
  );
};

export default CheckboxItem;
