import { useCallback } from 'react';
import NextLink from 'next/link';
import {
  Stack,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  Launch as ViewDetailsIcon,
  Edit as EditIcon,
  ContentCopy as CopyToClipboardIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';

import { Loader, NoData, ErrorInfo } from '@indocal/ui';
import {
  Can,
  useApiToken,
  getShortUUID,
  translateApiTokenType,
  translateApiTokenStatus,
  UUID,
  ApiToken,
} from '@indocal/services';

import { indocal } from '@/lib';
import { Pages } from '@/config';

import { ApiTokenCardProvider, useApiTokenCard } from './context';
import { EditApiTokenDialog } from './components';

export interface ApiTokenCardProps {
  apiToken: UUID | ApiToken;
}

const ApiTokenCard: React.FC<ApiTokenCardProps> = ({ apiToken: entity }) => {
  const { loading, validating, apiToken, error } = useApiToken(
    typeof entity === 'string' ? entity : entity.id
  );

  const { isEditApiTokenDialogOpen, toggleEditApiTokenDialog } =
    useApiTokenCard();

  const { enqueueSnackbar } = useSnackbar();

  const handleCopyToClipboard = useCallback(async () => {
    try {
      if (!apiToken) return;

      const { access_token, error } =
        await indocal.auth.apiTokens.getAccessToken(apiToken.id);

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
        await navigator.clipboard.writeText(access_token as string);

        enqueueSnackbar('Token de acceso copiado', {
          variant: 'info',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      }
    } catch {
      enqueueSnackbar('Error al copiar el token de acceso', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
      });
    }
  }, [apiToken, enqueueSnackbar]);

  return (
    <Card
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
      }}
    >
      {loading ? (
        <Loader invisible message="Cargando datos del token..." />
      ) : error ? (
        <ErrorInfo error={error} />
      ) : apiToken ? (
        <>
          {isEditApiTokenDialogOpen && (
            <EditApiTokenDialog apiToken={apiToken} />
          )}

          {validating && (
            <LinearProgress
              sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
            />
          )}

          <CardHeader
            subheader="Detalles del API Token"
            action={
              <Stack direction="row" alignItems="center" spacing={0.25}>
                <Can I="read" an="apiToken">
                  <IconButton
                    LinkComponent={NextLink}
                    href={`${Pages.API_TOKENS}/${apiToken.id}`}
                    size="small"
                    sx={{ display: 'flex' }}
                  >
                    <ViewDetailsIcon />
                  </IconButton>
                </Can>

                <Can I="update" an="apiToken">
                  <IconButton size="small" onClick={toggleEditApiTokenDialog}>
                    <EditIcon />
                  </IconButton>
                </Can>
              </Stack>
            }
            sx={{
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          />

          <CardContent
            sx={{
              position: 'relative',
              height: '100%',
              overflow: 'auto',
            }}
          >
            <List disablePadding>
              <ListItem disablePadding>
                <ListItemText
                  primary="ID"
                  secondary={getShortUUID(apiToken.id)}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText primary="Nombre" secondary={apiToken.name} />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText
                  primary="Descripción"
                  secondary={apiToken.description}
                  secondaryTypographyProps={{
                    component: 'pre',
                    variant: 'caption',
                    color: 'text.secondary',
                    sx: {
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    },
                  }}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText
                  primary="Tipo"
                  secondary={translateApiTokenType(apiToken.type)}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText
                  primary="Estado"
                  secondary={translateApiTokenStatus(apiToken.status)}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText
                  primary="Fecha de creación"
                  secondary={new Date(apiToken.createdAt).toLocaleDateString()}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText
                  primary="Última modificación"
                  secondary={new Date(apiToken.updatedAt).toLocaleDateString()}
                />
              </ListItem>
            </List>
          </CardContent>

          <Can do="get-access-token" on="apiToken">
            <CardActions>
              <Button
                fullWidth
                size="small"
                variant="contained"
                endIcon={<CopyToClipboardIcon />}
                onClick={handleCopyToClipboard}
              >
                Copiar token de acceso
              </Button>
            </CardActions>
          </Can>
        </>
      ) : (
        <NoData message="No se han encontrado datos del token" />
      )}
    </Card>
  );
};

const ApiTokenCardWrapper: React.FC<ApiTokenCardProps> = (props) => (
  <ApiTokenCardProvider>
    <ApiTokenCard {...props} />
  </ApiTokenCardProvider>
);

export { ApiTokenCardWrapper as ApiTokenCard };

export default ApiTokenCardWrapper;
