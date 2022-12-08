import { useFormContext, Control } from 'react-hook-form';

import { ControlledCheckbox } from '@indocal/ui';

import { EditFormFieldDialogData } from '../../../../../../context';

export interface WebhookItemConfigProps {
  item: number;
}

export const WebhookItemConfig: React.FC<WebhookItemConfigProps> = ({
  item,
}) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext<EditFormFieldDialogData>();

  return (
    <ControlledCheckbox
      name={`config.items.${item}.config.webhook`}
      label="¿Incluir en el webhook?"
      control={control as unknown as Control}
      formControlProps={{ disabled: isSubmitting }}
    />
  );
};

export default WebhookItemConfig;
