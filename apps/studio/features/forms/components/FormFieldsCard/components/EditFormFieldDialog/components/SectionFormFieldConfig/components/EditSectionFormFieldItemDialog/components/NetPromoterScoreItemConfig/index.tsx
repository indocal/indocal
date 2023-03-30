import { useFormContext, Control } from 'react-hook-form';

import { ControlledCheckbox } from '@indocal/ui';

import { EditFormFieldDialogData } from '../../../../../../context';

export interface NetPromoterScoreItemConfigProps {
  item: number;
}

export const NetPromoterScoreItemConfig: React.FC<
  NetPromoterScoreItemConfigProps
> = ({ item }) => {
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

export default NetPromoterScoreItemConfig;
