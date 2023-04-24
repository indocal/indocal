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

import { Loader, ErrorInfo } from '@indocal/ui';
import { FilesGallery } from '@indocal/uploads';
import { useFiles, UUID, Folder } from '@indocal/services';

import { indocal } from '@/lib';

export interface FolderFilesGalleryProps {
  folder: UUID | Folder;
}

export const FolderFilesGallery: React.FC<FolderFilesGalleryProps> = ({
  folder,
}) => {
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });

  const { loading, validating, files, count, error } = useFiles({
    filters: {
      folder: { id: typeof folder === 'string' ? folder : folder.id },
      ...(search && {
        OR: [
          { id: { mode: 'insensitive', contains: search } },
          { name: { mode: 'insensitive', contains: search } },
          { caption: { mode: 'insensitive', contains: search } },
          { alt: { mode: 'insensitive', contains: search } },
        ],
      }),
    },
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
          onInputChange={debounce((e) => setSearch(e.target.value), 400)}
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
        <Paper sx={{ padding: (theme) => theme.spacing(2) }}>
          <Loader invisible />
        </Paper>
      ) : error ? (
        <Paper sx={{ padding: (theme) => theme.spacing(2) }}>
          <ErrorInfo error={error} />
        </Paper>
      ) : (
        <FilesGallery
          title={`Archivos (${count})`}
          files={files}
          client={indocal}
        />
      )}
    </Stack>
  );
};

export default FolderFilesGallery;
