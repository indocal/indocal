import { useMemo } from 'react';
import NextLink from 'next/link';
import { Box, Paper, Stack, Typography, IconButton } from '@mui/material';
import {
  Refresh as RefreshIcon,
  AddCircle as AddIcon,
  Print as PrintIcon,
  HomeRepairService as AdjustmentIcon,
  AssignmentReturned as InputIcon,
  AssignmentReturn as OutputIcon,
  SwapHoriz as TransferIcon,
  SignLanguage as DischargeIcon,
} from '@mui/icons-material';
import { GridColumns, GridRowsProp } from '@mui/x-data-grid';

import { EnhancedDataGrid, EnhancedDataGridProps } from '@indocal/ui';
import {
  Can,
  getShortUUID,
  translateInventoryMovementType,
  InventoryMovement,
  InventoryMovementType,
} from '@indocal/services';

import { Pages } from '@/config';

export interface GenericInventoryMovementsDataGridProps {
  title: string;
  movements: InventoryMovement[];
  onRefreshButtonClick?: false | (() => void | Promise<void>);
  onAddButtonClick?: false | (() => void | Promise<void>);
  enhancedDataGridProps?: Omit<EnhancedDataGridProps, 'columns' | 'rows'>;
}

export const GenericInventoryMovementsDataGrid: React.FC<
  GenericInventoryMovementsDataGridProps
> = ({
  title,
  movements,
  onRefreshButtonClick,
  onAddButtonClick,
  enhancedDataGridProps,
}) => {
  const icons = useMemo(
    () => ({
      ADJUSTMENT: <AdjustmentIcon htmlColor="purple" />,
      INPUT: <InputIcon color="success" />,
      OUTPUT: <OutputIcon color="warning" />,
      TRANSFER: <TransferIcon color="info" />,
      DISCHARGE: <DischargeIcon color="error" />,
    }),
    []
  );

  const columns = useMemo<GridColumns>(
    () => [
      {
        field: 'actions',
        headerName: 'Acciones',
        headerAlign: 'center',
        align: 'center',
        sortable: false,
        width: 120,
        disableExport: true,
        renderCell: ({ id }) => (
          <Stack direction="row" spacing={0.25}>
            <Can I="read" an="inventoryMovement">
              <IconButton
                LinkComponent={NextLink}
                target="_blank"
                href={`${Pages.INVENTORY_MOVEMENTS}/${id}`}
                size="small"
                sx={{ display: 'flex' }}
              >
                <PrintIcon />
              </IconButton>
            </Can>
          </Stack>
        ),
      },
      {
        field: 'id',
        headerName: 'ID',
        headerAlign: 'left',
        align: 'left',
        width: 100,
        valueFormatter: ({ value }) => getShortUUID(value),
      },
      {
        field: 'type',
        headerName: 'Tipo de movimiento',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        minWidth: 225,
        valueGetter: ({ value }) => translateInventoryMovementType(value),
        renderCell: ({ value, row }) => (
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            {icons[row.type as InventoryMovementType]}

            <Typography>{value}</Typography>
          </Stack>
        ),
      },
      {
        field: 'createdAt',
        headerName: 'Fecha de creación',
        headerAlign: 'right',
        align: 'right',
        minWidth: 200,
        valueFormatter: ({ value }) => new Date(value).toLocaleString(),
      },
    ],
    [icons]
  );

  const rows = useMemo<GridRowsProp>(
    () =>
      movements.map((movement) => ({
        id: movement.id,
        type: movement.type,
        createdAt: movement.createdAt,
      })),
    [movements]
  );

  return (
    <Box component={Paper} sx={{ height: '100%' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          height: 75,
          paddingX: (theme) => theme.spacing(2),
          borderBottom: (theme) => `1px dashed ${theme.palette.divider}`,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            maxWidth: ['12ch', '20ch', '100%'],
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </Typography>

        <Stack direction="row" spacing={0.25}>
          {onRefreshButtonClick && (
            <IconButton size="small" onClick={onRefreshButtonClick}>
              <RefreshIcon />
            </IconButton>
          )}

          {onAddButtonClick && (
            <IconButton size="small" onClick={onAddButtonClick}>
              <AddIcon />
            </IconButton>
          )}
        </Stack>
      </Stack>

      <Box sx={{ height: 'calc(100% - 75px)' }}>
        <EnhancedDataGrid
          columns={columns}
          rows={rows}
          disableColumnMenu
          disableSelectionOnClick
          sx={{ border: 'none' }}
          {...enhancedDataGridProps}
        />
      </Box>
    </Box>
  );
};

export default GenericInventoryMovementsDataGrid;
