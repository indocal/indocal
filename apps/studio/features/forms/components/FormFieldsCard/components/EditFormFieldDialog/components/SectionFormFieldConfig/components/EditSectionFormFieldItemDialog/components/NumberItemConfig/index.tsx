import { Stack, Divider } from '@mui/material';
import { useFormContext, Control } from 'react-hook-form';

import { NumberTextField, ControlledCheckbox } from '@indocal/ui';

import { EditFormFieldDialogData } from '../../../../../../context';

export interface NumberItemConfigProps {
  item: number;
}

export const NumberItemConfig: React.FC<NumberItemConfigProps> = ({ item }) => {
  const {
    formState: { isSubmitting, errors },
    register,
    control,
  } = useFormContext<EditFormFieldDialogData>();

  return (
    <Stack spacing={2} divider={<Divider flexItem />}>
      <ControlledCheckbox
        name={`config.items.${item}.config.required`}
        label="¿Campo requerido?"
        control={control as unknown as Control}
        formControlProps={{ disabled: isSubmitting }}
      />

      <Stack direction="row" spacing={2}>
        <NumberTextField
          fullWidth
          size="small"
          autoComplete="off"
          label="Valor mínimo"
          disabled={isSubmitting}
          inputProps={register(`config.items.${item}.config.min`, {
            valueAsNumber: true,
          })}
          error={
            errors.config?.items &&
            errors.config.items[item] &&
            Boolean(errors.config.items[item]?.config?.min)
          }
          helperText={
            errors.config?.items &&
            errors.config.items[item] &&
            errors.config.items[item]?.config?.min?.message
          }
        />

        <NumberTextField
          fullWidth
          size="small"
          autoComplete="off"
          label="Valor máximo"
          disabled={isSubmitting}
          inputProps={register(`config.items.${item}.config.max`, {
            valueAsNumber: true,
          })}
          error={
            errors.config?.items &&
            errors.config.items[item] &&
            Boolean(errors.config.items[item]?.config?.max)
          }
          helperText={
            errors.config?.items &&
            errors.config.items[item] &&
            errors.config.items[item]?.config?.max?.message
          }
        />
      </Stack>
    </Stack>
  );
};

export default NumberItemConfig;
