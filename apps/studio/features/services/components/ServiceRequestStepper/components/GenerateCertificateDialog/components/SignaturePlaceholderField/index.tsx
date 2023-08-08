import { Stack, Button } from '@mui/material';
import { OfflineBolt as AutocompleteIcon } from '@mui/icons-material';
import { useFormContext } from 'react-hook-form';

import { ControlledSignaturePad } from '@indocal/ui';
import { ServiceCertificateTemplatePlaceholder } from '@indocal/services';

import { useGenerateCertificateDialog } from '../../context';

export interface SignaturePlaceholderFieldProps {
  placeholder: ServiceCertificateTemplatePlaceholder;
}

export const SignaturePlaceholderField: React.FC<
  SignaturePlaceholderFieldProps
> = ({ placeholder }) => {
  const { openAutocompletePopover } = useGenerateCertificateDialog();

  const {
    formState: { isSubmitting, errors },
    control,
  } = useFormContext();

  const handleAutocompleteClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void =>
    openAutocompletePopover(event.currentTarget, {
      type: 'SIGNATURE',
      name: placeholder.name,
    });

  return (
    <Stack
      sx={{
        display: 'grid',
        gap: (theme) => theme.spacing(0.5),
        padding: (theme) => theme.spacing(2),
        borderRadius: (theme) => theme.spacing(0.5),
        border: (theme) =>
          errors[placeholder.name]
            ? `1px solid ${theme.palette.error.main}`
            : `1px solid ${theme.palette.divider}`,
      }}
    >
      <ControlledSignaturePad
        name={placeholder.name}
        label={placeholder.title}
        control={control}
        formControlProps={{
          required: true,
          disabled: isSubmitting,
        }}
        formHelperTextProps={{
          sx: {
            marginX: 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          },
        }}
        controllerProps={{
          rules: {
            required: {
              value: true,
              message: 'Debe completar este campo',
            },
          },
        }}
      />

      <Button
        variant="contained"
        size="small"
        endIcon={<AutocompleteIcon fontSize="small" />}
        onClick={handleAutocompleteClick}
      >
        LLenado Automatico
      </Button>
    </Stack>
  );
};

export default SignaturePlaceholderField;
