import { useState } from 'react';
import { Stack, Paper, TextField, Pagination } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

import { Loader } from '@indocal/ui';
import { useFolders, UUID, Folder } from '@indocal/services';

import { FoldersGallery } from '@/features';

export interface FolderFoldersGalleryProps {
  folder: UUID | Folder;
}

export const FolderFoldersGallery: React.FC<FolderFoldersGalleryProps> = ({
  folder,
}) => {
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });

  const { loading, folders, count } = useFolders({
    filters: {
      ...(search && { name: { contains: search } }),
      folder: { id: typeof folder === 'string' ? folder : folder.id },
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
      ) : (
        <FoldersGallery title={`Carpetas (${count})`} folders={folders} />
      )}
    </Stack>
  );
};

export default FolderFoldersGallery;
