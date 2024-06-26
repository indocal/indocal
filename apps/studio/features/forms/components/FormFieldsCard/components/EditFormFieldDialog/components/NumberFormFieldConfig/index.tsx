import { Stack, Divider } from '@mui/material';
import { useFormContext, Control } from 'react-hook-form';

import { NumberField, ControlledCheckbox } from '@indocal/ui';

import { EditFormFieldDialogData } from '../../context';

export const NumberFormFieldConfig: React.FC = () => {
  const {
    formState: { isSubmitting, errors },
    register,
    control,
  } = useFormContext<EditFormFieldDialogData>();

  return (
    <Stack spacing={2} divider={<Divider flexItem />}>
      <ControlledCheckbox
        name="config.required"
        label="¿Campo requerido?"
        control={control as unknown as Control}
        formControlProps={{ disabled: isSubmitting }}
      />

      <Stack direction="row" spacing={2}>
        <NumberField
          fullWidth
          size="small"
          autoComplete="off"
          label="Valor mínimo"
          disabled={isSubmitting}
          inputProps={register('config.min', { valueAsNumber: true })}
          error={Boolean(errors.config?.min)}
          helperText={errors.config?.min?.message}
        />

        <NumberField
          fullWidth
          size="small"
          autoComplete="off"
          label="Valor máximo"
          disabled={isSubmitting}
          inputProps={register('config.max', { valueAsNumber: true })}
          error={Boolean(errors.config?.max)}
          helperText={errors.config?.max?.message}
        />
      </Stack>
    </Stack>
  );
};

export default NumberFormFieldConfig;
