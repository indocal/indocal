import { useMemo } from 'react';
import { Box } from '@mui/material';
import { useFormContext, FieldErrors } from 'react-hook-form';

import { ControlledRating } from '@indocal/ui';
import {
  Form,
  SectionFormFieldItem,
  RatingFormFieldConfig,
} from '@indocal/services';

export interface RatingItemProps {
  field: Form['fields'][number];
  item: SectionFormFieldItem;
}

export const RatingItem: React.FC<RatingItemProps> = ({ field, item }) => {
  const {
    formState: { isSubmitting, errors },
    control,
  } = useFormContext();

  const config = useMemo<RatingFormFieldConfig | null>(
    () => item.config as RatingFormFieldConfig,
    [item.config]
  );

  return (
    <Box
      sx={{
        padding: (theme) => theme.spacing(1, 1.5, 0.25),
        borderRadius: (theme) => theme.spacing(0.5),
        border: (theme) =>
          errors[field.id] && (errors[field.id] as FieldErrors)[item.title]
            ? `1px solid ${theme.palette.error.main}`
            : `1px solid ${theme.palette.divider}`,

        ...(((errors[field.id] &&
          (errors[field.id] as FieldErrors)[item.title]) ||
          item.description) && {
          paddingBottom: (theme) => theme.spacing(1.25),
        }),
      }}
    >
      <ControlledRating
        name={`${field.id}.${item.title}`}
        label={item.title}
        description={item.description}
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

export default RatingItem;
