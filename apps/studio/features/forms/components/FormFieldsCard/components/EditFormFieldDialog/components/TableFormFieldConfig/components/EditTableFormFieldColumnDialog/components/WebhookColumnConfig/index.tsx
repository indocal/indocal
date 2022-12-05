import { useFormContext, Control } from 'react-hook-form';

import { ControlledCheckbox } from '@indocal/ui';

import { EditFormFieldDialogData } from '../../../../../../context';

export interface WebhookColumnConfigProps {
  column: number;
}

export const WebhookColumnConfig: React.FC<WebhookColumnConfigProps> = ({
  column,
}) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext<EditFormFieldDialogData>();

  return (
    <ControlledCheckbox
      name={`config.columns.${column}.config.webhook`}
      label="¿Incluir en el webhook?"
      control={control as unknown as Control}
      formControlProps={{ disabled: isSubmitting }}
    />
  );
};

export default WebhookColumnConfig;
