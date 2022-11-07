import { useMemo, useCallback } from 'react';
import NextLink from 'next/link';
import {
  Box,
  Paper,
  Stack,
  Typography,
  IconButton,
  Link as MuiLink,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  AddCircle as AddIcon,
  Launch as ViewDetailsIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { GridColumns, GridRowsProp } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';

import { EnhancedDataGrid, EnhancedDataGridProps } from '@indocal/ui';
import { getShortUUID, UUID, UserRole } from '@indocal/services';

import { indocal } from '@/lib';
import { Pages } from '@/config';

export interface GenericUsersRolesDataGridProps {
  title: string;
  roles: UserRole[];
  onRefreshButtonClick?: () => void | Promise<void>;
  onAddButtonClick?: () => void | Promise<void>;
  enhancedDataGridProps?: Omit<EnhancedDataGridProps, 'columns' | 'rows'>;
}

export const GenericUsersRolesDataGrid: React.FC<
  GenericUsersRolesDataGridProps
> = ({
  title,
  roles,
  onRefreshButtonClick,
  onAddButtonClick,
  enhancedDataGridProps,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = useCallback(
    async (id: UUID) => {
      const answer = window.confirm(
        '¿Estás seguro de que deseas eliminar este rol?'
      );

      if (!answer) return;

      const { error } = await indocal.auth.roles.delete(id);

      if (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      } else {
        if (onRefreshButtonClick) await onRefreshButtonClick();

        enqueueSnackbar('Rol eliminado exitosamente', {
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
            <NextLink passHref href={`${Pages.USERS_ROLES}/${id}`}>
              <IconButton
                LinkComponent={MuiLink}
                size="small"
                sx={{ display: 'flex' }}
              >
                <ViewDetailsIcon />
              </IconButton>
            </NextLink>

            <IconButton
              size="small"
              color="error"
              onClick={async () => await handleDelete(id as UUID)}
            >
              <DeleteIcon />
            </IconButton>
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
        headerName: 'Rol',
        headerAlign: 'center',
        align: 'center',
        minWidth: 225,
        flex: 1,
      },
      {
        field: 'type',
        headerName: 'Tipo',
        headerAlign: 'center',
        align: 'center',
        minWidth: 225,
        flex: 1,
      },
      {
        field: 'users',
        headerName: 'Cantidad de usuarios',
        headerAlign: 'center',
        align: 'center',
        minWidth: 175,
        valueGetter: ({ value }) => value.length,
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
      roles.map((role) => ({
        id: role.id,
        name: role.name,
        type: role.type,
        users: role.users,
        updatedAt: role.updatedAt,
      })),
    [roles]
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

export default GenericUsersRolesDataGrid;
