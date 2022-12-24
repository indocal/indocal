import { Stack, TextField } from '@mui/material';
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
          name={`config.items.${item}.config.webhook.include`}
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
          inputProps={register(`config.items.${item}.config.webhook.key`)}
          defaultValue={`item_${item}`}
          error={
            errors.config?.items &&
            errors.config.items[item] &&
            Boolean(errors.config.items[item]?.config?.webhook?.key)
          }
          helperText={
            errors.config?.items &&
            errors.config.items[item] &&
            errors.config.items[item]?.config?.webhook?.key?.message
          }
        />
      </Stack>
    </Stack>
  );
};

export default WebhookItemConfig;
