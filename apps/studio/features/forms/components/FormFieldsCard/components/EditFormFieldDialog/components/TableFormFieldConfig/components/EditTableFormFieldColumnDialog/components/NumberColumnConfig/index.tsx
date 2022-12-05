import { Stack, Divider, TextField } from '@mui/material';
import { useFormContext, Control } from 'react-hook-form';

import { ControlledCheckbox } from '@indocal/ui';

import { EditFormFieldDialogData } from '../../../../../../context';

export interface NumberColumnConfigProps {
  column: number;
}

export const NumberColumnConfig: React.FC<NumberColumnConfigProps> = ({
  column,
}) => {
  const {
    formState: { isSubmitting, errors },
    register,
    control,
  } = useFormContext<EditFormFieldDialogData>();

  return (
    <Stack spacing={2} divider={<Divider flexItem />}>
      <ControlledCheckbox
        name={`config.columns.${column}.config.required`}
        label="¿Campo requerido?"
        control={control as unknown as Control}
        formControlProps={{ disabled: isSubmitting }}
      />

      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          size="small"
          type="number"
          autoComplete="off"
          label="Valor mínimo"
          disabled={isSubmitting}
          inputProps={register(`config.columns.${column}.config.min`, {
            valueAsNumber: true,
          })}
          error={
            errors.config?.columns &&
            errors.config.columns[column] &&
            Boolean(errors.config.columns[column]?.config?.min)
          }
          helperText={
            errors.config?.columns &&
            errors.config.columns[column] &&
            errors.config.columns[column]?.config?.min?.message
          }
        />

        <TextField
          fullWidth
          size="small"
          type="number"
          autoComplete="off"
          label="Valor máximo"
          disabled={isSubmitting}
          inputProps={register(`config.columns.${column}.config.max`, {
            valueAsNumber: true,
          })}
          error={
            errors.config?.columns &&
            errors.config.columns[column] &&
            Boolean(errors.config.columns[column]?.config?.max)
          }
          helperText={
            errors.config?.columns &&
            errors.config.columns[column] &&
            errors.config.columns[column]?.config?.max?.message
          }
        />
      </Stack>
    </Stack>
  );
};

export default NumberColumnConfig;
