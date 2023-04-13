import { Stack, Divider } from '@mui/material';
import { useFormContext, Control } from 'react-hook-form';

import { NumberTextField, ControlledCheckbox } from '@indocal/ui';

import { EditFormFieldDialogData } from '../../../../../../context';

export interface RatingItemConfigProps {
  item: number;
}

export const RatingItemConfig: React.FC<RatingItemConfigProps> = ({ item }) => {
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

      <NumberTextField
        fullWidth
        size="small"
        autoComplete="off"
        label="Niveles de puntación"
        disabled={isSubmitting}
        defaultValue={5}
        inputProps={register(`config.items.${item}.config.levels`, {
          valueAsNumber: true,
        })}
        error={
          errors.config?.items &&
          errors.config.items[item] &&
          Boolean(errors.config.items[item]?.config?.levels)
        }
        helperText={
          errors.config?.items &&
          errors.config.items[item] &&
          errors.config.items[item]?.config?.levels?.message
        }
      />
    </Stack>
  );
};

export default RatingItemConfig;
