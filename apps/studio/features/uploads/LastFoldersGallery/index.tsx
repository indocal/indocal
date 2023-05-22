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

import { Loader, ErrorInfo ,FoldersGallery} from '@indocal/ui';
import { useFolders } from '@indocal/services';

import { indocal } from '@/lib';
import { Pages } from '@/config';

export const LastFoldersGallery: React.FC = () => {
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });

  const { loading, validating, folders, count, error } = useFolders({
    ...(search && {
      filters: {
        OR: [
          { id: { mode: 'insensitive', contains: search } },
          { name: { mode: 'insensitive', contains: search } },
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
        <FoldersGallery
          title={`Últimas carpetas (${count})`}
          folders={folders}
          client={indocal}
          basePath={Pages.UPLOADS}
        />
      )}
    </Stack>
  );
};

export default LastFoldersGallery;
