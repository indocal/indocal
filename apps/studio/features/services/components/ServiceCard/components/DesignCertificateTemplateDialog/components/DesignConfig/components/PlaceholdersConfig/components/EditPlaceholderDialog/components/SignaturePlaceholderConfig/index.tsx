import { Stack } from '@mui/material';
import { useFormContext, Control } from 'react-hook-form';

import { ServiceCertificateTemplatePlaceholder } from '@indocal/services';

import { useDesignCertificateTemplateDialog } from '../../../../../../../../context';

import { EditPlaceholderDialogData } from '../../context';

import ControlledCompatibleServiceFormFieldsAutocomplete from '../ControlledCompatibleServiceFormFieldsAutocomplete';

export interface SignaturePlaceholderConfigProps {
  placeholder: ServiceCertificateTemplatePlaceholder;
}

export const SignaturePlaceholderConfig: React.FC<
  SignaturePlaceholderConfigProps
> = ({ placeholder }) => {
  const { service } = useDesignCertificateTemplateDialog();

  const {
    formState: { isSubmitting },
    control,
  } = useFormContext<EditPlaceholderDialogData>();

  return (
    <Stack spacing={2}>
      <ControlledCompatibleServiceFormFieldsAutocomplete
        name="config.associatedField"
        label="Campo asociado"
        service={service}
        placeholder={placeholder}
        control={control as unknown as Control}
        disabled={isSubmitting}
        autocompleteProps={{ fullWidth: true }}
      />
    </Stack>
  );
};

export default SignaturePlaceholderConfig;
