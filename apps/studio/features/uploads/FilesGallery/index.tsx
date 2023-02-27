import {
  Grid,
  Stack,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
} from '@mui/material';
import { FileCopy as FileIcon } from '@mui/icons-material';

import { NoData } from '@indocal/ui';
import { File } from '@indocal/services';

export interface FilesGalleryProps {
  title: string;
  files: File[];
}

export const FilesGallery: React.FC<FilesGalleryProps> = ({ title, files }) => (
  <Grid container alignItems="center" spacing={1}>
    <Grid item xs={12}>
      <Typography variant="h6">{title}</Typography>
    </Grid>

    {files.length > 0 ? (
      files.map((file) => {
        const url = new URL(file.path, process.env.NEXT_PUBLIC_BACKEND_URL);

        return (
          <Grid key={file.id} item xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{ display: 'flex', flexDirection: 'column', height: 225 }}
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
                {file.mime.split('/')[0] !== 'audio' &&
                  file.mime.split('/')[0] !== 'image' &&
                  file.mime.split('/')[0] !== 'video' && (
                    <CardMedia component={FileIcon} fontSize="large" />
                  )}

                {file.mime.split('/')[0] === 'audio' && (
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

                {file.mime.split('/')[0] === 'image' && (
                  <CardMedia
                    component="img"
                    image={url.href}
                    alt={file.alt || file.name}
                    sx={{ height: '100%', objectFit: 'contain' }}
                  />
                )}

                {file.mime.split('/')[0] === 'video' && (
                  <CardMedia
                    component="video"
                    controls
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
                  borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <Chip
                  variant="filled"
                  size="small"
                  label={file.extension.toUpperCase()}
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
                  {file.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        );
      })
    ) : (
      <Grid item xs={12}>
        <Paper>
          <NoData />
        </Paper>
      </Grid>
    )}
  </Grid>
);

export default FilesGallery;
