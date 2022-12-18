import NextLink from 'next/link';
import {
  Paper,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  Settings as ManageUserRoles,
  Launch as ViewDetailsIcon,
} from '@mui/icons-material';

import { Loader, NoData, ErrorInfo } from '@indocal/ui';
import { Can, useUser, UUID, User } from '@indocal/services';

import { Pages } from '@/config';

import { UserRolesListProvider, useUserRolesList } from './context';
import { ManageUserRolesDialog } from './components';

export interface UserRolesListProps {
  user: UUID | User;
}

const UserRolesList: React.FC<UserRolesListProps> = ({ user: entity }) => {
  const { loading, validating, user, error } = useUser(
    typeof entity === 'string' ? entity : entity.id
  );

  const { isManageUserRolesDialogOpen, toggleManageUserRolesDialog } =
    useUserRolesList();

  return (
    <Paper
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      {loading ? (
        <Loader message="Cargando roles..." />
      ) : error ? (
        <ErrorInfo error={error} />
      ) : user ? (
        <>
          {isManageUserRolesDialogOpen && <ManageUserRolesDialog user={user} />}

          {validating && (
            <LinearProgress
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: (theme) => theme.zIndex.modal - 1,
                width: '100%',
                borderTopLeftRadius: (theme) => theme.shape.borderRadius,
                borderTopRightRadius: (theme) => theme.shape.borderRadius,
              }}
            />
          )}

          <List
            disablePadding
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              overflowX: 'hidden',
              overflowY: 'auto',
            }}
          >
            <ListSubheader
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: (theme) => theme.spacing(1),
                padding: (theme) => theme.spacing(1.5, 2),
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="caption" fontWeight="bolder">
                Roles
              </Typography>

              <Can I="update" an="user">
                <IconButton size="small" onClick={toggleManageUserRolesDialog}>
                  <ManageUserRoles />
                </IconButton>
              </Can>
            </ListSubheader>

            {user.roles.length > 0 ? (
              user.roles.map((role) => (
                <ListItem key={role.id} dense divider>
                  <ListItemText primary={role.name} secondary={role.type} />

                  <Can I="read" an="userRole">
                    <ListItemSecondaryAction>
                      <IconButton
                        LinkComponent={NextLink}
                        href={`${Pages.USERS_ROLES}/${role.id}`}
                        size="small"
                        sx={{ display: 'flex' }}
                      >
                        <ViewDetailsIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </Can>
                </ListItem>
              ))
            ) : (
              <NoData message="El usuario no posee roles asignados" />
            )}
          </List>
        </>
      ) : (
        <NoData message="No se han encontrado datos del usuario" />
      )}
    </Paper>
  );
};

const UserRolesListWrapper: React.FC<UserRolesListProps> = (props) => (
  <UserRolesListProvider>
    <UserRolesList {...props} />
  </UserRolesListProvider>
);

export { UserRolesListWrapper as UserRolesList };

export default UserRolesListWrapper;
