import { useMemo } from 'react';
import { Stack, Button, Link } from '@mui/material';
import {
  FilePresent as FileIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
} from '@mui/icons-material';

import { Loader, NotFound, ErrorInfo } from '@indocal/ui';
import { useFiles, UUID } from '@indocal/services';

export interface MultipleFilesProps {
  files: UUID[];
}

export const MultipleFiles: React.FC<MultipleFilesProps> = ({
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

  return loading ? (
    <Loader invisible message="Cargando datos..." />
  ) : error ? (
    <ErrorInfo error={error} />
  ) : files.length > 0 ? (
    <Stack direction="row" spacing={1}>
      {files.map((file) => {
        const [mime] = file.mime.split('/');

        const url = new URL(file.path, process.env.NEXT_PUBLIC_BACKEND_URL);

        return (
          <Button
            key={file.id}
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
        );
      })}
    </Stack>
  ) : (
    <NotFound />
  );
};

export default MultipleFiles;
