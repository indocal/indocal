import { useFormContext, Control } from 'react-hook-form';

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
      label="¿Incluir en el webhook?"
      control={control as unknown as Control}
      formControlProps={{ disabled: isSubmitting }}
    />
  );
};

export default WebhookFormFieldConfig;
