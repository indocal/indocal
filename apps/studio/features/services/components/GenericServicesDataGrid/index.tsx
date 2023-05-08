import { useMemo, useCallback } from 'react';
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
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import { useConfirm } from 'material-ui-confirm';

import { EnhancedDataGrid, EnhancedDataGridProps } from '@indocal/ui';
import {
  Can,
  getShortUUID,
  translateServiceStatus,
  UUID,
  Service,
  ServiceStatus,
} from '@indocal/services';

import { indocal } from '@/lib';
import { Pages } from '@/config';

export interface GenericServicesDataGridProps {
  title: string;
  services: Service[];
  onRefreshButtonClick?: false | (() => void | Promise<void>);
  onAddButtonClick?: false | (() => void | Promise<void>);
  enhancedDataGridProps?: Omit<EnhancedDataGridProps, 'columns' | 'rows'>;
}

export const GenericServicesDataGrid: React.FC<
  GenericServicesDataGridProps
> = ({
  title,
  services,
  onRefreshButtonClick,
  onAddButtonClick,
  enhancedDataGridProps,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const handleDelete = useCallback(
     (id: UUID) => {
      confirm({
        title: 'Eliminar servicio',
        description: '¿Estás seguro de que deseas eliminar este servicio?',
      }).then(async () => {
        const { error } = await indocal.services.delete(id);

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

          enqueueSnackbar('Servicio eliminado exitosamente', {
            variant: 'success',
          });
        }
      }).catch(() => undefined);
    },
    [onRefreshButtonClick, enqueueSnackbar, confirm]
  );

  const statusColors: Record<ServiceStatus, ChipProps['color']> = useMemo(
    () => ({
      DRAFT: 'warning',
      PUBLISHED: 'success',
      HIDDEN: 'default',
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
            <Can I="read" a="service">
              <IconButton
                LinkComponent={NextLink}
                href={`${Pages.SERVICES}/${id}`}
                size="small"
                sx={{ display: 'flex' }}
              >
                <ViewDetailsIcon />
              </IconButton>
            </Can>

            <Can I="delete" a="service">
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
        field: 'title',
        headerName: 'Servicio',
        headerAlign: 'center',
        align: 'center',
        minWidth: 350,
        flex: 1,
      },
      {
        field: 'status',
        headerName: 'Estado',
        headerAlign: 'center',
        align: 'center',
        minWidth: 150,
        valueGetter: ({ value }) => translateServiceStatus(value),
        renderCell: ({ value, row }) => (
          <Chip
            size="small"
            label={value}
            color={statusColors[row.status as ServiceStatus] ?? 'default'}
          />
        ),
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
    [statusColors, handleDelete]
  );

  const rows = useMemo<GridRowsProp>(
    () =>
      services.map((service) => ({
        id: service.id,
        title: service.title,
        status: service.status,
        updatedAt: service.updatedAt,
      })),
    [services]
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

export default GenericServicesDataGrid;
