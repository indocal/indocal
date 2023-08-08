import { Stack, Button } from '@mui/material';
import { OfflineBolt as AutocompleteIcon } from '@mui/icons-material';
import { useFormContext } from 'react-hook-form';

import { ControlledSignaturePad } from '@indocal/ui';
import {
  ServiceCertificateTemplatePlaceholder,
  ServiceCertificateTemplateSectionPlaceholderItem,
} from '@indocal/services';

import { useGenerateCertificateDialog } from '../../../../context';

export interface SignatureItemProps {
  placeholder: ServiceCertificateTemplatePlaceholder;
  item: ServiceCertificateTemplateSectionPlaceholderItem;
}

export const SignatureItem: React.FC<SignatureItemProps> = ({
  placeholder,
  item,
}) => {
  const { openAutocompletePopover } = useGenerateCertificateDialog();

  const {
    formState: { isSubmitting, errors },
    control,
  } = useFormContext();

  const key = `${placeholder.name}__${item.name}`;

  const handleAutocompleteClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void =>
    openAutocompletePopover(event.currentTarget, {
      type: 'SIGNATURE',
      name: key,
    });

  return (
    <Stack
      sx={{
        display: 'grid',
        gap: (theme) => theme.spacing(0.5),
        padding: (theme) => theme.spacing(1.5, 2),
        borderRadius: (theme) => theme.spacing(0.5),
        border: (theme) =>
          errors[key]
            ? `1px solid ${theme.palette.error.main}`
            : `1px solid ${theme.palette.divider}`,
      }}
    >
      <ControlledSignaturePad
        name={key}
        label={item.title}
        control={control}
        formControlProps={{
          disabled: isSubmitting,
          required: true,
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

export default SignatureItem;
