import { useFormContext, Control } from 'react-hook-form';

import { ControlledCheckbox } from '@indocal/ui';

import { EditFormFieldDialogData } from '../../../../../../context';

export interface TimeItemConfigProps {
  item: number;
}

export const TimeItemConfig: React.FC<TimeItemConfigProps> = ({ item }) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext<EditFormFieldDialogData>();

  return (
    <ControlledCheckbox
      name={`config.items.${item}.config.required`}
      label="¿Campo requerido?"
      control={control as unknown as Control}
      formControlProps={{ disabled: isSubmitting }}
    />
  );
};

export default TimeItemConfig;
