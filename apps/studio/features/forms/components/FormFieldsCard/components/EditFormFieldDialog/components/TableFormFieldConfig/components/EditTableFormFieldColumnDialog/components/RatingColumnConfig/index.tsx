import { Stack, Divider } from '@mui/material';
import { useFormContext, Control } from 'react-hook-form';

import { NumberField, ControlledCheckbox } from '@indocal/ui';

import { EditFormFieldDialogData } from '../../../../../../context';

export interface RatingColumnConfigProps {
  column: number;
}

export const RatingColumnConfig: React.FC<RatingColumnConfigProps> = ({
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

      <NumberField
        fullWidth
        size="small"
        autoComplete="off"
        label="Niveles de puntación"
        disabled={isSubmitting}
        defaultValue={5}
        inputProps={register(`config.columns.${column}.config.levels`, {
          valueAsNumber: true,
        })}
        error={
          errors.config?.columns &&
          errors.config.columns[column] &&
          Boolean(errors.config.columns[column]?.config?.levels)
        }
        helperText={
          errors.config?.columns &&
          errors.config.columns[column] &&
          errors.config.columns[column]?.config?.levels?.message
        }
      />
    </Stack>
  );
};

export default RatingColumnConfig;
