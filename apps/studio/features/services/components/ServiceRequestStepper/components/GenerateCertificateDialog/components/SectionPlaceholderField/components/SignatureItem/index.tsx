import { Stack } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { ControlledSignaturePad } from '@indocal/ui';
import {
  ServiceCertificateTemplatePlaceholder,
  ServiceCertificateTemplateSectionPlaceholderItem,
} from '@indocal/services';

export interface SignatureItemProps {
  placeholder: ServiceCertificateTemplatePlaceholder;
  item: ServiceCertificateTemplateSectionPlaceholderItem;
}

export const SignatureItem: React.FC<SignatureItemProps> = ({
  placeholder,
  item,
}) => {
  const {
    formState: { isSubmitting, errors },
    control,
  } = useFormContext();

  return (
    <Stack
      sx={{
        display: 'grid',
        gap: (theme) => theme.spacing(1),
        padding: (theme) => theme.spacing(1.5, 2),
        borderRadius: (theme) => theme.spacing(0.5),
        border: (theme) =>
          errors[`${placeholder.name}__${item.name}`]
            ? `1px solid ${theme.palette.error.main}`
            : `1px solid ${theme.palette.divider}`,
      }}
    >
      <ControlledSignaturePad
        name={`${placeholder.name}__${item.name}`}
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
    </Stack>
  );
};

export default SignatureItem;
