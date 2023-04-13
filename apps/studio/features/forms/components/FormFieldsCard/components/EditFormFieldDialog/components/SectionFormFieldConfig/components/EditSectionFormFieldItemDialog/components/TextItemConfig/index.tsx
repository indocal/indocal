import { Stack, Divider } from '@mui/material';
import { useFormContext, Control } from 'react-hook-form';

import { NumberField, ControlledCheckbox } from '@indocal/ui';

import { EditFormFieldDialogData } from '../../../../../../context';

export interface TextItemConfigProps {
  item: number;
}

export const TextItemConfig: React.FC<TextItemConfigProps> = ({ item }) => {
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
        <NumberField
          fullWidth
          size="small"
          autoComplete="off"
          label="Caracteres mínimos"
          disabled={isSubmitting}
          inputProps={register(`config.items.${item}.config.minLength`, {
            valueAsNumber: true,
          })}
          error={
            errors.config?.items &&
            errors.config.items[item] &&
            Boolean(errors.config.items[item]?.config?.minLength)
          }
          helperText={
            errors.config?.items &&
            errors.config.items[item] &&
            errors.config.items[item]?.config?.minLength?.message
          }
        />

        <NumberField
          fullWidth
          size="small"
          autoComplete="off"
          label="Caracteres máximos"
          disabled={isSubmitting}
          inputProps={register(`config.items.${item}.config.maxLength`, {
            valueAsNumber: true,
          })}
          error={
            errors.config?.items &&
            errors.config.items[item] &&
            Boolean(errors.config.items[item]?.config?.maxLength)
          }
          helperText={
            errors.config?.items &&
            errors.config.items[item] &&
            errors.config.items[item]?.config?.maxLength?.message
          }
        />
      </Stack>
    </Stack>
  );
};

export default TextItemConfig;
