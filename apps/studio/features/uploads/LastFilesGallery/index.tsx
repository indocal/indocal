import { useState } from 'react';
import { Stack, Paper, TextField, Pagination } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

import { Loader, ErrorInfo } from '@indocal/ui';
import { useFiles } from '@indocal/services';

import { FilesGallery } from '@/features';

export const LastFilesGallery: React.FC = () => {
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });

  const { loading, files, count, error } = useFiles({
    ...(search && {
      filters: {
        OR: [
          { id: { mode: 'insensitive', contains: search } },
          { name: { mode: 'insensitive', contains: search } },
          { caption: { mode: 'insensitive', contains: search } },
          { alt: { mode: 'insensitive', contains: search } },
        ],
      },
    }),
    pagination: {
      skip: pagination.page * pagination.pageSize,
      take: pagination.pageSize,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <Stack spacing={1}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
      >
        <TextField
          size="small"
          placeholder="Buscar..."
          inputProps={{
            onKeyDown: (e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                setSearch(e.currentTarget.value);
              }
            },
          }}
          InputProps={{ endAdornment: <SearchIcon /> }}
        />

        {count > 0 && (
          <Pagination
            shape="rounded"
            count={Math.ceil(count / pagination.pageSize)}
            page={pagination.page + 1}
            onChange={(_, page) =>
              setPagination((prev) => ({ ...prev, page: page - 1 }))
            }
          />
        )}
      </Stack>

      {loading ? (
        <Paper sx={{ padding: (theme) => theme.spacing(2) }}>
          <Loader invisible />
        </Paper>
      ) : error ? (
        <Paper sx={{ padding: (theme) => theme.spacing(2) }}>
          <ErrorInfo error={error} />
        </Paper>
      ) : (
        <FilesGallery title={`Últimos archivos (${count})`} files={files} />
      )}
    </Stack>
  );
};

export default LastFilesGallery;
