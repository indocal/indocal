import { useMemo } from 'react';
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
  useService,
  getShortUUID,
  translateServiceStatus,
  translateServiceRequestStatus,
  UUID,
  Service,
} from '@indocal/services';

import { Pages } from '@/config';

import { ServiceCardProvider, useServiceCard } from './context';
import { EditServiceDialog } from './components';

export interface ServiceCardProps {
  service: UUID | Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service: entity }) => {
  const { loading, validating, service, error } = useService(
    typeof entity === 'string' ? entity : entity.id
  );

  const { isEditServiceDialogOpen, toggleEditServiceDialog } = useServiceCard();

  const supportedRequestStatus = useMemo(() => {
    if (!service) return;

    const formatter = new Intl.ListFormat('es');

    return formatter.format(
      service.supportedRequestStatus.map((status) =>
        translateServiceRequestStatus(status)
      )
    );
  }, [service]);

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
        <Loader invisible message="Cargando datos del servicio..." />
      ) : error ? (
        <ErrorInfo error={error} />
      ) : service ? (
        <>
          {isEditServiceDialogOpen && <EditServiceDialog service={service} />}

          {validating && (
            <LinearProgress
              sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
            />
          )}

          <CardHeader
            subheader="Detalles del servicio"
            action={
              <Stack direction="row" alignItems="center" spacing={0.25}>
                <Can I="read" a="service">
                  <IconButton
                    LinkComponent={NextLink}
                    href={`${Pages.SERVICES}/${service.id}`}
                    size="small"
                    sx={{ display: 'flex' }}
                  >
                    <ViewDetailsIcon />
                  </IconButton>
                </Can>

                <Can I="update" a="service">
                  <IconButton size="small" onClick={toggleEditServiceDialog}>
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
                  secondary={getShortUUID(service.id)}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText primary="Servicio" secondary={service.title} />
              </ListItem>

              {service.description && (
                <ListItem disablePadding>
                  <ListItemText
                    primary="Descripción"
                    secondary={service.description}
                    secondaryTypographyProps={{
                      component: 'pre',
                      variant: 'caption',
                      color: 'text.secondary',
                      sx: {
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      },
                    }}
                  />
                </ListItem>
              )}

              <ListItem disablePadding>
                <ListItemText
                  primary="Estado"
                  secondary={translateServiceStatus(service.status)}
                />
              </ListItem>

              {supportedRequestStatus && supportedRequestStatus.length > 0 && (
                <ListItem disablePadding>
                  <ListItemText
                    primary="Estados soportados"
                    secondary={supportedRequestStatus}
                  />
                </ListItem>
              )}

              <ListItem disablePadding>
                <ListItemText
                  primary="Fecha de creación"
                  secondary={new Date(service.createdAt).toLocaleDateString()}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText
                  primary="Última modificación"
                  secondary={new Date(service.updatedAt).toLocaleDateString()}
                />
              </ListItem>
            </List>
          </CardContent>
        </>
      ) : (
        <NoData message="No se han encontrado datos del servicio" />
      )}
    </Card>
  );
};

const ServiceCardWrapper: React.FC<ServiceCardProps> = (props) => (
  <ServiceCardProvider>
    <ServiceCard {...props} />
  </ServiceCardProvider>
);

export { ServiceCardWrapper as ServiceCard };

export default ServiceCardWrapper;
