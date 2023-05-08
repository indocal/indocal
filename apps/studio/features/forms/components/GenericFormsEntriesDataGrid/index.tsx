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
import { Can, getShortUUID, UUID, FormEntry } from '@indocal/services';

import { indocal } from '@/lib';
import { Pages } from '@/config';

export interface GenericFormsEntriesDataGridProps {
  title: string;
  entries: FormEntry[];
  onRefreshButtonClick?: false | (() => void | Promise<void>);
  onAddButtonClick?: false | (() => void | Promise<void>);
  enhancedDataGridProps?: Omit<EnhancedDataGridProps, 'columns' | 'rows'>;
}

export const GenericFormsEntriesDataGrid: React.FC<
  GenericFormsEntriesDataGridProps
> = ({
  title,
  entries,
  onRefreshButtonClick,
  onAddButtonClick,
  enhancedDataGridProps,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const handleDelete = useCallback(
    (id: UUID) => {
      confirm({
        title: 'Eliminar entrada',
        description: '¿Estás seguro de que deseas eliminar esta entrada?',
      })
        .then(async () => {
          const { error } = await indocal.forms.entries.delete(id);

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

            enqueueSnackbar('Entrada eliminada exitosamente', {
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
            <Can I="read" a="formEntry">
              <IconButton
                LinkComponent={NextLink}
                href={`${Pages.FORMS_ENTRIES}/${id}`}
                size="small"
                sx={{ display: 'flex' }}
              >
                <ViewDetailsIcon />
              </IconButton>
            </Can>

            <Can I="delete" a="formEntry">
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
        field: 'form',
        headerName: 'Formulario',
        headerAlign: 'center',
        align: 'center',
        minWidth: 350,
        flex: 1,
        valueGetter: ({ value }) => value.title,
      },
      {
        field: 'answeredBy',
        headerName: 'Usuario',
        headerAlign: 'center',
        align: 'center',
        minWidth: 300,
        valueGetter: ({ value }) =>
          value ? `${value.name} (${value.username})` : 'Anónimo',
      },
      {
        field: 'createdAt',
        headerName: 'Fecha de creación',
        headerAlign: 'right',
        align: 'right',
        minWidth: 225,
        valueFormatter: ({ value }) => new Date(value).toLocaleString(),
      },
    ],
    [handleDelete]
  );

  const rows = useMemo<GridRowsProp>(
    () =>
      entries.map((entry) => ({
        id: entry.id,
        form: entry.form,
        answeredBy: entry.answeredBy,
        createdAt: entry.createdAt,
      })),
    [entries]
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

export default GenericFormsEntriesDataGrid;
