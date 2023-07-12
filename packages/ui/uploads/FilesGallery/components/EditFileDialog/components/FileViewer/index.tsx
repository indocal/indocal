import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Box, Stack, IconButton } from '@mui/material';
import {
  FileCopy as FileIcon,
  ContentCopy as CopyIcon,
  Download as DownloadIcon,
  CloudSync as ReplaceIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useConfirm } from 'material-ui-confirm';
import { useSWRConfig } from 'swr';

import { Can, File, ApiEndpoints } from '@indocal/services';

import { useFilesGallery } from '../../../../context';

import { useEditFileDialog } from '../../context';

export interface FileViewerProps {
  file: File;
}

export const FileViewer: React.FC<FileViewerProps> = ({ file }) => {
  const router = useRouter();

  const { mutate } = useSWRConfig();

  const { client, toggleEditFileDialog } = useFilesGallery();

  const { toggleReplaceFileDialog } = useEditFileDialog();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const [mime] = file.mime.split('/');

  const url = useMemo(
    () => new URL(file.path, process.env.NEXT_PUBLIC_BACKEND_URL),
    [file]
  );

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(url.toString());

    enqueueSnackbar('Enlace copiado', {
      variant: 'info',
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center',
      },
    });
  }, [url, enqueueSnackbar]);

  const handleDelete = useCallback(() => {
    confirm({
      title: 'Eliminar archivo',
      description: '¿Estás seguro de que deseas eliminar este archivo?',
    })
      .then(async () => {
        const { error } = await client.uploads.files.delete(file.id);

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
                key.startsWith(ApiEndpoints.FILES) &&
                key.includes(folder)
              : typeof key === 'string' && key.startsWith(ApiEndpoints.FILES)
          );

          enqueueSnackbar('Archivo eliminado exitosamente', {
            variant: 'success',
            onEntered: toggleEditFileDialog,
          });
        }
      })
      .catch(() => undefined);
  }, [
    file.id,
    router.query.folder_id,
    client,
    mutate,
    toggleEditFileDialog,
    enqueueSnackbar,
    confirm,
  ]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
        height: '100%',
        background: (theme) => `repeating-conic-gradient(
          ${theme.palette.divider} 0%,
          ${theme.palette.divider} 25%,
          transparent 0%,
          transparent 50%) 50% center / 20px 20px`,
      }}
    >
      <Stack
        direction="row"
        spacing={0.25}
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: (theme) => theme.zIndex.tooltip,
          display: 'flex',
          justifyContent: 'flex-end',
          width: '100%',
          padding: (theme) => theme.spacing(0.5),
          backgroundColor: (theme) => theme.palette.background.paper,
          opacity: 0.8,
        }}
      >
        <IconButton size="small" onClick={handleCopy}>
          <CopyIcon fontSize="small" />
        </IconButton>

        <IconButton
          size="small"
          target="_blank"
          href={url.href}
          download={file.name}
        >
          <DownloadIcon fontSize="small" />
        </IconButton>

        <Can I="replace" a="file">
          <IconButton size="small" onClick={toggleReplaceFileDialog}>
            <ReplaceIcon fontSize="small" />
          </IconButton>
        </Can>

        <Can I="delete" a="file">
          <IconButton size="small" onClick={handleDelete}>
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        </Can>
      </Stack>

      {mime !== 'audio' && mime !== 'image' && mime !== 'video' && (
        <FileIcon fontSize="large" />
      )}

      {mime === 'audio' && (
        <Box
          component="audio"
          controls
          src={url.href}
          sx={{
            padding: (theme) => theme.spacing(1),
            borderRadius: (theme) => theme.shape.borderRadius,
          }}
        />
      )}

      {mime === 'image' && (
        <Box
          component="img"
          alt={file.alt || file.name}
          src={url.href}
          sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      )}

      {mime === 'video' && (
        <Box
          component="video"
          controls
          src={url.href}
          sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      )}
    </Box>
  );
};

export default FileViewer;
