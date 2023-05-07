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
import { useService, UUID, Service } from '@indocal/services';

import { ServiceProcessStepsTree } from '@/features';

export interface ServiceProcessStepsStepperProps {
  service: UUID | Service;
}

export const ServiceProcessStepsStepper: React.FC<
  ServiceProcessStepsStepperProps
> = ({ service: entity }) => {
  const { loading, validating, service, error } = useService(
    typeof entity === 'string' ? entity : entity.id
  );

  return (
    <Paper sx={{ position: 'relative', padding: (theme) => theme.spacing(2) }}>
      {loading ? (
        <Loader invisible message="Cargando datos del servicio..." />
      ) : error ? (
        <ErrorInfo error={error} />
      ) : service ? (
        <>
          {validating && (
            <LinearProgress
              sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
            />
          )}

          <Stack direction="column" gap={2} divider={<Divider flexItem />}>
            <Box sx={{ height: 250 }}>
              <ServiceProcessStepsTree service={service} />
            </Box>

            <Stack
              direction="row"
              justifyContent={{ xs: 'center', md: 'flex-end' }}
              alignItems="center"
              gap={1}
            >
              <Button
                variant="contained"
                size="small"
                color="error"
                endIcon={<RejectIcon />}
              >
                Rechazar
              </Button>

              <Button
                variant="contained"
                size="small"
                color="success"
                endIcon={<ApproveIcon />}
              >
                Aprobar
              </Button>
            </Stack>
          </Stack>
        </>
      ) : (
        <NoData message="No se han encontrado datos del servicio" />
      )}
    </Paper>
  );
};

export default ServiceProcessStepsStepper;
