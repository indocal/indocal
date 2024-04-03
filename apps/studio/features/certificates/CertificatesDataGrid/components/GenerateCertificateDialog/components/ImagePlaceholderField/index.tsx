import { useFormContext } from 'react-hook-form';

import { ControlledFilesAutocomplete } from '@indocal/forms-generator';
import { ServiceCertificateTemplatePlaceholder } from '@indocal/services';

export interface ImagePlaceholderFieldProps {
  placeholder: ServiceCertificateTemplatePlaceholder;
}

export const ImagePlaceholderField: React.FC<ImagePlaceholderFieldProps> = ({
  placeholder,
}) => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  return (
    <ControlledFilesAutocomplete
      name={placeholder.name}
      label={placeholder.title}
      control={control}
      disabled={isSubmitting}
      textFieldProps={{
        FormHelperTextProps: {
          sx: {
            marginX: 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          },
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
  );
};

export default ImagePlaceholderField;
