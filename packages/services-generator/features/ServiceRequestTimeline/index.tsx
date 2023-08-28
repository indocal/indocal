import { useMemo } from 'react';
import {
  Paper,
  Stack,
  Divider,
  Typography,
  TypographyProps,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineContent,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineConnector,
  TimelineDot,
} from '@mui/lab';

import { NoData } from '@indocal/ui';
import {
  getShortUUID,
  translateServiceRequestStatus,
  ServiceRequest,
  ServiceRequestStatus,
} from '@indocal/services';

export interface ServiceRequestTimelineProps {
  request: ServiceRequest;
}

export const ServiceRequestTimeline: React.FC<ServiceRequestTimelineProps> = ({
  request,
}) => {
  const statusColors: Record<ServiceRequestStatus, TypographyProps['color']> =
    useMemo(
      () => ({
        PENDING: 'error.main',
        PENDING_APPROVAL: 'info.main',
        PENDING_PAYMENT: 'info.main',
        IN_PROGRESS: 'warning.main',
        COMPLETED: 'success.main',
        CANCELLED: 'error.main',
      }),
      []
    );

  return (
    <Stack
      component={Paper}
      spacing={2}
      divider={<Divider flexItem />}
      sx={{
        width: '100%',
        height: '100%',
        padding: (theme) => theme.spacing(2),
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
        divider={<Divider flexItem orientation="vertical" />}
      >
        <Stack sx={{ flex: 1 }}>
          <Typography variant="h6" align="center">
            Solicitud
          </Typography>

          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            sx={{ fontWeight: 'bolder' }}
          >
            {getShortUUID(request.id)}
          </Typography>
        </Stack>

        <Stack sx={{ flex: 1 }}>
          <Typography variant="h6" align="center">
            Estado
          </Typography>

          <Typography
            variant="body1"
            align="center"
            color={statusColors[request.status]}
            sx={{ fontWeight: 'bolder' }}
          >
            {translateServiceRequestStatus(request.status)}
          </Typography>
        </Stack>
      </Stack>

      <Timeline position="left" sx={{ overflow: 'auto' }}>
        {request.tracking.length > 0 ? (
          request.tracking.map((tracking, index) => (
            <TimelineItem key={`${index}.${tracking.step}`}>
              <TimelineOppositeContent color="text.secondary">
                {new Date(tracking.startedAt).toLocaleString('es-do')}
              </TimelineOppositeContent>

              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
              </TimelineSeparator>

              <TimelineContent
                sx={{
                  ...(index === request.tracking.length - 1 && {
                    fontWeight: 'bolder',
                    color: (theme) => theme.palette.secondary.main,
                  }),
                }}
              >
                {tracking.step.title}
              </TimelineContent>
            </TimelineItem>
          ))
        ) : (
          <NoData message="Esta solicitud aún no ha sido iniciada" />
        )}
      </Timeline>
    </Stack>
  );
};

export default ServiceRequestTimeline;
