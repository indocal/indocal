import { useMemo } from 'react';
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
  AddCircle as AddIcon,
  Launch as ViewDetailsIcon,
} from '@mui/icons-material';
import { GridColDef, GridRowsProp } from '@mui/x-data-grid';

import { EnhancedDataGrid, EnhancedDataGridProps } from '@indocal/ui';
import {
  Can,
  getShortUUID,
  translateSupplyRequestStatus,
  SupplyRequest,
  SupplyRequestStatus,
} from '@indocal/services';

import { Pages } from '@/config';

export interface GenericSuppliesRequestsDataGridProps {
  title: string;
  requests: SupplyRequest[];
  onRefreshButtonClick?: false | (() => void | Promise<void>);
  onAddButtonClick?: false | (() => void | Promise<void>);
  enhancedDataGridProps?: Omit<EnhancedDataGridProps, 'columns' | 'rows'>;
}

export const GenericSuppliesRequestsDataGrid: React.FC<
  GenericSuppliesRequestsDataGridProps
> = ({
  title,
  requests,
  onRefreshButtonClick,
  onAddButtonClick,
  enhancedDataGridProps,
}) => {
  const statusColors: Record<SupplyRequestStatus, ChipProps['color']> = useMemo(
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
            <Can I="read" a="supplyRequest">
              <IconButton
                LinkComponent={NextLink}
                href={`${Pages.SUPPLIES_REQUESTS}/${id}`}
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
        field: 'requestedBy',
        headerName: 'Usuario',
        headerAlign: 'center',
        align: 'center',
        minWidth: 300,
        flex: 1,
        valueGetter: ({ value }) => `${value.name} (${value.username})`,
      },
      {
        field: 'status',
        headerName: 'Estado',
        headerAlign: 'center',
        align: 'center',
        minWidth: 150,
        valueGetter: ({ value }) => translateSupplyRequestStatus(value),
        renderCell: ({ value, row }) => (
          <Chip
            size="small"
            label={value}
            color={statusColors[row.status as SupplyRequestStatus] ?? 'default'}
          />
        ),
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
      requests.map((supplyRequest) => ({
        id: supplyRequest.id,
        requestedBy: supplyRequest.requestedBy,
        status: supplyRequest.status,
        createdAt: supplyRequest.createdAt,
      })),
    [requests]
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
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 1,
            lineClamp: 1,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            wordBreak: 'break-word',
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
          disableRowSelectionOnClick
          sx={{ border: 'none' }}
          {...enhancedDataGridProps}
        />
      </Box>
    </Box>
  );
};

export default GenericSuppliesRequestsDataGrid;
