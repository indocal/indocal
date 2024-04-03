import { useState, useCallback } from 'react';
import NextLink from 'next/link';
import {
  Paper,
  Stack,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
} from '@mui/material';
import { Download } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import { ControlledDniTextField, formatDni } from '@indocal/ui';
import { getShortUUID, ServiceCertificate } from '@indocal/services';

import { Pages } from '@/config';
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
    formState: { isSubmitting },
    control,
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [certificates, setCertificates] = useState<ServiceCertificate[]>([]);

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { certificates, error } =
        await indocal.services.certificates.findMany({
          filters: {
            request: {
              requestedBy: {
                username: formatDni(formData.dni, 'DB'),
              },
            },
          },
        });

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

      if (certificates.length === 0) {
        enqueueSnackbar('No se encontraron certificados con esta cédula', {
          variant: 'error',
        });
      }

      setCertificates(certificates);
    },
    [enqueueSnackbar]
  );

  return (
    <Stack divider={<Divider flexItem />} spacing={2}>
      <Stack component="form" autoComplete="off" spacing={2}>
        <ControlledDniTextField
          name="dni"
          label="Cédula"
          description="Ingrese su cédula para consultar sus certificados"
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
      </Stack>

      {certificates.length > 0 && (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">--</TableCell>
                <TableCell align="center">Certificado</TableCell>
                <TableCell align="right">Fecha de emisión</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {certificates.map((certificate) => (
                <TableRow
                  key={certificate.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="center">
                    <NextLink
                      href={`${Pages.SERVICES_CERTIFICATES}/${certificate.id}`}
                    >
                      <IconButton size="small">
                        <Download />
                      </IconButton>
                    </NextLink>
                  </TableCell>

                  <TableCell align="center">
                    {getShortUUID(certificate.id)}
                  </TableCell>

                  <TableCell align="right">
                    {new Date(certificate.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Stack>
  );
};
