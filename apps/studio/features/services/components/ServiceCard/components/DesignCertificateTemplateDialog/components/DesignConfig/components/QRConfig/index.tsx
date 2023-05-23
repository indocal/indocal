import { Stack, Unstable_Grid2, Divider, Typography } from '@mui/material';
import { useFormContext, Control } from 'react-hook-form';

import { ControlledCheckbox, NumberField } from '@indocal/ui';

import { DesignCertificateTemplateDialogData } from '../../../../context';

export const QRConfig: React.FC = () => {
  const {
    formState: { isSubmitting, errors },
    register,
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
        Código QR
      </Typography>

      <Stack spacing={2} divider={<Divider flexItem />}>
        <ControlledCheckbox
          name="qr.include"
          label="¿Incluir código QR?"
          control={control as unknown as Control}
          formControlProps={{ disabled: isSubmitting }}
        />

        <Unstable_Grid2 container spacing={2}>
          <Unstable_Grid2 xs={12}>
            <NumberField
              fullWidth
              size="small"
              autoComplete="off"
              label="Tamaño"
              disabled={isSubmitting}
              inputProps={register(`qr.size`, {
                valueAsNumber: true,
              })}
              error={Boolean(errors.qr?.size)}
              helperText={errors.qr?.size?.message}
            />
          </Unstable_Grid2>

          <Unstable_Grid2 xs={6}>
            <NumberField
              fullWidth
              size="small"
              autoComplete="off"
              label="Arriba"
              disabled={isSubmitting}
              inputProps={register(`qr.position.top`, {
                valueAsNumber: true,
              })}
              error={Boolean(errors.qr?.position?.top)}
              helperText={errors.qr?.position?.top?.message}
            />
          </Unstable_Grid2>

          <Unstable_Grid2 xs={6}>
            <NumberField
              fullWidth
              size="small"
              autoComplete="off"
              label="Izquierda"
              disabled={isSubmitting}
              inputProps={register(`qr.position.left`, {
                valueAsNumber: true,
              })}
              error={Boolean(errors.qr?.position?.left)}
              helperText={errors.qr?.position?.left?.message}
            />
          </Unstable_Grid2>

          <Unstable_Grid2 xs={6}>
            <NumberField
              fullWidth
              size="small"
              autoComplete="off"
              label="Abajo"
              disabled={isSubmitting}
              inputProps={register(`qr.position.bottom`, {
                valueAsNumber: true,
              })}
              error={Boolean(errors.qr?.position?.bottom)}
              helperText={errors.qr?.position?.bottom?.message}
            />
          </Unstable_Grid2>

          <Unstable_Grid2 xs={6}>
            <NumberField
              fullWidth
              size="small"
              autoComplete="off"
              label="Derecha"
              disabled={isSubmitting}
              inputProps={register(`qr.position.right`, {
                valueAsNumber: true,
              })}
              error={Boolean(errors.qr?.position?.right)}
              helperText={errors.qr?.position?.right?.message}
            />
          </Unstable_Grid2>
        </Unstable_Grid2>
      </Stack>
    </Stack>
  );
};

export default QRConfig;
