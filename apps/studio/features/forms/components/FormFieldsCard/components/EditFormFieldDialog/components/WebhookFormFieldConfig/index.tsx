import { useFormContext } from 'react-hook-form';

import { ControlledCheckbox } from '@indocal/ui';

import { EditFormFieldDialogData } from '../../context';

export const WebhookFormFieldConfig: React.FC = () => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext<EditFormFieldDialogData>();

  return (
    <ControlledCheckbox
      name="config.webhook"
      label="¿Incluir en la webhook?"
      control={control}
      formControlProps={{ disabled: isSubmitting }}
    />
  );
};

export default WebhookFormFieldConfig;
