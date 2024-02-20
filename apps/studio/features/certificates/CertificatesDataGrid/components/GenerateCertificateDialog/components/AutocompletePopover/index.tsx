import { useCallback } from 'react';
import { Popover, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useConfirm } from 'material-ui-confirm';
import { useFormContext, useForm, Control } from 'react-hook-form';

import { ServiceRequest } from '@indocal/services';

import { useGenerateCertificateDialog } from '../../context';

import { ControlledCompatibleRequestEntryAnswersAutocomplete } from './components';

type FormData = { answer: ServiceRequest['entry']['answers'][number] };

export interface AutocompletePopoverProps {
  request: ServiceRequest;
}

export const AutocompletePopover: React.FC<AutocompletePopoverProps> = ({
  request,
}) => {
  const {
    autocompletePopoverPlaceholder,
    autocompletePopoverAnchorElement,
    isAutocompletePopoverOpen,
    closeAutocompletePopover,
  } = useGenerateCertificateDialog();

  const confirm = useConfirm();

  const { setValue } = useFormContext();

  const {
    formState: { isDirty, isSubmitting },
    control,
    reset,
    handleSubmit,
  } = useForm<FormData>();

  const onSubmit = useCallback(
    (formData: FormData) => {
      if (!autocompletePopoverPlaceholder) return;

      setValue(autocompletePopoverPlaceholder.name, formData.answer.content, {
        shouldDirty: true,
        shouldValidate: true,
      });

      reset();
      closeAutocompletePopover();
    },
    [autocompletePopoverPlaceholder, setValue, reset, closeAutocompletePopover]
  );

  const handleOnClose = useCallback(() => {
    if (!isDirty) {
      closeAutocompletePopover();
    } else {
      confirm({
        title: 'Cancelar acción',
        description: '¿Estás seguro de que deseas cancelar esta acción?',
      })
        .then(() => {
          closeAutocompletePopover();
          reset();
        })
        .catch(() => undefined);
    }
  }, [isDirty, reset, closeAutocompletePopover, confirm]);

  if (!autocompletePopoverPlaceholder) return null;

  return (
    <Popover
      open={isAutocompletePopoverOpen}
      onClose={handleOnClose}
      anchorEl={autocompletePopoverAnchorElement}
      anchorOrigin={
        autocompletePopoverPlaceholder.type === 'TEXT'
          ? { vertical: 'bottom', horizontal: 'left' }
          : { vertical: 'top', horizontal: 'center' }
      }
      transformOrigin={
        autocompletePopoverPlaceholder.type === 'TEXT'
          ? { vertical: 'top', horizontal: 'right' }
          : { vertical: 'bottom', horizontal: 'center' }
      }
    >
      <Stack
        component="form"
        autoComplete="off"
        spacing={1}
        sx={{
          width: { xs: 350, md: 400 },
          padding: (theme) => theme.spacing(2),
        }}
      >
        <ControlledCompatibleRequestEntryAnswersAutocomplete
          request={request}
          placeholder={autocompletePopoverPlaceholder}
          required
          name="answer"
          label="Respuesta"
          control={control as unknown as Control}
          disabled={isSubmitting}
        />

        <LoadingButton
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          loading={isSubmitting}
          disabled={!isDirty}
          onClick={handleSubmit(onSubmit)}
        >
          Listo
        </LoadingButton>
      </Stack>
    </Popover>
  );
};

export default AutocompletePopover;
