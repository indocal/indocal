import { Fragment, useState, useMemo } from 'react';
import {
  Paper,
  Box,
  List,
  ListSubheader,
  Pagination,
  LinearProgress,
} from '@mui/material';

import { Loader, NoData, ErrorInfo } from '@indocal/ui';
import {
  useInventoryMovements,
  UUID,
  Supply,
  InventoryMovement,
} from '@indocal/services';

import {
  AdjustmentMovement,
  InputMovement,
  OutputMovement,
  TransferMovement,
  DischargeMovement,
} from './components';

export interface SupplyMovementsListProps {
  supply: UUID | Supply;
}

export const SupplyMovementsList: React.FC<SupplyMovementsListProps> = ({
  supply,
}) => {
  const [pagination, setPagination] = useState({ page: 0, pageSize: 5 });

  const { loading, validating, movements, count, error } =
    useInventoryMovements({
      filters: {
        items: {
          some: {
            supply: {
              id: typeof supply === 'string' ? supply : supply.id,
            },
          },
        },
      },
      pagination: {
        skip: pagination.page * pagination.pageSize,
        take: pagination.pageSize,
      },
      orderBy: { createdAt: 'desc' },
    });

  const options = useMemo(
    () => ({
      ADJUSTMENT: AdjustmentMovement,
      INPUT: InputMovement,
      OUTPUT: OutputMovement,
      TRANSFER: TransferMovement,
      DISCHARGE: DischargeMovement,
    }),
    []
  );

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
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              Movimientos
            </ListSubheader>

            {loading ? (
              <Loader invisible message="Cargando movimientos..." />
            ) : movements.length > 0 ? (
              <>
                <Box sx={{ overflow: 'auto' }}>
                  {movements
                    .filter(
                      (movement) =>
                        movement.items.find(
                          (item) =>
                            item.supply.id ===
                            (typeof supply === 'string' ? supply : supply.id)
                        )?.quantity !== 0
                    )
                    .map((movement) => (
                      <Fragment key={movement.id}>
                        {options[movement.type]({
                          movement,
                          item: movement.items.find(
                            (item) =>
                              item.supply.id ===
                              (typeof supply === 'string' ? supply : supply.id)
                          ) as InventoryMovement['items'][number],
                        })}
                      </Fragment>
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
              <NoData message="El recurso no presenta movimientos" />
            )}
          </List>
        </>
      )}
    </Paper>
  );
};

export default SupplyMovementsList;
