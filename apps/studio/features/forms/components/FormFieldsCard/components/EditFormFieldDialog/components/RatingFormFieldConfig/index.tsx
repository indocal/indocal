import { Stack, Divider } from '@mui/material';
import { useFormContext, Control } from 'react-hook-form';

import { NumberTextField, ControlledCheckbox } from '@indocal/ui';

import { EditFormFieldDialogData } from '../../context';

export const RatingFormFieldConfig: React.FC = () => {
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

      <NumberTextField
        fullWidth
        size="small"
        autoComplete="off"
        label="Niveles de puntación"
        disabled={isSubmitting}
        defaultValue={5}
        inputProps={register('config.levels', { valueAsNumber: true })}
        error={Boolean(errors.config?.levels)}
        helperText={errors.config?.levels?.message}
      />
    </Stack>
  );
};

export default RatingFormFieldConfig;
