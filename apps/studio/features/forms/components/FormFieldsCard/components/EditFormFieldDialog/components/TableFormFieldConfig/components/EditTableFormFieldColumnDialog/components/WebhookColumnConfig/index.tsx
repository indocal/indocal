import { Stack, TextField } from '@mui/material';
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
          name={`config.columns.${column}.config.webhook.include`}
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
          inputProps={register(`config.columns.${column}.config.webhook.key`)}
          error={
            errors.config?.columns &&
            errors.config.columns[column] &&
            Boolean(errors.config.columns[column]?.config?.webhook?.key)
          }
          helperText={
            errors.config?.columns &&
            errors.config.columns[column] &&
            errors.config.columns[column]?.config?.webhook?.key?.message
          }
        />
      </Stack>
    </Stack>
  );
};

export default WebhookColumnConfig;
