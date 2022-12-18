import NextLink from 'next/link';
import {
  Stack,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  Launch as ViewDetailsIcon,
  Edit as EditIcon,
  Mail as MailIcon,
} from '@mui/icons-material';

import { Loader, NoData, ErrorInfo } from '@indocal/ui';
import {
  Can,
  useUser,
  getShortUUID,
  translateUserStatus,
  UUID,
  User,
} from '@indocal/services';

import { Pages } from '@/config';

import { UserCardProvider, useUserCard } from './context';
import { EditUserDialog } from './components';

export interface UserCardProps {
  user: UUID | User;
}

const UserCard: React.FC<UserCardProps> = ({ user: entity }) => {
  const { loading, validating, user, error } = useUser(
    typeof entity === 'string' ? entity : entity.id
  );

  const { isEditUserDialogOpen, toggleEditUserDialog } = useUserCard();

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
        <Loader invisible message="Cargando datos del usuario..." />
      ) : error ? (
        <ErrorInfo error={error} />
      ) : user ? (
        <>
          {isEditUserDialogOpen && <EditUserDialog user={user} />}

          {validating && (
            <LinearProgress
              sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
            />
          )}

          <CardHeader
            subheader="Detalles del usuario"
            action={
              <Stack direction="row" alignItems="center" spacing={0.25}>
                <Can I="read" an="user">
                  <IconButton
                    LinkComponent={NextLink}
                    href={`${Pages.USERS}/${user.id}`}
                    size="small"
                    sx={{ display: 'flex' }}
                  >
                    <ViewDetailsIcon />
                  </IconButton>
                </Can>

                <Can I="update" an="user">
                  <IconButton size="small" onClick={toggleEditUserDialog}>
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
                <ListItemText primary="ID" secondary={getShortUUID(user.id)} />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText primary="Usuario" secondary={user.username} />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText
                  primary="Correo electrónico"
                  secondary={user.email}
                />

                <ListItemSecondaryAction>
                  <IconButton href={`mailto:${user.email}`}>
                    <MailIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem disablePadding>
                <ListItemText
                  primary="Estado"
                  secondary={translateUserStatus(user.status)}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText
                  primary="Fecha de creación"
                  secondary={new Date(user.createdAt).toLocaleDateString()}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText
                  primary="Última modificación"
                  secondary={new Date(user.updatedAt).toLocaleDateString()}
                />
              </ListItem>
            </List>
          </CardContent>
        </>
      ) : (
        <NoData message="No se han encontrado datos del usuario" />
      )}
    </Card>
  );
};

const UserCardWrapper: React.FC<UserCardProps> = (props) => (
  <UserCardProvider>
    <UserCard {...props} />
  </UserCardProvider>
);

export { UserCardWrapper as UserCard };

export default UserCardWrapper;
