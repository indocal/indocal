import { useState, useCallback } from 'react';
import {
  Unstable_Grid2,
  Stack,
  Paper,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Typography,
  Button,
  Chip,
} from '@mui/material';
import { FileCopy as FileIcon } from '@mui/icons-material';

import { NoData } from '@indocal/ui';
import { INDOCAL, File } from '@indocal/services';

import { FilesGalleryProvider, useFilesGallery } from './context';
import { AddFileDialog, EditFileDialog } from './components';

export interface FilesGalleryProps {
  title: string;
  files: File[];
}

const FilesGallery: React.FC<FilesGalleryProps> = ({ title, files }) => {
  const {
    isAddFileDialogOpen,
    isEditFileDialogOpen,
    toggleAddFileDialog,
    toggleEditFileDialog,
  } = useFilesGallery();

  const [file, setFile] = useState<File | null>(null);

  const handleEdit = useCallback(
    (file: File) => {
      setFile(file);
      toggleEditFileDialog();
    },
    [toggleEditFileDialog]
  );

  return (
    <>
      {isAddFileDialogOpen && <AddFileDialog />}
      {isEditFileDialogOpen && file && <EditFileDialog file={file} />}

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

          <Unstable_Grid2 onClick={toggleAddFileDialog}>
            <Button size="small" variant="contained">
              Agregar archivos
            </Button>
          </Unstable_Grid2>
        </Unstable_Grid2>

        {files.length > 0 ? (
          files.map((file) => {
            const [mime] = file.mime.split('/');

            const url = new URL(file.path, process.env.NEXT_PUBLIC_BACKEND_URL);

            return (
              <Unstable_Grid2 key={file.id} xs={12} sm={6} md={4} lg={3}>
                <Card>
                  <CardActionArea
                    onClick={() => handleEdit(file)}
                    sx={{ height: 225 }}
                  >
                    <Stack
                      justifyContent="center"
                      alignItems="center"
                      sx={{
                        height: 'calc(100% - 75px)',
                        background: (theme) => `repeating-conic-gradient(
                          ${theme.palette.divider} 0%,
                          ${theme.palette.divider} 25%,
                          transparent 0%,
                          transparent 50%) 50% center / 20px 20px`,
                      }}
                    >
                      {mime !== 'audio' &&
                        mime !== 'image' &&
                        mime !== 'video' && (
                          <CardMedia component={FileIcon} fontSize="large" />
                        )}

                      {mime === 'audio' && (
                        <CardMedia
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
                        <CardMedia
                          component="img"
                          image={url.href}
                          alt={file.alt || file.name}
                          sx={{ height: '100%', objectFit: 'contain' }}
                        />
                      )}

                      {mime === 'video' && (
                        <CardMedia
                          component="video"
                          src={url.href}
                          sx={{ height: '100%', objectFit: 'contain' }}
                        />
                      )}
                    </Stack>

                    <CardContent
                      sx={{
                        display: 'flex',
                        gap: (theme) => theme.spacing(1),
                        height: 75,
                        marginTop: 'auto',
                        borderTop: (theme) =>
                          `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Chip
                        variant="filled"
                        size="small"
                        label={file.extension.split('.')[1].toUpperCase()}
                      />

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
                        {file.caption || file.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Unstable_Grid2>
            );
          })
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

interface FilesGalleryWrapperProps extends FilesGalleryProps {
  client: INDOCAL;
}

const FilesGalleryWrapper: React.FC<FilesGalleryWrapperProps> = (props) => (
  <FilesGalleryProvider client={props.client}>
    <FilesGallery title={props.title} files={props.files} />
  </FilesGalleryProvider>
);

export { FilesGalleryWrapper as FilesGallery };

export default FilesGalleryWrapper;
