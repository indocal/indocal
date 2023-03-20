import { Stack, TextField } from '@mui/material';
import { useFormContext, Control } from 'react-hook-form';

import { ControlledCheckbox } from '@indocal/ui';
import { Form } from '@indocal/services';

import { EditFormFieldDialogData } from '../../context';

export interface FormFieldWebhookConfigProps {
  field: Form['fields'][number];
}

export const FormFieldWebhookConfig: React.FC<
  FormFieldWebhookConfigProps
> = () => {
  const {
    formState: { isSubmitting, errors },
    register,
    control,
  } = useFormContext<EditFormFieldDialogData>();

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      spacing={2}
    >
      <Stack flex={1}>
        <ControlledCheckbox
          name="config.webhook.include"
          label="¿Incluir en el webhook?"
          control={control as unknown as Control}
          controllerProps={{ defaultValue: false }}
          formControlProps={{ disabled: isSubmitting }}
        />
      </Stack>

      <Stack flex={1}>
        <TextField
          fullWidth
          size="small"
          autoComplete="off"
          label="Key"
          disabled={isSubmitting}
          inputProps={register('config.webhook.key')}
          error={Boolean(errors.config?.webhook?.key)}
          helperText={errors.config?.webhook?.key?.message}
        />
      </Stack>
    </Stack>
  );
};

export default FormFieldWebhookConfig;
