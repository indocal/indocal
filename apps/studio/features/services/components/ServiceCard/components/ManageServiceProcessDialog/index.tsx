import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
} from '@mui/material';
import { AddCircle as AddIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

import { NoData } from '@indocal/ui';
import { Can, Service } from '@indocal/services';

import { ServiceProcessStepsTree } from '@/features';

import { useServiceCard } from '../../context';
import { AddServiceProcessStepDialog, EditServiceProcessStepDialog } from '../';

export interface ManageServiceProcessDialogProps {
  service: Service;
}

export const ManageServiceProcessDialog: React.FC<
  ManageServiceProcessDialogProps
> = ({ service }) => {
  const {
    isManageServiceProcessDialogOpen,
    isAddServiceProcessStepDialogOpen,
    isEditServiceProcessStepDialogOpen,
    toggleManageServiceProcessDialog,
    toggleAddServiceProcessStepDialog,
    toggleEditServiceProcessStepDialog,
  } = useServiceCard();

  const [step, setStep] = useState<Service['steps'][number] | null>(null);

  const handleEdit = useCallback(
    (step: Service['steps'][number]) => {
      setStep(step);
      toggleEditServiceProcessStepDialog();
    },
    [toggleEditServiceProcessStepDialog]
  );

  const handleOnClose = useCallback(() => {
    setStep(null);
    toggleManageServiceProcessDialog();
  }, [toggleManageServiceProcessDialog]);

  return (
    <>
      {isAddServiceProcessStepDialogOpen && (
        <AddServiceProcessStepDialog service={service} />
      )}

      {isEditServiceProcessStepDialogOpen && step && (
        <EditServiceProcessStepDialog service={service} step={step} />
      )}

      <Dialog
        fullScreen
        open={isManageServiceProcessDialogOpen}
        onClose={handleOnClose}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: (theme) => theme.spacing(1),
          }}
        >
          <Typography fontWeight="bolder">Administrar procesos</Typography>

          <Can I="create" a="service">
            <IconButton onClick={toggleAddServiceProcessStepDialog}>
              <AddIcon />
            </IconButton>
          </Can>
        </DialogTitle>

        <DialogContent dividers sx={{ padding: (theme) => theme.spacing(1) }}>
          {service.steps.length > 0 ? (
            <ServiceProcessStepsTree
              service={service}
              onStepClick={(_, node) => handleEdit(node.data.step)}
            />
          ) : (
            <NoData message="Pasos aun sin definir" />
          )}
        </DialogContent>

        <DialogActions>
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            onClick={toggleManageServiceProcessDialog}
          >
            Finalizar
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageServiceProcessDialog;
