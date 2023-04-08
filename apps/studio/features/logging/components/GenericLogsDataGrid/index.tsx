import { useState, useMemo, useCallback } from 'react';
import { Box, Paper, Stack, Typography, IconButton } from '@mui/material';
import {
  Refresh as RefreshIcon,
  Troubleshoot as ViewDetailsIcon,
} from '@mui/icons-material';
import { GridColDef, GridRowsProp } from '@mui/x-data-grid';

import { EnhancedDataGrid, EnhancedDataGridProps } from '@indocal/ui';
import { Can, getShortUUID, UUID, Log } from '@indocal/services';

import { GenericLogsDataGridProvider, useGenericLogsDataGrid } from './context';
import { LogDetailsDialog } from './components';

export interface GenericLogsDataGridProps {
  title: string;
  logs: Log[];
  onRefreshButtonClick?: false | (() => void | Promise<void>);
  enhancedDataGridProps?: Omit<EnhancedDataGridProps, 'columns' | 'rows'>;
}

const GenericLogsDataGrid: React.FC<GenericLogsDataGridProps> = ({
  title,
  logs,
  onRefreshButtonClick,
  enhancedDataGridProps,
}) => {
  const { isLogDetailsDialogOpen, toggleLogDetailsDialog } =
    useGenericLogsDataGrid();

  const [log, setLog] = useState<Log | null>(null);

  const handleViewDetailsButtonClick = useCallback(
    (id: UUID) => {
      setLog(logs.find((log) => log.id === id) || null);
      toggleLogDetailsDialog();
    },
    [logs, toggleLogDetailsDialog]
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
            <Can I="read" a="log">
              <IconButton
                size="small"
                onClick={() => handleViewDetailsButtonClick(id as UUID)}
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
        field: 'log',
        headerName: 'Acción',
        headerAlign: 'center',
        align: 'center',
        minWidth: 425,
        flex: 1,
        valueGetter: ({ row }) => {
          const [method, handler] = row.action.split('::');

          if (row.apiToken) {
            return `{ ${row.apiToken.name} } -> [ ${row.context} ] -> ( ${method} ) -> ${handler}`;
          }

          if (row.user) {
            return `{ ${row.user.username} } -> [ ${row.context} ] -> ( ${method} ) -> ${handler}`;
          }

          return `[ ${row.context} ] -> ( ${method} ) -> ${handler}`;
        },
      },
      {
        field: 'createdAt',
        headerName: 'Fecha de registro',
        headerAlign: 'right',
        align: 'right',
        minWidth: 175,
        valueFormatter: ({ value }) => new Date(value).toLocaleString(),
      },
    ],
    [handleViewDetailsButtonClick]
  );

  const rows = useMemo<GridRowsProp>(
    () =>
      logs.map((log) => ({
        id: log.id,
        context: log.context,
        action: log.action,
        apiToken: log.apiToken,
        user: log.user,
        createdAt: log.createdAt,
      })),
    [logs]
  );

  return (
    <>
      {isLogDetailsDialogOpen && log && <LogDetailsDialog log={log} />}

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
    </>
  );
};

const GenericLogsDataGridWrapper: React.FC<GenericLogsDataGridProps> = (
  props
) => (
  <GenericLogsDataGridProvider>
    <GenericLogsDataGrid {...props} />
  </GenericLogsDataGridProvider>
);

export { GenericLogsDataGridWrapper as GenericLogsDataGrid };

export default GenericLogsDataGridWrapper;
