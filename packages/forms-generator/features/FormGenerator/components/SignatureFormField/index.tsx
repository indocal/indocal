import { useMemo } from 'react';
import { Stack } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { ControlledSignaturePad } from '@indocal/ui';
import { Form, SignatureFormFieldConfig } from '@indocal/services';

export interface SignatureFormFieldProps {
  field: Form['fields'][number];
}

export const SignatureFormField: React.FC<SignatureFormFieldProps> = ({
  field,
}) => {
  const {
    formState: { isSubmitting, errors },
    control,
  } = useFormContext();

  const config = useMemo<SignatureFormFieldConfig | null>(
    () => field.config as SignatureFormFieldConfig | null,
    [field.config]
  );

  return (
    <Stack
      sx={{
        display: 'grid',
        gap: (theme) => theme.spacing(1),
        padding: (theme) => theme.spacing(2),
        borderRadius: (theme) => theme.spacing(0.5),
        border: (theme) =>
          errors[field.id]
            ? `1px solid ${theme.palette.error.main}`
            : `1px solid ${theme.palette.divider}`,
      }}
    >
      <ControlledSignaturePad
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
              message: 'Debe completar este campo',
            },
          },
        }}
      />
    </Stack>
  );
};

export default SignatureFormField;
