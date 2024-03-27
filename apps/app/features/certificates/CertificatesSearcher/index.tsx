import { useState, useCallback } from 'react';
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import { ControlledDniTextField ,formatDni} from '@indocal/ui';
import { ServiceCertificate } from '@indocal/services';

import { indocal } from '@/lib';

type FormData = zod.infer<typeof schema>;

const schema = zod.object(
  {
    dni: zod
      .string({
        description: 'DNI del usuario',
        required_error: 'Debe ingresar su DNI',
        invalid_type_error: 'Formato no válido',
      })
      .min(1, 'Debe ingresar el título del formulario')
      .trim(),
  },
  {
    description: 'Datos del formulario',
    required_error: 'Debe ingresar los datos del formulario',
    invalid_type_error: 'Formato no válido',
  }
);

export const CertificatesSearcher: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const {
    formState: { isDirty, isSubmitting, errors },
    register,
    control,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [certificates, setCertificates] = useState<ServiceCertificate[]>([]);

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { certificates, error } = await indocal.services.certificates.findMany({
        filters: {
          request: {
            requestedBy: {
              username: formatDni(formData.dni, 'DB')
            }
          }
        }
      });

      console.log(formatDni(formData.dni, 'DB'))

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
      }

      setCertificates(certificates);
    },
    [enqueueSnackbar]
  );

  return (
    <Stack component="form" autoComplete="off" spacing={2}>
      <ControlledDniTextField
        name="dni"
        label="Cédula"
        description='Ingrese su cédula para consultar sus certificados'
        control={control as unknown as Control}
        textFieldProps={{
          required: true,
          disabled: isSubmitting,
          FormHelperTextProps: {
            sx: {
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            },
          },
        }}
      />

      <LoadingButton
        type="submit"
        variant="contained"
        loading={isSubmitting}
        onClick={handleSubmit(onSubmit)}
      >
        Consultar
      </LoadingButton>

      <pre>{JSON.stringify(certificates, null, 2)}</pre>
    </Stack>
  );
}
