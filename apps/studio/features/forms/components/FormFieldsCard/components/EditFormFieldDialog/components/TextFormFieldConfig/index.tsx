import { Stack, Divider, TextField } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { ControlledCheckbox } from '@indocal/ui';

import { EditFormFieldDialogData } from '../../context';

export const TextFormFieldConfig: React.FC = () => {
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
        control={control}
        formControlProps={{ disabled: isSubmitting }}
      />

      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          size="small"
          type="number"
          autoComplete="off"
          label="Caracteres mínimos"
          disabled={isSubmitting}
          inputProps={register('config.minLength', { valueAsNumber: true })}
          error={Boolean(errors.config?.minLength)}
          helperText={errors.config?.minLength?.message}
        />

        <TextField
          fullWidth
          size="small"
          type="number"
          autoComplete="off"
          label="Caracteres máximos"
          disabled={isSubmitting}
          inputProps={register('config.maxLength', { valueAsNumber: true })}
          error={Boolean(errors.config?.maxLength)}
          helperText={errors.config?.maxLength?.message}
        />
      </Stack>
    </Stack>
  );
};

export default TextFormFieldConfig;
