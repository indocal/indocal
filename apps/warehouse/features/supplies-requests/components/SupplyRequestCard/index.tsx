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
import { Launch as ViewDetailsIcon } from '@mui/icons-material';

import { Loader, NoData, ErrorInfo } from '@indocal/ui';
import {
  Can,
  useSupplyRequest,
  getShortUUID,
  translateSupplyRequestStatus,
  UUID,
  SupplyRequest,
} from '@indocal/services';

import { Pages } from '@/config';

export interface SupplyRequestCardProps {
  request: UUID | SupplyRequest;
}

export const SupplyRequestCard: React.FC<SupplyRequestCardProps> = ({
  request: entity,
}) => {
  const { loading, validating, request, error } = useSupplyRequest(
    typeof entity === 'string' ? entity : entity.id
  );

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
          {validating && (
            <LinearProgress
              sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
            />
          )}

          <CardHeader
            subheader="Detalles de la solicitud"
            action={
              <Stack direction="row" alignItems="center" spacing={0.25}>
                <Can I="read" a="supplyRequest">
                  <IconButton
                    LinkComponent={NextLink}
                    href={`${Pages.SUPPLIES_REQUESTS}/${request.id}`}
                    size="small"
                    sx={{ display: 'flex' }}
                  >
                    <ViewDetailsIcon />
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
                  primary="Descripción"
                  secondary={request.description}
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

              <ListItem disablePadding>
                <ListItemText
                  primary="Estado"
                  secondary={translateSupplyRequestStatus(request.status)}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText
                  primary="Usuario"
                  secondary={`${request.requestedBy.name} (${request.requestedBy.username})`}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText
                  primary="Fecha de creación"
                  secondary={new Date(request.createdAt).toLocaleDateString()}
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

export default SupplyRequestCard;
