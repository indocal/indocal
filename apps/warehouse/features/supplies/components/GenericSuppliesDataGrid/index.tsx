import { useMemo, useCallback } from 'react';
import NextLink from 'next/link';
import { Box, Paper, Stack, Typography, IconButton } from '@mui/material';
import {
  Refresh as RefreshIcon,
  AddCircle as AddIcon,
  Launch as ViewDetailsIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';

import { EnhancedDataGrid, EnhancedDataGridProps } from '@indocal/ui';
import {
  Can,
  getShortUUID,
  translateSupplyUnit,
  UUID,
  Supply,
} from '@indocal/services';

import { indocal } from '@/lib';
import { Pages } from '@/config';

export interface GenericSuppliesDataGridProps {
  title: string;
  supplies: Supply[];
  onRefreshButtonClick?: false | (() => void | Promise<void>);
  onAddButtonClick?: false | (() => void | Promise<void>);
  enhancedDataGridProps?: Omit<EnhancedDataGridProps, 'columns' | 'rows'>;
}

export const GenericSuppliesDataGrid: React.FC<
  GenericSuppliesDataGridProps
> = ({
  title,
  supplies,
  onRefreshButtonClick,
  onAddButtonClick,
  enhancedDataGridProps,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = useCallback(
    async (id: UUID) => {
      const answer = window.confirm(
        '¿Estás seguro de que deseas eliminar este recurso?'
      );

      if (!answer) return;

      const { error } = await indocal.warehouse.supplies.delete(id);

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

        enqueueSnackbar('Recurso eliminado exitosamente', {
          variant: 'success',
        });
      }
    },
    [onRefreshButtonClick, enqueueSnackbar]
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
            <Can I="read" a="supply">
              <IconButton
                LinkComponent={NextLink}
                href={`${Pages.SUPPLIES}/${id}`}
                size="small"
                sx={{ display: 'flex' }}
              >
                <ViewDetailsIcon />
              </IconButton>
            </Can>

            <Can I="delete" a="supply">
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
        headerName: 'Código',
        headerAlign: 'center',
        align: 'center',
        minWidth: 150,
      },
      {
        field: 'name',
        headerName: 'Recurso',
        headerAlign: 'center',
        align: 'center',
        minWidth: 350,
        flex: 1,
      },
      {
        field: 'unit',
        headerName: 'UM',
        headerAlign: 'center',
        align: 'center',
        minWidth: 125,
        valueGetter: ({ value }) => translateSupplyUnit(value),
      },
      {
        field: 'quantity',
        headerName: 'Cantidad',
        headerAlign: 'center',
        align: 'center',
        minWidth: 100,
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
      supplies.map((supply) => ({
        id: supply.id,
        code: supply.code,
        name: supply.name,
        unit: supply.unit,
        quantity: supply.quantity,
        updatedAt: supply.updatedAt,
      })),
    [supplies]
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

export default GenericSuppliesDataGrid;
