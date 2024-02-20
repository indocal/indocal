import { Stack, Button } from '@mui/material';
import { OfflineBolt as AutocompleteIcon } from '@mui/icons-material';
import { useFormContext } from 'react-hook-form';

import { ControlledSignaturePad } from '@indocal/ui';
import {
  ServiceCertificateTemplatePlaceholder,
  ServiceCertificateTemplateTablePlaceholderColumn,
} from '@indocal/services';

import { useGenerateCertificateDialog } from '../../../../context';

export interface SignatureColumnProps {
  placeholder: ServiceCertificateTemplatePlaceholder;
  column: ServiceCertificateTemplateTablePlaceholderColumn;
  row: number;
}

export const SignatureColumn: React.FC<SignatureColumnProps> = ({
  placeholder,
  column,
  row,
}) => {
  const { openAutocompletePopover } = useGenerateCertificateDialog();

  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  const key = `${placeholder.name}.${row}.${column.name}`;

  const handleAutocompleteClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void =>
    openAutocompletePopover(event.currentTarget, {
      type: 'SIGNATURE',
      name: key,
    });

  return (
    <Stack spacing={1}>
      <ControlledSignaturePad
        size="small"
        name={key}
        control={control}
        formControlProps={{ disabled: isSubmitting }}
        formHelperTextProps={{ sx: { marginX: 0 } }}
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

export default SignatureColumn;
