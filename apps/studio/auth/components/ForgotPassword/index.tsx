import { useCallback } from 'react';
import { Paper, Stack, Typography, TextField, Avatar } from '@mui/material';
import { LockOutlined as LockIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import { indocal } from '@/lib';
import { Pages } from '@/config';

const schema = zod.object({
  email: zod
    .string({
      description: 'Correo electrónico',
      required_error: 'Debe ingresar su correo electrónico',
      invalid_type_error: 'Formato no válido',
    })
    .email('Debe ingresar un correo electrónico válido'),
});

type FormData = zod.infer<typeof schema>;

export const ForgotPassword: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const {
    formState: { isSubmitting, errors },
    register,
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const redirectUrl = new URL(
        Pages.FORGOT_PASSWORD,
        process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
      );

      const { error } = await indocal.auth.sendRestorePasswordEmail(
        formData.email,
        redirectUrl.toString()
      );

      if (error) {
        enqueueSnackbar(
          error.details
            ? error.details.reduce(
                (acc, current) => (acc ? `${acc} | ${current}` : current),
                ``
              )
            : error.message,
          { variant: 'error' }
        );
      } else {
        enqueueSnackbar('Correo enviado exitosamente', {
          variant: 'success',
        });
      }
    },
    [enqueueSnackbar]
  );

  return (
    <Stack
      component={Paper}
      justifyContent="center"
      alignItems="center"
      spacing={2.5}
      sx={{
        margin: 'auto',
        padding: (theme) => theme.spacing(4),
        borderRadius: (theme) => theme.shape.borderRadius,
      }}
    >
      <Stack>
        <Avatar sx={{ width: 60, height: 60 }}>
          <LockIcon />
        </Avatar>
      </Stack>

      <Stack spacing={0.25}>
        <Typography variant="h5" align="center" sx={{ fontWeight: 'bolder' }}>
          ¿Olvidaste tu contraseña?
        </Typography>

        <Typography variant="caption" align="center" color="text.secondary">
          Ingresa tu correo electrónico y te enviaremos un enlace para
          restablecer tu contraseña.
        </Typography>
      </Stack>

      <Stack
        component="form"
        noValidate
        spacing={0.5}
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          width: '100%',
          padding: (theme) => theme.spacing(1, 6),
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <TextField
          required
          fullWidth
          size="small"
          margin="dense"
          autoComplete="email"
          label="Correo electrónico"
          disabled={isSubmitting}
          inputProps={register('email')}
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
        />

        <LoadingButton
          type="submit"
          variant="contained"
          fullWidth
          size="small"
          loading={isSubmitting}
        >
          Recuperar contraseña
        </LoadingButton>
      </Stack>
    </Stack>
  );
};

export default ForgotPassword;
