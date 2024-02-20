import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useConfirm } from 'material-ui-confirm';
import { useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import {
  ControlledUsersAutocomplete,
  ControlledServicesAutocomplete
} from '@indocal/forms-generator';
import { entitySchema } from '@indocal/utils';

import { indocal } from '@/lib';

import { useCertificatesDataGrid } from '../../context';

import { GenerateCertificateDialog } from '../GenerateCertificateDialog'

type FormData = zod.infer<typeof schema>;

const schema = zod.object(
  {
    user: entitySchema({
      description: 'Usuario',
      required_error: 'Debe seleccionar el usuario',
      invalid_type_error: 'Formato no válido',
    }),
    service: entitySchema({
      description: 'Servicio',
      required_error: 'Debe seleccionar el servicio',
      invalid_type_error: 'Formato no válido',
    }),
  },
  {
    description: 'Datos del certificado',
    required_error: 'Debe ingresar los datos del certificado',
    invalid_type_error: 'Formato no válido',
  }
);

export const AddCertificateDialog: React.FC = () => {
  const router = useRouter();

  const {
    isAddCertificateDialogOpen,
    toggleAddCertificateDialog,
    isGenerateCertificateDialogOpen,
    toggleGenerateCertificateDialog
  } = useCertificatesDataGrid();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const {
    formState: { isDirty, isSubmitting },
    control,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [request, setRequest] = useState<any>(null);

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { request, error } = await indocal.services.requests.create({
        answers: [],
        service: formData.service.id,
        requestedBy: formData.user.id,
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
      } else {
        setRequest(request);
        toggleGenerateCertificateDialog();
      }
    },
    [router, toggleGenerateCertificateDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(() => {
    if (!isDirty) {
      toggleAddCertificateDialog();
    } else {
      confirm({
        title: 'Cancelar acción',
        description: '¿Estás seguro de que deseas cancelar esta acción?',
      })
        .then(() => {
          toggleAddCertificateDialog();
          reset();
        })
        .catch(() => undefined);
    }
  }, [isDirty, reset, toggleAddCertificateDialog, confirm]);

  return (
    <>
      {isGenerateCertificateDialogOpen && request && <GenerateCertificateDialog request={request} />}

      <Dialog fullWidth open={isAddCertificateDialogOpen} onClose={handleOnClose}>
        <DialogTitle>Agregar certificado</DialogTitle>

        <DialogContent dividers>
          <Stack component="form" autoComplete="off" spacing={2}>
            <ControlledUsersAutocomplete
              required
              name="user"
              label="Usuario"
              control={control as unknown as Control}
              disabled={isSubmitting}
            />

            <ControlledServicesAutocomplete
              required
              name="service"
              label="Servicio"
              control={control as unknown as Control}
              disabled={isSubmitting}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            loading={isSubmitting}
            disabled={!isDirty}
            onClick={handleSubmit(onSubmit)}
          >
            Agregar
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddCertificateDialog;
