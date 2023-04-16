import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import {
  Unstable_Grid2,
  Stack,
  Divider,
  Paper,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Button,
  IconButton,
  Avatar,
} from '@mui/material';
import {
  Folder as FolderIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useSWRConfig } from 'swr';

import { NoData } from '@indocal/ui';
import { INDOCAL, Can, UUID, Folder, ApiEndpoints } from '@indocal/services';

import { FoldersGalleryProvider, useFoldersGallery } from './context';
import { AddFolderDialog, EditFolderDialog } from './components';

export interface FoldersGalleryProps {
  title: string;
  folders: Folder[];
  basePath: string;
}

const FoldersGallery: React.FC<FoldersGalleryProps> = ({
  title,
  folders,
  basePath,
}) => {
  const router = useRouter();

  const { mutate } = useSWRConfig();

  const {
    client,
    isAddFolderDialogOpen,
    isEditFolderDialogOpen,
    toggleAddFolderDialog,
    toggleEditFolderDialog,
  } = useFoldersGallery();

  const { enqueueSnackbar } = useSnackbar();

  const [folder, setFolder] = useState<Folder | null>(null);

  const handleEdit = useCallback(
    (folder: Folder) => {
      setFolder(folder);
      toggleEditFolderDialog();
    },
    [toggleEditFolderDialog]
  );

  const handleDelete = useCallback(
    async (id: UUID) => {
      const answer = window.confirm(
        '¿Estás seguro de que deseas eliminar esta carpeta?'
      );

      if (!answer) return;

      const { error } = await client.uploads.folders.delete(id);

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
        const folder =
          typeof router.query.folder_id === 'string'
            ? router.query.folder_id
            : null;

        await mutate((key) =>
          folder
            ? typeof key === 'string' &&
              key.startsWith(ApiEndpoints.FOLDERS) &&
              key.includes(folder)
            : typeof key === 'string' && key.startsWith(ApiEndpoints.FOLDERS)
        );

        enqueueSnackbar('Carpeta eliminada exitosamente', {
          variant: 'success',
        });
      }
    },
    [router.query.folder_id, client, mutate, enqueueSnackbar]
  );

  return (
    <>
      {isAddFolderDialogOpen && <AddFolderDialog />}
      {isEditFolderDialogOpen && folder && <EditFolderDialog folder={folder} />}

      <Unstable_Grid2 container alignItems="center" spacing={1}>
        <Unstable_Grid2
          container
          justifyContent={{ xs: 'center', sm: 'space-between' }}
          alignItems="center"
          spacing={1}
          xs={12}
        >
          <Unstable_Grid2>
            <Typography variant="h6">{title}</Typography>
          </Unstable_Grid2>

          <Unstable_Grid2 onClick={toggleAddFolderDialog}>
            <Button size="small" variant="contained">
              Agregar carpeta
            </Button>
          </Unstable_Grid2>
        </Unstable_Grid2>

        {folders.length > 0 ? (
          folders.map((folder) => (
            <Unstable_Grid2 key={folder.id} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ display: 'flex', height: 125 }}>
                <Stack
                  divider={<Divider flexItem />}
                  sx={{ width: '100%', height: '100%' }}
                >
                  <CardContent sx={{ flex: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                        lineClamp: 2,
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        wordBreak: 'break-word',
                        fontWeight: 'bolder',
                      }}
                    >
                      {folder.name}
                    </Typography>
                  </CardContent>

                  <CardActions
                    sx={{
                      display: 'flex',
                      placeContent: 'center',
                      placeItems: 'center',
                    }}
                  >
                    <Can I="update" a="folder" passThrough>
                      {(allowed) => (
                        <IconButton
                          size="small"
                          disabled={!allowed}
                          onClick={() => handleEdit(folder)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Can>

                    <Can I="delete" a="folder" passThrough>
                      {(allowed) => (
                        <IconButton
                          size="small"
                          disabled={!allowed}
                          onClick={() => handleDelete(folder.id)}
                        >
                          <DeleteIcon fontSize="small" color="error" />
                        </IconButton>
                      )}
                    </Can>
                  </CardActions>
                </Stack>

                <CardMedia
                  sx={{
                    display: 'Unstable_Grid2',
                    placeContent: 'center',
                    placeItems: 'center',
                    padding: (theme) => theme.spacing(1),
                    borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <IconButton
                    LinkComponent={NextLink}
                    href={`${basePath}/${folder.id}`}
                    size="small"
                    sx={{ display: 'flex' }}
                  >
                    <Avatar>
                      <FolderIcon />
                    </Avatar>
                  </IconButton>
                </CardMedia>
              </Card>
            </Unstable_Grid2>
          ))
        ) : (
          <Unstable_Grid2 xs={12}>
            <Paper>
              <NoData />
            </Paper>
          </Unstable_Grid2>
        )}
      </Unstable_Grid2>
    </>
  );
};

interface FoldersGalleryWrapperProps extends FoldersGalleryProps {
  client: INDOCAL;
}

const FoldersGalleryWrapper: React.FC<FoldersGalleryWrapperProps> = (props) => (
  <FoldersGalleryProvider client={props.client}>
    <FoldersGallery
      title={props.title}
      folders={props.folders}
      basePath={props.basePath}
    />
  </FoldersGalleryProvider>
);

export { FoldersGalleryWrapper as FoldersGallery };

export default FoldersGalleryWrapper;
