import { useState, useCallback } from 'react';
import NextLink from 'next/link';
import {
  Paper,
  Box,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Badge,
  Typography,
  Pagination,
  LinearProgress,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  AssignmentReturn as OutputIcon,
  Print as PrintIcon,
} from '@mui/icons-material';

import { Loader, NoData, ErrorInfo } from '@indocal/ui';
import {
  Can,
  useInventoryMovements,
  UUID,
  SupplyRequest,
} from '@indocal/services';

import { Pages } from '@/config';

export interface SupplyRequestMovementsListProps {
  request: UUID | SupplyRequest;
}

export const SupplyRequestMovementsList: React.FC<
  SupplyRequestMovementsListProps
> = ({ request }) => {
  const [pagination, setPagination] = useState({ page: 0, pageSize: 5 });

  const { loading, validating, movements, count, error, refetch } =
    useInventoryMovements({
      filters: {
        request: {
          id: typeof request === 'string' ? request : request.id,
        },
      },
      pagination: {
        skip: pagination.page * pagination.pageSize,
        take: pagination.pageSize,
      },
      orderBy: { createdAt: 'desc' },
    });

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <Paper
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      {error ? (
        <ErrorInfo error={error} />
      ) : (
        <>
          {validating && (
            <LinearProgress
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: (theme) => theme.zIndex.modal - 1,
                width: '100%',
                borderTopLeftRadius: (theme) => theme.shape.borderRadius,
                borderTopRightRadius: (theme) => theme.shape.borderRadius,
              }}
            />
          )}

          <List
            disablePadding
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              overflowX: 'hidden',
              overflowY: 'auto',
            }}
          >
            <ListSubheader
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: (theme) => theme.spacing(1),
                padding: (theme) => theme.spacing(1.5, 2),
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="caption" fontWeight="bolder">
                Movimientos
              </Typography>

              <Can I="read" an="inventoryMovement">
                <IconButton size="small" onClick={handleRefetch}>
                  <RefreshIcon />
                </IconButton>
              </Can>
            </ListSubheader>

            {loading ? (
              <Loader invisible message="Cargando movimientos..." />
            ) : movements.length > 0 ? (
              <>
                <Box sx={{ overflow: 'auto' }}>
                  {movements.map((movement) => (
                    <ListItem
                      key={movement.id}
                      divider
                      sx={{ paddingY: (theme) => theme.spacing(1.625) }}
                    >
                      <Tooltip title={movement.concept}>
                        <ListItemIcon>
                          <Badge
                            variant="dot"
                            color="info"
                            invisible={!movement.concept}
                          >
                            <OutputIcon color="warning" />
                          </Badge>
                        </ListItemIcon>
                      </Tooltip>

                      <ListItemText>
                        {new Date(movement.createdAt).toLocaleString()}
                      </ListItemText>

                      <Can I="read" an="inventoryMovement">
                        <ListItemSecondaryAction>
                          <IconButton
                            LinkComponent={NextLink}
                            target="_blank"
                            href={`${Pages.INVENTORY_MOVEMENTS}/${movement.id}`}
                            size="small"
                            sx={{ display: 'flex' }}
                          >
                            <PrintIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </Can>
                    </ListItem>
                  ))}
                </Box>

                <Box
                  sx={{
                    display: 'grid',
                    placeContent: 'center',
                    placeItems: 'center',
                    marginTop: 'auto',
                    padding: (theme) => theme.spacing(0.75),
                    borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                    backgroundColor: (theme) => theme.palette.background.paper,
                  }}
                >
                  <Pagination
                    shape="rounded"
                    count={Math.ceil(count / pagination.pageSize)}
                    page={pagination.page + 1}
                    onChange={(_, page) =>
                      setPagination((prev) => ({ ...prev, page: page - 1 }))
                    }
                  />
                </Box>
              </>
            ) : (
              <NoData message="La solicitud no presenta movimientos" />
            )}
          </List>
        </>
      )}
    </Paper>
  );
};

export default SupplyRequestMovementsList;
