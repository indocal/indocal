import NextLink from 'next/link';
import {
  Stack,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  Launch as ViewDetailsIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

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
