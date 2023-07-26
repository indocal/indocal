import { useMemo, useCallback } from 'react';
import NextLink from 'next/link';
import {
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  AddCircle as AddIcon,
  Preview as ViewIcon,
  RemoveCircle as DeleteIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useConfirm } from 'material-ui-confirm';
import { useSWRConfig } from 'swr';
import { isBefore } from 'date-fns';

import { NoData } from '@indocal/ui';
import {
  getShortUUID,
  UUID,
  ServiceRequest,
  ApiEndpoints,
} from '@indocal/services';

import { indocal } from '@/lib';
import { Pages } from '@/config';

import { useServiceRequestStepper } from '../../context';
import { GenerateCertificateDialog } from '../../components';

export interface ManageCertificatesDialogProps {
  request: ServiceRequest;
}

export const ManageCertificatesDialog: React.FC<
  ManageCertificatesDialogProps
> = ({ request }) => {
  const { mutate } = useSWRConfig();

  const {
    isManageCertificatesDialogOpen,
    isGenerateCertificateDialogOpen,
    toggleManageCertificatesDialog,
    toggleGenerateCertificateDialog,
  } = useServiceRequestStepper();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const sortedCertificates = useMemo(
    () =>
      request.certificates.sort((a, b) =>
        Number(isBefore(new Date(a.createdAt), new Date(b.createdAt)))
      ),
    [request.certificates]
  );

  const handleDelete = useCallback(
    (id: UUID) => {
      confirm({
        title: 'Eliminar certificado',
        description: '¿Estás seguro de que deseas eliminar este certificado?',
      })
        .then(async () => {
          const { error } = await indocal.services.certificates.delete(id);

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
            await mutate(`${ApiEndpoints.SERVICES_REQUESTS}/${request.id}`);

            enqueueSnackbar('Certificado eliminado exitosamente', {
              variant: 'success',
            });
          }
        })
        .catch(() => undefined);
    },
    [request.id, mutate, enqueueSnackbar, confirm]
  );

  return (
    <>
      {isGenerateCertificateDialogOpen && (
        <GenerateCertificateDialog request={request} />
      )}

      <Dialog
        fullWidth
        maxWidth="md"
        open={isManageCertificatesDialogOpen}
        onClose={toggleManageCertificatesDialog}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: (theme) => theme.spacing(1),
          }}
        >
          <Typography fontWeight="bolder">Administrar certificados</Typography>

          <IconButton onClick={toggleGenerateCertificateDialog}>
            <AddIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Paper component={List}>
            <ListSubheader>Certificados generados</ListSubheader>

            {sortedCertificates.length > 0 ? (
              sortedCertificates.map((certificate) => (
                <ListItem divider key={certificate.id}>
                  <ListItemText
                    primary={getShortUUID(certificate.id)}
                    secondary={new Date(certificate.createdAt).toLocaleString()}
                  />

                  <ListItemSecondaryAction
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: (theme) => theme.spacing(0.25),
                    }}
                  >
                    <Tooltip title="Ver certificado">
                      <IconButton
                        LinkComponent={NextLink}
                        href={`${Pages.SERVICES_CERTIFICATES_PREVIEW}/${certificate.id}`}
                        target="_blank"
                        size="small"
                        sx={{ display: 'flex' }}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Eliminar certificado">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(certificate.id)}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))
            ) : (
              <NoData message="Aún no se ha generado ningún certificado relacionado con esta solicitud" />
            )}
          </Paper>
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={toggleManageCertificatesDialog}
          >
            Finalizar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageCertificatesDialog;
