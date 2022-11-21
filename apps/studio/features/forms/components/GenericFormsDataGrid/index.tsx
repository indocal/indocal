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
import {
  getShortUUID,
  translateFormStatus,
  translateFormVisibility,
  UUID,
  Form,
} from '@indocal/services';

import { indocal } from '@/lib';
import { Pages } from '@/config';

export interface GenericFormsDataGridProps {
  title: string;
  forms: Form[];
  onRefreshButtonClick?: () => void | Promise<void>;
  onAddButtonClick?: () => void | Promise<void>;
  enhancedDataGridProps?: Omit<EnhancedDataGridProps, 'columns' | 'rows'>;
}

export const GenericFormsDataGrid: React.FC<GenericFormsDataGridProps> = ({
  title,
  forms,
  onRefreshButtonClick,
  onAddButtonClick,
  enhancedDataGridProps,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = useCallback(
    async (id: UUID) => {
      const answer = window.confirm(
        '¿Estás seguro de que deseas eliminar este formulario?'
      );

      if (!answer) return;

      const { error } = await indocal.forms.delete(id);

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

        enqueueSnackbar('Formulario eliminado exitosamente', {
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
            <IconButton
              LinkComponent={NextLink}
              href={`${Pages.FORMS}/${id}`}
              size="small"
              sx={{ display: 'flex' }}
            >
              <ViewDetailsIcon />
            </IconButton>

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
        field: 'title',
        headerName: 'Formulario',
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
        valueGetter: ({ value }) => translateFormStatus(value),
      },
      {
        field: 'visibility',
        headerName: 'Visibilidad',
        headerAlign: 'center',
        align: 'center',
        minWidth: 150,
        valueGetter: ({ value }) => translateFormVisibility(value),
      },
      {
        field: 'fields',
        headerName: 'Cantidad de campos',
        headerAlign: 'center',
        align: 'center',
        minWidth: 200,
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
      forms.map((form) => ({
        id: form.id,
        title: form.title,
        status: form.status,
        visibility: form.visibility,
        fields: form.fields,
        updatedAt: form.updatedAt,
      })),
    [forms]
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

export default GenericFormsDataGrid;
