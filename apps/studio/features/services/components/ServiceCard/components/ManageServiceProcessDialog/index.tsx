import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Typography,
  IconButton,
} from '@mui/material';
import {
  AddCircle as AddIcon,
  Settings as SettingsIcon,
  AccountTree as StepIcon,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

import { NoData } from '@indocal/ui';
import { Can, Service } from '@indocal/services';

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

        <DialogContent dividers>
          {service.steps.length > 0 ? (
            <List disablePadding>
              {service.steps.map((step) => (
                <ListItem key={step.id} divider>
                  <ListItemIcon>
                    <StepIcon />
                  </ListItemIcon>

                  <ListItemText>{step.title}</ListItemText>

                  <Can I="update" a="service">
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleEdit(step)}>
                        <SettingsIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </Can>
                </ListItem>
              ))}
            </List>
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
