import { useMemo } from 'react';
import { Box } from '@mui/material';
import { useFormContext, FieldErrors } from 'react-hook-form';

import { ControlledNetPromoterScore } from '@indocal/ui';
import {
  Form,
  SectionFormFieldItem,
  NetPromoterScoreFormFieldConfig,
} from '@indocal/services';

export interface NetPromoterScoreItemProps {
  field: Form['fields'][number];
  item: SectionFormFieldItem;
}

export const NetPromoterScoreItem: React.FC<NetPromoterScoreItemProps> = ({
  field,
  item,
}) => {
  const {
    formState: { isSubmitting, errors },
    control,
  } = useFormContext();

  const config = useMemo<NetPromoterScoreFormFieldConfig | null>(
    () => item.config as NetPromoterScoreFormFieldConfig,
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
      <ControlledNetPromoterScore
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

export default NetPromoterScoreItem;
