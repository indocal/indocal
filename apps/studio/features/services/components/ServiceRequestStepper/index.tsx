import { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Stack,
  Divider,
  Button,
  LinearProgress,
} from '@mui/material';
import {
  ThumbUp as ApproveIcon,
  ThumbDown as RejectIcon,
} from '@mui/icons-material';

import { Loader, NoData, ErrorInfo } from '@indocal/ui';
import { useServiceRequest, UUID, ServiceRequest } from '@indocal/services';

import { ServiceProcessStepsTree } from '@/features';

import {
  ServiceRequestStepperProvider,
  useServiceRequestStepper,
} from './context';
import { UpdateCurrentStepDialog } from './components';

export interface ServiceRequestStepperProps {
  request: UUID | ServiceRequest;
}

const ServiceRequestStepper: React.FC<ServiceRequestStepperProps> = ({
  request: entity,
}) => {
  const { loading, validating, request, error } = useServiceRequest(
    typeof entity === 'string' ? entity : entity.id
  );

  const { isUpdateCurrentStepDialogOpen, toggleUpdateCurrentStepDialog } =
    useServiceRequestStepper();

  const [nextStepType, setNextStepType] = useState<
    'nextStepOnApprove' | 'nextStepOnReject' | null
  >(null);

  const handleUpdateCurrentStep = useCallback(
    (type: 'nextStepOnApprove' | 'nextStepOnReject') => {
      setNextStepType(type);
      toggleUpdateCurrentStepDialog();
    },
    [toggleUpdateCurrentStepDialog]
  );

  return (
    <Paper sx={{ position: 'relative', padding: (theme) => theme.spacing(2) }}>
      {loading ? (
        <Loader invisible message="Cargando datos de la solicitud..." />
      ) : error ? (
        <ErrorInfo error={error} />
      ) : request ? (
        <>
          {isUpdateCurrentStepDialogOpen && nextStepType && (
            <UpdateCurrentStepDialog
              request={request}
              nextStepType={nextStepType}
            />
          )}

          {validating && (
            <LinearProgress
              sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
            />
          )}

          <Stack direction="column" gap={2} divider={<Divider flexItem />}>
            <Box sx={{ height: 250 }}>
              <ServiceProcessStepsTree
                service={request.service.id}
                selectedStep={request.currentStep?.id}
              />
            </Box>

            {request.currentStep && (
              <Stack
                direction="row"
                justifyContent={{ xs: 'center', md: 'flex-end' }}
                alignItems="center"
                gap={1}
              >
                {request.currentStep.nextStepOnReject && (
                  <Button
                    variant="contained"
                    size="small"
                    color="error"
                    endIcon={<RejectIcon />}
                    onClick={() => handleUpdateCurrentStep('nextStepOnReject')}
                  >
                    Rechazar
                  </Button>
                )}

                {request.currentStep.nextStepOnApprove && (
                  <Button
                    variant="contained"
                    size="small"
                    color="success"
                    endIcon={<ApproveIcon />}
                    onClick={() => handleUpdateCurrentStep('nextStepOnApprove')}
                  >
                    Aprobar
                  </Button>
                )}
              </Stack>
            )}
          </Stack>
        </>
      ) : (
        <NoData message="No se han encontrado datos de la solicitud" />
      )}
    </Paper>
  );
};

const ServiceRequestStepperWrapper: React.FC<ServiceRequestStepperProps> = (
  props
) => (
  <ServiceRequestStepperProvider>
    <ServiceRequestStepper {...props} />
  </ServiceRequestStepperProvider>
);

export { ServiceRequestStepperWrapper as ServiceRequestStepper };

export default ServiceRequestStepperWrapper;