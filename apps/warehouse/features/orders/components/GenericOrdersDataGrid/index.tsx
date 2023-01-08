import { useMemo, useCallback } from 'react';
import NextLink from 'next/link';
import { Box, Paper, Stack, Typography, IconButton } from '@mui/material';
import {
  Refresh as RefreshIcon,
  AddCircle as AddIcon,
  Launch as ViewDetailsIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { GridColumns, GridRowsProp } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';

import { EnhancedDataGrid, EnhancedDataGridProps } from '@indocal/ui';
import { Can, getShortUUID, UUID, Order } from '@indocal/services';

import { indocal } from '@/lib';
import { Pages } from '@/config';

export interface GenericOrdersDataGridProps {
  title: string;
  orders: Order[];
  onRefreshButtonClick?: false | (() => void | Promise<void>);
  onAddButtonClick?: false | (() => void | Promise<void>);
  enhancedDataGridProps?: Omit<EnhancedDataGridProps, 'columns' | 'rows'>;
}

export const GenericOrdersDataGrid: React.FC<GenericOrdersDataGridProps> = ({
  title,
  orders,
  onRefreshButtonClick,
  onAddButtonClick,
  enhancedDataGridProps,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = useCallback(
    async (id: UUID) => {
      const answer = window.confirm(
        '¿Estás seguro de que deseas eliminar esta orden?'
      );

      if (!answer) return;

      const { error } = await indocal.warehouse.orders.delete(id);

      if (error) {
        enqueueSnackbar(
          error.details
            ? error.details.reduce(
                (acc, current) => (acc ? `${acc} | ${current}` : current),
                ``
              )
            : error.message,
          { variant: 'error' }
        );
      } else {
        if (onRefreshButtonClick) await onRefreshButtonClick();

        enqueueSnackbar('Orden eliminada exitosamente', {
          variant: 'success',
        });
      }
    },
    [onRefreshButtonClick, enqueueSnackbar]
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
            <Can I="read" an="order">
              <IconButton
                LinkComponent={NextLink}
                href={`${Pages.ORDERS}/${id}`}
                size="small"
                sx={{ display: 'flex' }}
              >
                <ViewDetailsIcon />
              </IconButton>
            </Can>

            <Can I="delete" an="order">
              <IconButton
                size="small"
                color="error"
                onClick={async () => await handleDelete(id as UUID)}
              >
                <DeleteIcon />
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
        field: 'code',
        headerName: 'Orden',
        headerAlign: 'center',
        align: 'center',
        minWidth: 175,
      },
      {
        field: 'supplier',
        headerName: 'Suplidor',
        headerAlign: 'center',
        align: 'center',
        minWidth: 175,
        flex: 1,
        valueGetter: ({ value }) => value.name,
      },
      {
        field: 'updatedAt',
        headerName: 'Última modificación',
        headerAlign: 'right',
        align: 'right',
        minWidth: 175,
        valueFormatter: ({ value }) => new Date(value).toLocaleDateString(),
      },
    ],
    [handleDelete]
  );

  const rows = useMemo<GridRowsProp>(
    () =>
      orders.map((order) => ({
        id: order.id,
        code: order.code,
        supplier: order.supplier,
        createdAt: order.createdAt,
      })),
    [orders]
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

export default GenericOrdersDataGrid;
