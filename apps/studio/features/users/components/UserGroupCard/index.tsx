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
  useUserGroup,
  getShortUUID,
  UUID,
  UserGroup,
} from '@indocal/services';

import { Pages } from '@/config';

import { UserGroupCardProvider, useUserGroupCard } from './context';
import { EditUserGroupDialog } from './components';

export interface UserGroupCardProps {
  group: UUID | UserGroup;
}

const UserGroupCard: React.FC<UserGroupCardProps> = ({ group: entity }) => {
  const { loading, validating, group, error } = useUserGroup(
    typeof entity === 'string' ? entity : entity.id
  );

  const { isEditUserGroupDialogOpen, toggleEditUserGroupDialog } =
    useUserGroupCard();

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
        <Loader invisible message="Cargando datos del grupo..." />
      ) : error ? (
        <ErrorInfo error={error} />
      ) : group ? (
        <>
          {isEditUserGroupDialogOpen && <EditUserGroupDialog group={group} />}

          {validating && (
            <LinearProgress
              sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
            />
          )}

          <CardHeader
            subheader="Detalles del grupo"
            action={
              <Stack direction="row" alignItems="center" spacing={0.25}>
                <Can I="read" an="userGroup">
                  <IconButton
                    LinkComponent={NextLink}
                    href={`${Pages.USERS_GROUPS}/${group.id}`}
                    size="small"
                    sx={{ display: 'flex' }}
                  >
                    <ViewDetailsIcon />
                  </IconButton>
                </Can>

                <Can I="update" an="userGroup">
                  <IconButton size="small" onClick={toggleEditUserGroupDialog}>
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
                <ListItemText primary="ID" secondary={getShortUUID(group.id)} />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText primary="Grupo" secondary={group.name} />
              </ListItem>

              {group.description && (
                <ListItem disablePadding>
                  <ListItemText
                    primary="Descripción"
                    secondary={group.description}
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
              )}

              <ListItem disablePadding>
                <ListItemText
                  primary="Fecha de creación"
                  secondary={new Date(group.createdAt).toLocaleDateString()}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText
                  primary="Última modificación"
                  secondary={new Date(group.updatedAt).toLocaleDateString()}
                />
              </ListItem>
            </List>
          </CardContent>
        </>
      ) : (
        <NoData message="No se han encontrado datos del grupo" />
      )}
    </Card>
  );
};

const UserGroupCardWrapper: React.FC<UserGroupCardProps> = (props) => (
  <UserGroupCardProvider>
    <UserGroupCard {...props} />
  </UserGroupCardProvider>
);

export { UserGroupCardWrapper as UserGroupCard };

export default UserGroupCardWrapper;
