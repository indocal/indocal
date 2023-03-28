import { useMemo } from 'react';
import { Grid, Typography, Button, Link } from '@mui/material';
import {
  FilePresent as FileIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
} from '@mui/icons-material';

import { Loader, NotFound, ErrorInfo } from '@indocal/ui';
import { useFiles, UUID } from '@indocal/services';

export interface LastFilesAnswersProps {
  files: UUID[];
}

export const LastFilesAnswers: React.FC<LastFilesAnswersProps> = ({
  files: uuids,
}) => {
  const { loading, files, error } = useFiles({
    filters: { id: { in: uuids } },
  });

  const icons = useMemo<Record<string, React.ReactElement>>(
    () => ({
      text: <FileIcon />,
      image: <ImageIcon />,
      video: <VideoIcon />,
      audio: <AudioIcon />,
    }),
    []
  );

  return (
    <>
      {loading ? (
        <Loader invisible message="Cargando datos..." />
      ) : error ? (
        <ErrorInfo error={error} />
      ) : files.length > 0 ? (
        <>
          <Typography variant="h6" align="center">
            Ultimas respuestas
          </Typography>

          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            {files.map((file) => {
              const url = new URL(
                file.path,
                process.env.NEXT_PUBLIC_BACKEND_URL
              );

              return (
                <Grid key={file.id} item>
                  <Button
                    key={file.id}
                    component={Link}
                    size="small"
                    variant="outlined"
                    href={url.toString()}
                    target="_blank"
                    startIcon={icons[file.mime.split('/')[0]] ?? <FileIcon />}
                    sx={{ width: 'fit-content' }}
                  >
                    {file.name}
                  </Button>
                </Grid>
              );
            })}
          </Grid>
        </>
      ) : (
        <NotFound />
      )}
    </>
  );
};

export default LastFilesAnswers;
