import { useMemo } from 'react';
import { Box } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { ControlledNetPromoterScore } from '@indocal/ui';
import { Form, NetPromoterScoreFormFieldConfig } from '@indocal/services';

export interface NetPromoterScoreFormFieldProps {
  field: Form['fields'][number];
}

export const NetPromoterScoreFormField: React.FC<
  NetPromoterScoreFormFieldProps
> = ({ field }) => {
  const {
    formState: { isSubmitting, errors },
    control,
  } = useFormContext();

  const config = useMemo<NetPromoterScoreFormFieldConfig | null>(
    () => field.config as NetPromoterScoreFormFieldConfig | null,
    [field.config]
  );

  return (
    <Box
      sx={{
        padding: (theme) => theme.spacing(1.5, 1.5, 0.5),
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
      <ControlledNetPromoterScore
        name={field.id}
        label={field.title}
        description={field.description}
        control={control}
        formControlProps={{
          required: config?.required,
          disabled: isSubmitting,
        }}
        formHelperTextProps={{
          sx: {
            marginX: 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          },
        }}
        toggleButtonGroupProps={{ sx: { flexWrap: 'wrap' } }}
        controllerProps={{
          rules: {
            required: {
              value: Boolean(config?.required),
              message: 'Debe completar este campo',
            },
          },
        }}
      />
    </Box>
  );
};

export default NetPromoterScoreFormField;
