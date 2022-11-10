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
  Link as MuiLink,
  LinearProgress,
} from '@mui/material';
import {
  Settings as ManageUserGroups,
  Launch as ViewDetailsIcon,
} from '@mui/icons-material';

import { Loader, NoData, ErrorInfo } from '@indocal/ui';
import { useUser, UUID, User } from '@indocal/services';

import { Pages } from '@/config';

import { UserGroupsListProvider, useUserGroupsList } from './context';
import { ManageUserGroupsDialog } from './components';

export interface UserGroupsListProps {
  user: UUID | User;
}

const UserGroupsList: React.FC<UserGroupsListProps> = ({ user: entity }) => {
  const { loading, validating, user, error } = useUser(
    typeof entity === 'string' ? entity : entity.id
  );

  const { isManageUserGroupsDialogOpen, toggleManageUserGroupsDialog } =
    useUserGroupsList();

  return (
    <Paper
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      {loading ? (
        <Loader message="Cargando grupos..." />
      ) : error ? (
        <ErrorInfo error={error} />
      ) : user ? (
        <>
          {isManageUserGroupsDialogOpen && (
            <ManageUserGroupsDialog user={user} />
          )}

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
                Grupos
              </Typography>

              <IconButton size="small" onClick={toggleManageUserGroupsDialog}>
                <ManageUserGroups />
              </IconButton>
            </ListSubheader>

            {user.groups.length > 0 ? (
              user.groups.map((group) => (
                <ListItem key={group.id} divider>
                  <ListItemText>{group.name}</ListItemText>

                  <ListItemSecondaryAction>
                    <NextLink
                      passHref
                      href={`${Pages.USERS_GROUPS}/${group.id}`}
                    >
                      <IconButton
                        LinkComponent={MuiLink}
                        size="small"
                        sx={{ display: 'flex' }}
                      >
                        <ViewDetailsIcon />
                      </IconButton>
                    </NextLink>
                  </ListItemSecondaryAction>
                </ListItem>
              ))
            ) : (
              <NoData message="El usuario no pertenece a ningún grupo" />
            )}
          </List>
        </>
      ) : (
        <NoData message="No se han encontrado datos del usuario" />
      )}
    </Paper>
  );
};

const UserGroupsListWrapper: React.FC<UserGroupsListProps> = (props) => (
  <UserGroupsListProvider>
    <UserGroupsList {...props} />
  </UserGroupsListProvider>
);

export { UserGroupsListWrapper as UserGroupsList };

export default UserGroupsListWrapper;
