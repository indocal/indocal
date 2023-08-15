import { Paper, Stack, Typography } from '@mui/material';
import { ArrowRightAlt as ArrowRightIcon } from '@mui/icons-material';

import { NoData } from '@indocal/ui';
import { ServiceRequest } from '@indocal/services';

export interface ServiceRequestTimelineProps {
  request: ServiceRequest;
}

export const ServiceRequestTimeline: React.FC<ServiceRequestTimelineProps> = ({
  request,
}) => (
  <Paper sx={{ padding: (theme) => theme.spacing(4, 2), overflow: 'auto' }}>
    <Stack
      direction="row"
      spacing={2}
      divider={<ArrowRightIcon sx={{ marginY: 'auto !important' }} />}
      sx={{ width: 'fit-content', margin: 'auto' }}
    >
      {request.tracking.length > 0 ? (
        request.tracking.map((track, index) => (
          <Stack
            key={`${track.step.id}-${index}`}
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{ minWidth: 250 }}
          >
            <Typography variant="caption" align="center" color="text.secondary">
              {new Date(track.startedAt).toLocaleString()}
            </Typography>

            <Typography align="center">{track.step.title}</Typography>
          </Stack>
        ))
      ) : (
        <NoData message="Esta solicitud aún no ha sido iniciada" />
      )}
    </Stack>
  </Paper>
);

export default ServiceRequestTimeline;
