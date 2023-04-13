import { Stack, Divider } from '@mui/material';
import { useFormContext, Control } from 'react-hook-form';

import { NumberField, ControlledCheckbox } from '@indocal/ui';

import { EditFormFieldDialogData } from '../../context';

export const TextAreaFormFieldConfig: React.FC = () => {
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
          label="Caracteres mínimos"
          disabled={isSubmitting}
          inputProps={register('config.minLength', { valueAsNumber: true })}
          error={Boolean(errors.config?.minLength)}
          helperText={errors.config?.minLength?.message}
        />

        <NumberField
          fullWidth
          size="small"
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

export default TextAreaFormFieldConfig;
