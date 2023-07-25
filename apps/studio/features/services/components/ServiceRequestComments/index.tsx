import { useState, useMemo, useCallback } from 'react';
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
  AccordionActions,
  Typography,
  Button,
  IconButton,
  Link,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  AddCircle as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilePresent as FileIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useConfirm } from 'material-ui-confirm';
import { useSWRConfig } from 'swr';

import { Loader, NoData, ErrorInfo } from '@indocal/ui';
import {
  Can,
  useServiceRequest,
  UUID,
  ServiceRequest,
  ApiEndpoints,
} from '@indocal/services';

import { indocal } from '@/lib';

import {
  ServiceRequestCommentsProvider,
  useServiceRequestComments,
} from './context';
import { AddCommentDialog, EditCommentDialog } from './components';

export interface ServiceRequestCommentsProps {
  request: UUID | ServiceRequest;
}

const ServiceRequestComments: React.FC<ServiceRequestCommentsProps> = ({
  request: entity,
}) => {
  const { loading, validating, request, error } = useServiceRequest(
    typeof entity === 'string' ? entity : entity.id
  );

  const { mutate } = useSWRConfig();

  const {
    isAddCommentDialogOpen,
    isEditCommentDialogOpen,
    toggleAddCommentDialog,
    toggleEditCommentDialog,
  } = useServiceRequestComments();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const icons = useMemo<Record<string, React.ReactElement>>(
    () => ({
      text: <FileIcon />,
      image: <ImageIcon />,
      video: <VideoIcon />,
      audio: <AudioIcon />,
    }),
    []
  );

  const [comment, setComment] = useState<
    ServiceRequest['comments'][number] | null
  >(null);

  const handleEdit = useCallback(
    (comment: ServiceRequest['comments'][number]) => {
      setComment(comment);
      toggleEditCommentDialog();
    },
    [toggleEditCommentDialog]
  );

  const handleDelete = useCallback(
    (id: UUID) => {
      confirm({
        title: 'Eliminar comentario',
        description: '¿Estás seguro de que deseas eliminar este comentario?',
      })
        .then(async () => {
          const { error } = await indocal.comments.delete(id);

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
            await mutate(`${ApiEndpoints.SERVICES_REQUESTS}/${request?.id}`);

            enqueueSnackbar('Comentario eliminado exitosamente', {
              variant: 'success',
            });
          }
        })
        .catch(() => undefined);
    },
    [request?.id, mutate, enqueueSnackbar, confirm]
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
      {loading ? (
        <Loader invisible message="Cargando comentarios..." />
      ) : error ? (
        <ErrorInfo error={error} />
      ) : request ? (
        <>
          {isAddCommentDialogOpen && <AddCommentDialog request={request} />}

          {isEditCommentDialogOpen && comment && (
            <EditCommentDialog request={request} comment={comment} />
          )}

          {validating && (
            <LinearProgress
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: (theme) => theme.zIndex.appBar + 1,
              }}
            />
          )}

          <AppBar
            sx={{
              position: 'relative',
              borderRadius: 'inherit',
            }}
          >
            <Toolbar
              sx={{
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: (theme) => theme.spacing(1),
              }}
            >
              <Typography fontWeight="bolder">Comentarios</Typography>

              <Can I="create" a="serviceRequest">
                <IconButton color="inherit" onClick={toggleAddCommentDialog}>
                  <AddIcon />
                </IconButton>
              </Can>
            </Toolbar>
          </AppBar>

          <Box sx={{ padding: (theme) => theme.spacing(1) }}>
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

                      {comment.isInternal && (
                        <Chip size="small" label="Interno" />
                      )}
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

                  <AccordionActions
                    sx={{
                      borderTop: (theme) =>
                        `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      color="error"
                      endIcon={<DeleteIcon />}
                      onClick={() => handleDelete(comment.id)}
                    >
                      Eliminar
                    </Button>

                    <Button
                      variant="contained"
                      size="small"
                      endIcon={<EditIcon />}
                      onClick={() => handleEdit(comment)}
                    >
                      Editar
                    </Button>
                  </AccordionActions>
                </Accordion>
              ))
            ) : (
              <NoData message="Esta solicitud no contiene comentarios" />
            )}
          </Box>
        </>
      ) : (
        <NoData message="No se han encontrado comentarios" />
      )}
    </Paper>
  );
};

const ServiceRequestCommentsWrapper: React.FC<ServiceRequestCommentsProps> = (
  props
) => (
  <ServiceRequestCommentsProvider>
    <ServiceRequestComments {...props} />
  </ServiceRequestCommentsProvider>
);

export { ServiceRequestCommentsWrapper as ServiceRequestComments };

export default ServiceRequestCommentsWrapper;
