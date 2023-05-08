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
import { useConfirm } from 'material-ui-confirm';

import { EnhancedDataGrid, EnhancedDataGridProps } from '@indocal/ui';
import { Can, getShortUUID, UUID, UserRole } from '@indocal/services';

import { indocal } from '@/lib';
import { Pages } from '@/config';

export interface GenericUsersRolesDataGridProps {
  title: string;
  roles: UserRole[];
  onRefreshButtonClick?: false | (() => void | Promise<void>);
  onAddButtonClick?: false | (() => void | Promise<void>);
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

  const confirm = useConfirm();

  const handleDelete = useCallback(
    (id: UUID) => {
      confirm({
        title: 'Eliminar rol',
        description: '¿Estás seguro de que deseas eliminar este rol?',
      })
        .then(async () => {
          const { error } = await indocal.auth.roles.delete(id);

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

            enqueueSnackbar('Rol eliminado exitosamente', {
              variant: 'success',
            });
          }
        })
        .catch(() => undefined);
    },
    [onRefreshButtonClick, enqueueSnackbar, confirm]
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
            <Can I="read" an="userRole">
              <IconButton
                LinkComponent={NextLink}
                href={`${Pages.USERS_ROLES}/${id}`}
                size="small"
                sx={{ display: 'flex' }}
              >
                <ViewDetailsIcon />
              </IconButton>
            </Can>

            <Can I="delete" an="userRole">
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

export default GenericUsersRolesDataGrid;
