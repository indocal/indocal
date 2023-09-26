import { useMemo } from 'react';
import {
  Box,
  Paper,
  Stack,
  Unstable_Grid2,
  Divider,
  AppBar,
  Toolbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Link,
  Chip,
} from '@mui/material';
import {
  FilePresent as FileIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
} from '@mui/icons-material';

import { NoData } from '@indocal/ui';
import { ServiceRequest } from '@indocal/services';

export interface ServiceRequestCommentsProps {
  request: ServiceRequest;
}

export const ServiceRequestComments: React.FC<ServiceRequestCommentsProps> = ({
  request,
}) => {
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
    <Paper
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
      }}
    >
      <AppBar
        sx={{
          position: 'relative',
          borderRadius: 'inherit',
        }}
      >
        <Toolbar sx={{ alignItems: 'center' }}>
          <Typography fontWeight="bolder">Comentarios</Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          height: '100%',
          padding: (theme) => theme.spacing(1),
          overflow: 'auto',
        }}
      >
        {request.comments.length > 0 ? (
          request.comments.map((comment) => (
            <Accordion key={comment.id}>
              <AccordionSummary>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={1}
                  sx={{ width: '100%' }}
                >
                  <Typography
                    component="pre"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {comment.content}
                  </Typography>

                  {comment.isInternal && <Chip size="small" label="Interno" />}
                </Stack>
              </AccordionSummary>

              <AccordionDetails>
                <Stack spacing={2} divider={<Divider flexItem />}>
                  <Typography variant="caption" color="text.secondary">
                    {`Escrito por ${comment.author.name} el ${new Date(
                      comment.createdAt
                    ).toLocaleString()}`}
                  </Typography>

                  {comment.attachments.length > 0 && (
                    <Unstable_Grid2 container spacing={1}>
                      {comment.attachments.map((attachment) => {
                        const [mime] = attachment.mime.split('/');

                        const url = new URL(
                          attachment.path,
                          process.env.NEXT_PUBLIC_BACKEND_URL
                        );

                        return (
                          <Unstable_Grid2 key={attachment.id}>
                            <Button
                              component={Link}
                              size="small"
                              variant="outlined"
                              href={url.toString()}
                              target="_blank"
                              startIcon={icons[mime] ?? <FileIcon />}
                              sx={{ width: 'fit-content' }}
                            >
                              {attachment.name}
                            </Button>
                          </Unstable_Grid2>
                        );
                      })}
                    </Unstable_Grid2>
                  )}
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <NoData message="Esta solicitud no contiene comentarios" />
        )}
      </Box>
    </Paper>
  );
};

export default ServiceRequestComments;
