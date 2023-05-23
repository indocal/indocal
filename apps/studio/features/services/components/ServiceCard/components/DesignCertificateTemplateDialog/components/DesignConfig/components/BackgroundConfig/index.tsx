import { Stack, Divider, Typography } from '@mui/material';
import { useFormContext, Control } from 'react-hook-form';

import { ControlledCheckbox, ControlledFilesDropzone } from '@indocal/ui';

import { DesignCertificateTemplateDialogData } from '../../../../context';

export const BackgroundConfig: React.FC = () => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext<DesignCertificateTemplateDialogData>();

  return (
    <Stack
      component="fieldset"
      sx={{
        margin: 0,
        paddingX: (theme) => theme.spacing(2),
        borderRadius: (theme) => theme.spacing(0.5),
        borderColor: (theme) => theme.palette.divider,
      }}
    >
      <Typography
        component="legend"
        variant="subtitle2"
        sx={{ paddingX: (theme) => theme.spacing(1) }}
      >
        Fondo
      </Typography>

      <Stack spacing={2} divider={<Divider flexItem />}>
        <ControlledCheckbox
          name="background.include"
          label="¿Incluir fondo?"
          control={control as unknown as Control}
          formControlProps={{ disabled: isSubmitting }}
        />

        <ControlledFilesDropzone
          name={'background.image'}
          control={control as unknown as Control}
          disabled={isSubmitting}
          dropzoneProps={{ accept: { 'image/*': ['.jpg', '.jpeg', '.png'] } }}
        />
      </Stack>
    </Stack>
  );
};

export default BackgroundConfig;
