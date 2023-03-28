import { useMemo } from 'react';
import { Box } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { ControlledRating } from '@indocal/ui';
import { Form, RatingFormFieldConfig } from '@indocal/services';

export interface RatingFormFieldProps {
  field: Form['fields'][number];
}

export const RatingFormField: React.FC<RatingFormFieldProps> = ({ field }) => {
  const {
    formState: { isSubmitting, errors },
    control,
  } = useFormContext();

  const config = useMemo<RatingFormFieldConfig | null>(
    () => field.config as RatingFormFieldConfig,
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
      <ControlledRating
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
        ratingProps={{ size: 'large', max: config?.levels }}
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

export default RatingFormField;
