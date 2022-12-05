import { Stack, Divider, TextField } from '@mui/material';
import { useFormContext, Control } from 'react-hook-form';

import { ControlledCheckbox } from '@indocal/ui';

import { EditFormFieldDialogData } from '../../../../../../context';

export interface TextAreaColumnConfigProps {
  column: number;
}

export const TextAreaColumnConfig: React.FC<TextAreaColumnConfigProps> = ({
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
          label="Caracteres mínimos"
          disabled={isSubmitting}
          inputProps={register(`config.columns.${column}.config.minLength`, {
            valueAsNumber: true,
          })}
          error={
            errors.config?.columns &&
            errors.config.columns[column] &&
            Boolean(errors.config.columns[column]?.config?.minLength)
          }
          helperText={
            errors.config?.columns &&
            errors.config.columns[column] &&
            errors.config.columns[column]?.config?.minLength?.message
          }
        />

        <TextField
          fullWidth
          size="small"
          type="number"
          autoComplete="off"
          label="Caracteres máximos"
          disabled={isSubmitting}
          inputProps={register(`config.columns.${column}.config.maxLength`, {
            valueAsNumber: true,
          })}
          error={
            errors.config?.columns &&
            errors.config.columns[column] &&
            Boolean(errors.config.columns[column]?.config?.maxLength)
          }
          helperText={
            errors.config?.columns &&
            errors.config.columns[column] &&
            errors.config.columns[column]?.config?.maxLength?.message
          }
        />
      </Stack>
    </Stack>
  );
};

export default TextAreaColumnConfig;
