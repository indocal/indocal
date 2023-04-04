import { useMemo } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  ChipProps,
  LinearProgress,
} from '@mui/material';

import { Loader, NoData, ErrorInfo } from '@indocal/ui';
import {
  useSupplyRequest,
  translateSupplyRequestItemDeliveryStatus,
  UUID,
  SupplyRequest,
  SupplyRequestItemDeliveryStatus,
} from '@indocal/services';

export interface SupplyRequestItemsDetailsProps {
  request: UUID | SupplyRequest;
}

export const SupplyRequestItemsDetails: React.FC<
  SupplyRequestItemsDetailsProps
> = ({ request: entity }) => {
  const { loading, validating, request, error } = useSupplyRequest(
    typeof entity === 'string' ? entity : entity.id
  );

  const statusColors: Record<
    SupplyRequestItemDeliveryStatus,
    ChipProps['color']
  > = useMemo(
    () => ({
      PENDING: 'error',
      PARTIAL: 'warning',
      COMPLETED: 'success',
    }),
    []
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
        <Loader invisible message="Cargando detalles de los artículos..." />
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
            subheader="Detalles de los artículos"
            sx={{
              paddingY: (theme) => theme.spacing(2.15),
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
              {request.items.map(({ deliveryStatus, ...item }) => (
                <ListItem key={item.id} disablePadding divider>
                  <ListItemText
                    primary={`${item.supply.name} (${item.quantity})`}
                    secondary={`Restante en almacén: ${item.supply.quantity}`}
                  />

                  <ListItemSecondaryAction>
                    <Chip
                      size="small"
                      color={
                        request.status !== 'CANCELLED'
                          ? statusColors[deliveryStatus] ?? 'default'
                          : 'default'
                      }
                      label={
                        request.status !== 'CANCELLED'
                          ? translateSupplyRequestItemDeliveryStatus(
                              deliveryStatus
                            )
                          : 'Solicitud cancelada'
                      }
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </>
      ) : (
        <NoData message="No se han encontrado detalles de los artículos" />
      )}
    </Card>
  );
};

export default SupplyRequestItemsDetails;
