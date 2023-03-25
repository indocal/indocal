import { useMemo } from 'react';
import { Box } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { ControlledCheckbox } from '@indocal/ui';
import { Form, CheckboxFormFieldConfig } from '@indocal/services';

export interface CheckboxFormFieldProps {
  field: Form['fields'][number];
}

export const CheckboxFormField: React.FC<CheckboxFormFieldProps> = ({
  field,
}) => {
  const {
    formState: { isSubmitting, errors },
    control,
  } = useFormContext();

  const config = useMemo<CheckboxFormFieldConfig | null>(
    () => field.config as CheckboxFormFieldConfig,
    [field.config]
  );

  return (
    <Box
      sx={{
        padding: (theme) => theme.spacing(0.75, 1.5, 0.25),
        borderRadius: (theme) => theme.spacing(0.5),
        border: (theme) =>
          errors[field.id]
            ? `1px solid ${theme.palette.error.main}`
            : `1px solid ${theme.palette.divider}`,

        ...((errors[field.id] || field.description) && {
          paddingBottom: (theme) => theme.spacing(1.5),
        }),
      }}
    >
      <ControlledCheckbox
        name={field.id}
        label={field.title}
        description={field.description}
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

export default CheckboxFormField;
