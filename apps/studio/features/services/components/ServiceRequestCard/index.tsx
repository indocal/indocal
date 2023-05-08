import NextLink from 'next/link';
import {
  Stack,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  Launch as ViewDetailsIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

import { Loader, NoData, ErrorInfo } from '@indocal/ui';
import {
  Can,
  useServiceRequest,
  getShortUUID,
  translateServiceRequestStatus,
  UUID,
  ServiceRequest,
} from '@indocal/services';

import { Pages } from '@/config';

import { ServiceRequestCardProvider, useServiceRequestCard } from './context';
import { EditServiceRequestDialog } from './components';

export interface ServiceRequestCardProps {
  request: UUID | ServiceRequest;
}

const ServiceRequestCard: React.FC<ServiceRequestCardProps> = ({
  request: entity,
}) => {
  const { loading, validating, request, error } = useServiceRequest(
    typeof entity === 'string' ? entity : entity.id
  );

  const { isEditServiceRequestDialogOpen, toggleEditServiceRequestDialog } =
    useServiceRequestCard();

  return (
    <Card
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
      }}
    >
      {loading ? (
        <Loader invisible message="Cargando datos de la solicitud..." />
      ) : error ? (
        <ErrorInfo error={error} />
      ) : request ? (
        <>
          {isEditServiceRequestDialogOpen && (
            <EditServiceRequestDialog request={request} />
          )}

          {validating && (
            <LinearProgress
              sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
            />
          )}

          <CardHeader
            subheader="Detalles de la solicitud"
            action={
              <Stack direction="row" alignItems="center" spacing={0.25}>
                <Can I="read" a="serviceRequest">
                  <IconButton
                    LinkComponent={NextLink}
                    href={`${Pages.SERVICES_REQUESTS}/${request.id}`}
                    size="small"
                    sx={{ display: 'flex' }}
                  >
                    <ViewDetailsIcon />
                  </IconButton>
                </Can>

                <Can I="update" a="serviceRequest">
                  <IconButton
                    size="small"
                    onClick={toggleEditServiceRequestDialog}
                  >
                    <EditIcon />
                  </IconButton>
                </Can>
              </Stack>
            }
            sx={{
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          />

          <CardContent
            sx={{
              position: 'relative',
              height: '100%',
              overflow: 'auto',
            }}
          >
            <List disablePadding>
              <ListItem disablePadding>
                <ListItemText
                  primary="ID"
                  secondary={getShortUUID(request.id)}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText
                  primary="Estado"
                  secondary={translateServiceRequestStatus(request.status)}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText
                  primary="Servicio"
                  secondary={request.service.title}
                />
              </ListItem>

              {request.currentStep && (
                <ListItem disablePadding>
                  <ListItemText
                    primary="Paso actual"
                    secondary={request.currentStep.title}
                  />
                </ListItem>
              )}

              <ListItem disablePadding>
                <ListItemText
                  primary="Respondido por"
                  secondary={`${request.requestedBy.name} (${request.requestedBy.username})`}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText
                  primary="Solicitado el"
                  secondary={new Date(request.createdAt).toLocaleString()}
                />
              </ListItem>
            </List>
          </CardContent>
        </>
      ) : (
        <NoData message="No se han encontrado datos de la solicitud" />
      )}
    </Card>
  );
};

const ServiceRequestCardWrapper: React.FC<ServiceRequestCardProps> = (
  props
) => (
  <ServiceRequestCardProvider>
    <ServiceRequestCard {...props} />
  </ServiceRequestCardProvider>
);

export { ServiceRequestCardWrapper as ServiceRequestCard };

export default ServiceRequestCardWrapper;
