import { useCallback } from 'react';
import {
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import { MultipleStopOutlined as NextStepIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useSWRConfig } from 'swr';

import {
  ServiceRequest,
  translateServiceRequestStatus,
} from '@indocal/services';

import { indocal } from '@/lib';

import { useServiceRequestStepper } from '../../context';

export interface UpdateCurrentStepDialogProps {
  request: ServiceRequest;
  nextStepType: 'nextStepOnApprove' | 'nextStepOnReject';
}

export const UpdateCurrentStepDialog: React.FC<
  UpdateCurrentStepDialogProps
> = ({ request, nextStepType }) => {
  const { mutate } = useSWRConfig();

  const { isUpdateCurrentStepDialogOpen, toggleUpdateCurrentStepDialog } =
    useServiceRequestStepper();

  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = useCallback(async (formData: FormData) => {}, []);

  const handleOnClose = useCallback(async () => {
    if (!false) {
      toggleUpdateCurrentStepDialog();
    } else {
      const answer = window.confirm(
        '¿Estás seguro de que deseas cancelar esta acción?'
      );

      if (!answer) return;

      toggleUpdateCurrentStepDialog();
    }
  }, [toggleUpdateCurrentStepDialog]);

  return (
    <Dialog
      fullWidth
      open={isUpdateCurrentStepDialogOpen}
      onClose={handleOnClose}
    >
      <DialogTitle>
        {nextStepType === 'nextStepOnApprove'
          ? 'Aprobar paso actual'
          : 'Rechazar paso actual'}
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2} divider={<Divider flexItem />}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Chip label={request.currentStep?.title} sx={{ flex: 1 }} />

            <NextStepIcon />

            <Chip
              label={
                nextStepType === 'nextStepOnApprove'
                  ? request.currentStep?.nextStepOnApprove?.title
                  : request.currentStep?.nextStepOnReject?.title
              }
              sx={{ flex: 1 }}
            />
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Chip
              label={translateServiceRequestStatus(request.status)}
              sx={{ flex: 1 }}
            />

            <NextStepIcon />

            <Chip
              label={
                nextStepType === 'nextStepOnApprove'
                  ? request.currentStep?.nextStepOnApprove?.title
                  : request.currentStep?.nextStepOnReject?.title
              }
              sx={{ flex: 1 }}
            />
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions>
        <LoadingButton
          type="submit"
          variant="contained"
          color={nextStepType === 'nextStepOnApprove' ? 'success' : 'error'}
        >
          {nextStepType === 'nextStepOnApprove' ? 'Aprobar' : 'Rechazar'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateCurrentStepDialog;
