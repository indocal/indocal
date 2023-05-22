import { useState } from 'react';
import {
  Stack,
  Paper,
  Autocomplete,
  TextField,
  Pagination,
  CircularProgress,
  debounce,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

import { Loader, ErrorInfo , FilesGallery} from '@indocal/ui';
import { useFiles } from '@indocal/services';

import { indocal } from '@/lib';

export const LastFilesGallery: React.FC = () => {
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });

  const { loading, validating, files, count, error } = useFiles({
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
        <Autocomplete
          freeSolo
          size="small"
          options={[]}
          onInputChange={debounce((_, value) => setSearch(value), 400)}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Buscar..."
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading || validating ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : (
                      <SearchIcon />
                    )}

                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          sx={{ width: 225 }}
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
        <Paper sx={{ padding: (theme) => theme.spacing(4) }}>
          <Loader invisible />
        </Paper>
      ) : error ? (
        <Paper sx={{ padding: (theme) => theme.spacing(2) }}>
          <ErrorInfo error={error} />
        </Paper>
      ) : (
        <FilesGallery
          title={`Últimos archivos (${count})`}
          files={files}
          client={indocal}
        />
      )}
    </Stack>
  );
};

export default LastFilesGallery;
