import { TextField } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import {
  ServiceCertificateTemplatePlaceholder,
  ServiceCertificateTemplateSectionPlaceholderItem,
} from '@indocal/services';

export interface TextItemProps {
  placeholder: ServiceCertificateTemplatePlaceholder;
  item: ServiceCertificateTemplateSectionPlaceholderItem;
}

export const TextItem: React.FC<TextItemProps> = ({ placeholder, item }) => {
  const {
    formState: { isSubmitting, errors },
    watch,
    register,
  } = useFormContext();

  const key = `${placeholder.name}__${item.name}`;

  const filled = Boolean(watch(key));

  return (
    <TextField
      required
      autoComplete="off"
      fullWidth
      size="small"
      label={item.title}
      disabled={isSubmitting}
      inputProps={register(key, {
        required: {
          value: true,
          message: 'Debe completar este campo',
        },
      })}
      error={Boolean(errors[key])}
      helperText={errors[key]?.message as string}
      InputLabelProps={{ shrink: filled }}
    />
  );
};

export default TextItem;
