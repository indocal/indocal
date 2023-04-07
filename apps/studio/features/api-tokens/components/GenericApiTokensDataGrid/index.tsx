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

import { EnhancedDataGrid, EnhancedDataGridProps } from '@indocal/ui';
import {
  Can,
  getShortUUID,
  translateApiTokenType,
  translateApiTokenStatus,
  UUID,
  ApiToken,
  ApiTokenType,
  ApiTokenStatus,
} from '@indocal/services';

import { indocal } from '@/lib';
import { Pages } from '@/config';

export interface GenericApiTokensDataGridProps {
  title: string;
  apiTokens: ApiToken[];
  onRefreshButtonClick?: false | (() => void | Promise<void>);
  onAddButtonClick?: false | (() => void | Promise<void>);
  enhancedDataGridProps?: Omit<EnhancedDataGridProps, 'columns' | 'rows'>;
}

export const GenericApiTokensDataGrid: React.FC<
  GenericApiTokensDataGridProps
> = ({
  title,
  apiTokens,
  onRefreshButtonClick,
  onAddButtonClick,
  enhancedDataGridProps,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = useCallback(
    async (id: UUID) => {
      const answer = window.confirm(
        '¿Estás seguro de que deseas eliminar este API Token?'
      );

      if (!answer) return;

      const { error } = await indocal.auth.apiTokens.delete(id);

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

        enqueueSnackbar('API Token eliminado exitosamente', {
          variant: 'success',
        });
      }
    },
    [onRefreshButtonClick, enqueueSnackbar]
  );

  const typesColors: Record<ApiTokenType, ChipProps['color']> = useMemo(
    () => ({
      READ_ONLY: 'success',
      READ_WRITE: 'warning',
    }),
    []
  );

  const statusColors: Record<ApiTokenStatus, ChipProps['color']> = useMemo(
    () => ({
      ENABLED: 'success',
      DISABLED: 'error',
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
            <Can I="read" an="apiToken">
              <IconButton
                LinkComponent={NextLink}
                href={`${Pages.API_TOKENS}/${id}`}
                size="small"
                sx={{ display: 'flex' }}
              >
                <ViewDetailsIcon />
              </IconButton>
            </Can>

            <Can I="delete" an="apiToken">
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
        field: 'name',
        headerName: 'Nombre',
        headerAlign: 'center',
        align: 'center',
        minWidth: 250,
        flex: 1,
      },
      {
        field: 'type',
        headerName: 'Tipo',
        headerAlign: 'center',
        align: 'center',
        minWidth: 175,
        valueGetter: ({ value }) => translateApiTokenType(value),
        renderCell: ({ value, row }) => (
          <Chip
            size="small"
            label={value}
            color={typesColors[row.type as ApiTokenType] ?? 'default'}
          />
        ),
      },
      {
        field: 'status',
        headerName: 'Estado',
        headerAlign: 'center',
        align: 'center',
        minWidth: 175,
        valueGetter: ({ value }) => translateApiTokenStatus(value),
        renderCell: ({ value, row }) => (
          <Chip
            size="small"
            label={value}
            color={statusColors[row.status as ApiTokenStatus] ?? 'default'}
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
    [typesColors, statusColors, handleDelete]
  );

  const rows = useMemo<GridRowsProp>(
    () =>
      apiTokens.map((apiToken) => ({
        id: apiToken.id,
        name: apiToken.name,
        type: apiToken.type,
        status: apiToken.status,
        updatedAt: apiToken.updatedAt,
      })),
    [apiTokens]
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

export default GenericApiTokensDataGrid;
