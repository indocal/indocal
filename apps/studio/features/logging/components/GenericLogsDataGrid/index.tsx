import { useMemo } from 'react';
import { Box, Paper, Stack, Typography, IconButton } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { GridColDef, GridRowsProp } from '@mui/x-data-grid';

import { EnhancedDataGrid, EnhancedDataGridProps } from '@indocal/ui';
import { getShortUUID, Log } from '@indocal/services';

export interface GenericLogsDataGridProps {
  title: string;
  logs: Log[];
  onRefreshButtonClick?: false | (() => void | Promise<void>);
  enhancedDataGridProps?: Omit<EnhancedDataGridProps, 'columns' | 'rows'>;
}

export const GenericLogsDataGrid: React.FC<GenericLogsDataGridProps> = ({
  title,
  logs,
  onRefreshButtonClick,
  enhancedDataGridProps,
}) => {
  const columns = useMemo<GridColDef[]>(
    () => [
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

          return row.user
            ? `{ ${row.user.username} } -> [ ${row.context} ] -> ( ${method} ) -> ${handler}`
            : `[ ${row.context} ] -> ( ${method} ) -> ${handler}`;
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
    []
  );

  const rows = useMemo<GridRowsProp>(
    () =>
      logs.map((log) => ({
        id: log.id,
        context: log.context,
        action: log.action,
        user: log.user,
        createdAt: log.createdAt,
      })),
    [logs]
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

export default GenericLogsDataGrid;
