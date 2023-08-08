import { useMemo } from 'react';
import { Stack } from '@mui/material';
import { useFormContext, FieldErrors } from 'react-hook-form';

import { ControlledSignaturePad } from '@indocal/ui';
import {
  Form,
  SectionFormFieldItem,
  SignatureFormFieldConfig,
} from '@indocal/services';

export interface SignatureItemProps {
  field: Form['fields'][number];
  item: SectionFormFieldItem;
}

export const SignatureItem: React.FC<SignatureItemProps> = ({
  field,
  item,
}) => {
  const {
    formState: { isSubmitting, errors },
    control,
  } = useFormContext();

  const config = useMemo<SignatureFormFieldConfig | null>(
    () => item.config as SignatureFormFieldConfig | null,
    [item.config]
  );

  return (
    <Stack
      sx={{
        display: 'grid',
        gap: (theme) => theme.spacing(1),
        padding: (theme) => theme.spacing(1.5, 2),
        borderRadius: (theme) => theme.spacing(0.5),
        border: (theme) =>
          errors[field.id] && (errors[field.id] as FieldErrors)[item.id]
            ? `1px solid ${theme.palette.error.main}`
            : `1px solid ${theme.palette.divider}`,
      }}
    >
      <ControlledSignaturePad
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

export default SignatureItem;
