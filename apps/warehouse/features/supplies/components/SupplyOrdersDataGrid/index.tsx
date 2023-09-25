import { useState, useMemo, useCallback } from 'react';
import NextLink from 'next/link';
import {
  Box,
  Paper,
  Stack,
  Typography,
  IconButton,
  Chip,
  ChipProps,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Launch as ViewDetailsIcon,
} from '@mui/icons-material';
import { GridColDef, GridRowsProp } from '@mui/x-data-grid';

import { EnhancedDataGrid } from '@indocal/ui';
import {
  Can,
  useOrders,
  getShortUUID,
  translateOrderStatus,
  Supply,
  OrderStatus,
} from '@indocal/services';

import { Pages } from '@/config';

export interface SupplyOrdersDataGridProps {
  supply: Supply;
}

export const SupplyOrdersDataGrid: React.FC<SupplyOrdersDataGridProps> = ({
  supply,
}) => {
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 0, pageSize: 50 });

  const {
    loading,
    validating,
    orders,
    count,
    error: serviceError,
    refetch,
  } = useOrders({
    filters: {
      items: { some: { supply: { id: supply.id } } },
      ...(search && {
        OR: [
          { id: { mode: 'insensitive', contains: search } },
          { code: { mode: 'insensitive', contains: search } },
          { supplier: { name: { mode: 'insensitive', contains: search } } },
        ],
      }),
    },
    pagination: {
      skip: pagination.page * pagination.pageSize,
      take: pagination.pageSize,
    },
    orderBy: { createdAt: 'desc' },
  });

  const statusColors: Record<OrderStatus, ChipProps['color']> = useMemo(
    () => ({
      PENDING: 'error',
      PARTIAL: 'warning',
      COMPLETED: 'success',
      CANCELLED: 'error',
    }),
    []
  );

  const columns = useMemo<GridColDef[]>(
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
        minWidth: 225,
        flex: 1,
        valueGetter: ({ value }) => value.name,
      },
      {
        field: 'status',
        headerName: 'Estado',
        headerAlign: 'center',
        align: 'center',
        minWidth: 150,
        valueGetter: ({ value }) => translateOrderStatus(value),
        renderCell: ({ value, row }) => (
          <Chip
            size="small"
            label={value}
            color={statusColors[row.status as OrderStatus] ?? 'default'}
          />
        ),
      },
      {
        field: 'quantity',
        headerName: 'Cantidad solicitada',
        headerAlign: 'center',
        align: 'center',
        minWidth: 175,
      },
      {
        field: 'received',
        headerName: 'Cantidad recibida',
        headerAlign: 'center',
        align: 'center',
        minWidth: 175,
        valueGetter: ({ value }) =>
          Array.isArray(value) &&
          value.reduce((total, current) => total + current, 0),
      },
      {
        field: 'createdAt',
        headerName: 'Fecha de creación',
        headerAlign: 'right',
        align: 'right',
        minWidth: 175,
        valueFormatter: ({ value }) => new Date(value).toLocaleDateString(),
      },
    ],
    [statusColors]
  );

  const rows = useMemo<GridRowsProp>(
    () =>
      orders.map((order) => {
        const item = order.items.find((item) => item.supply.id === supply.id);

        return {
          id: order.id,
          code: order.code,
          supplier: order.supplier,
          status: order.status,
          quantity: item?.quantity,
          received: item?.received,
          createdAt: order.createdAt,
        };
      }),
    [supply.id, orders]
  );

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

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
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 1,
            lineClamp: 1,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            wordBreak: 'break-word',
          }}
        >
          Últimas órdenes ({count.toLocaleString()})
        </Typography>

        <Stack direction="row" spacing={0.25}>
          <IconButton size="small" onClick={handleRefetch}>
            <RefreshIcon />
          </IconButton>
        </Stack>
      </Stack>

      <Box sx={{ height: 'calc(100% - 75px)' }}>
        <EnhancedDataGrid
          disableColumnMenu
          disableRowSelectionOnClick
          columns={columns}
          rows={rows}
          density="compact"
          loading={loading || validating}
          error={serviceError}
          quickFilterProps={{ placeholder: 'Buscar...' }}
          filterMode="server"
          onFilterModelChange={({ quickFilterValues }) =>
            setSearch((prev) =>
              quickFilterValues ? quickFilterValues.join(' ') : prev
            )
          }
          paginationMode="server"
          rowCount={count}
          paginationModel={{
            page: pagination.page,
            pageSize: pagination.pageSize,
          }}
          onPaginationModelChange={({ page, pageSize }) => {
            setPagination((prev) => ({ ...prev, page }));
            setPagination((prev) => ({ ...prev, pageSize }));
          }}
          sx={{ border: 'none' }}
        />
      </Box>
    </Box>
  );
};

export default SupplyOrdersDataGrid;
