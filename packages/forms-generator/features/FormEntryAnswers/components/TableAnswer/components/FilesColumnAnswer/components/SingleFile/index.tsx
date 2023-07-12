import { useMemo } from 'react';
import { Button, Link } from '@mui/material';
import {
  FilePresent as FileIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
} from '@mui/icons-material';

import { Loader, NotFound, ErrorInfo } from '@indocal/ui';
import { useFile, UUID } from '@indocal/services';

export interface SingleFileProps {
  file: UUID;
}

export const SingleFile: React.FC<SingleFileProps> = ({ file: uuid }) => {
  const { loading, file, error } = useFile(uuid);

  const icons = useMemo<Record<string, React.ReactElement>>(
    () => ({
      text: <FileIcon />,
      image: <ImageIcon />,
      video: <VideoIcon />,
      audio: <AudioIcon />,
    }),
    []
  );

  const [mime] = file ? file.mime.split('/') : [];

  const url = useMemo(
    () => new URL(file ? file.path : uuid, process.env.NEXT_PUBLIC_BACKEND_URL),
    [uuid, file]
  );

  return loading ? (
    <Loader invisible message="Cargando datos..." />
  ) : error ? (
    <ErrorInfo error={error} />
  ) : file ? (
    <Button
      component={Link}
      size="small"
      variant="outlined"
      href={url.toString()}
      target="_blank"
      startIcon={icons[mime] ?? <FileIcon />}
      sx={{ width: 'fit-content' }}
    >
      {file.name}
    </Button>
  ) : (
    <NotFound />
  );
};

export default SingleFile;
