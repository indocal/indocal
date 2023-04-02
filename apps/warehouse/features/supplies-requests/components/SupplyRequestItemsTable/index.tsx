import { useMemo } from 'react';
import {
  Paper,
  Toolbar,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  ChipProps,
} from '@mui/material';
import { Archive as ArchiveIcon } from '@mui/icons-material';

import { NoData } from '@indocal/ui';
import {
  Can,
  translateSupplyRequestStatus,
  SupplyRequest,
  SupplyRequestStatus,
} from '@indocal/services';

import {
  SupplyRequestItemsTableProvider,
  useSupplyRequestItemsTable,
} from './context';
import {
  SupplyRequestItemDetails,
  DispatchSupplyRequestItemsDialog,
} from './components';

export interface SupplyRequestItemsTableProps {
  request: SupplyRequest;
}

const SupplyRequestItemsTable: React.FC<SupplyRequestItemsTableProps> = ({
  request,
}) => {
  const {
    isDispatchSupplyRequestItemsDialogOpen,
    toggleDispatchSupplyRequestItemsDialog,
  } = useSupplyRequestItemsTable();

  const statusColors: Record<SupplyRequestStatus, ChipProps['color']> = useMemo(
    () => ({
      PENDING: 'error',
      PARTIAL: 'warning',
      COMPLETED: 'success',
      CANCELLED: 'error',
    }),
    []
  );

  return (
    <>
      {isDispatchSupplyRequestItemsDialogOpen && (
        <DispatchSupplyRequestItemsDialog request={request} />
      )}

      <Paper
        sx={{
          display: 'grid',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <Toolbar
          variant="dense"
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: (theme) => theme.spacing(1),
            paddingY: (theme) => theme.spacing(2),
          }}
        >
          <Chip
            label={`Estado -> ${translateSupplyRequestStatus(request.status)}`}
            color={statusColors[request.status]}
          />

          <Can do="dispatch-items" on="supplyRequest">
            <Button
              size="small"
              variant="contained"
              disabled={['COMPLETED', 'CANCELLED'].includes(request.status)}
              endIcon={<ArchiveIcon />}
              onClick={toggleDispatchSupplyRequestItemsDialog}
            >
              Despachar artículos
            </Button>
          </Can>
        </Toolbar>

        <TableContainer>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell align="center">Recurso</TableCell>
                <TableCell align="center">Cantidad solicitada</TableCell>
                <TableCell align="center">Cantidad despachada</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {request.items.length > 0 ? (
                request.items.map((item) => (
                  <SupplyRequestItemDetails
                    key={item.id}
                    request={request}
                    item={item}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>
                    <NoData message="Esta solicitud no contiene artículos" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

const SupplyRequestItemsTableWrapper: React.FC<SupplyRequestItemsTableProps> = (
  props
) => (
  <SupplyRequestItemsTableProvider>
    <SupplyRequestItemsTable {...props} />
  </SupplyRequestItemsTableProvider>
);

export { SupplyRequestItemsTableWrapper as SupplyRequestItemsTable };

export default SupplyRequestItemsTableWrapper;
