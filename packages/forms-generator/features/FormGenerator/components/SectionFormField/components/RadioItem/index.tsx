import { useMemo } from 'react';
import { Box, FormControlLabel, Radio } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { ControlledRadioGroup } from '@indocal/ui';
import {
  Form,
  SectionFormFieldItem,
  RadioFormFieldConfig,
} from '@indocal/services';

export interface RadioItemProps {
  field: Form['fields'][number];
  item: SectionFormFieldItem;
}

export const RadioItem: React.FC<RadioItemProps> = ({ field, item }) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  const config = useMemo<RadioFormFieldConfig | null>(
    () => item.config as RadioFormFieldConfig,
    [item.config]
  );

  return (
    <Box
      sx={{
        padding: (theme) => theme.spacing(1, 1.5, 0.25),
        borderRadius: (theme) => theme.spacing(0.5),
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <ControlledRadioGroup
        name={`${field.id}.${item.title}`}
        label={item.title}
        control={control}
        formControlProps={{
          required: config?.required,
          disabled: isSubmitting,
        }}
        radioGroupProps={{ row: true }}
        controllerProps={{
          rules: {
            required: {
              value: Boolean(config?.required),
              message: 'Debe completar este campo',
            },
          },
        }}
      >
        {config?.options?.map((option) => (
          <FormControlLabel
            key={option}
            value={option}
            label={option}
            control={<Radio size="small" />}
          />
        ))}
      </ControlledRadioGroup>
    </Box>
  );
};

export default RadioItem;
