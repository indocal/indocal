import { Stack } from '@mui/material';
import { useFormContext, Control } from 'react-hook-form';

import { ControlledCheckbox } from '@indocal/ui';

import { EditFormFieldDialogData } from '../../../../../../context';

export interface UsersItemConfigProps {
  item: number;
}

export const UsersItemConfig: React.FC<UsersItemConfigProps> = ({ item }) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext<EditFormFieldDialogData>();

  return (
    <Stack direction="row" justifyContent="space-between" spacing={2}>
      <ControlledCheckbox
        name={`config.items.${item}.config.required`}
        label="¿Campo requerido?"
        control={control as unknown as Control}
        formControlProps={{ disabled: isSubmitting }}
      />

      <ControlledCheckbox
        name={`config.items.${item}.config.multiple`}
        label="¿Campo múltiple?"
        control={control as unknown as Control}
        formControlProps={{ disabled: isSubmitting }}
      />
    </Stack>
  );
};

export default UsersItemConfig;
