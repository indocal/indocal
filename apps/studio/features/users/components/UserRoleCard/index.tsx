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
  Link as MuiLink,
  LinearProgress,
} from '@mui/material';
import { Handyman as ManageIcon, Edit as EditIcon } from '@mui/icons-material';

import { Loader, NoData, ErrorInfo } from '@indocal/ui';
import { useUserRole, getShortUUID, UUID, UserRole } from '@indocal/services';

import { Pages } from '@/config';

import { UserRoleCardProvider, useUserRoleCard } from './context';
import { EditUserRoleDialog } from './components';

export interface UserRoleCardProps {
  role: UUID | UserRole;
}

const UserRoleCard: React.FC<UserRoleCardProps> = ({ role: entity }) => {
  const { loading, validating, role, error } = useUserRole(
    typeof entity === 'string' ? entity : entity.id
  );

  const { isEditUserRoleDialogOpen, toggleEditUserRoleDialog } =
    useUserRoleCard();

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
        <Loader invisible message="Cargando datos del rol..." />
      ) : error ? (
        <ErrorInfo error={error} />
      ) : role ? (
        <>
          {isEditUserRoleDialogOpen && <EditUserRoleDialog role={role} />}

          {validating && (
            <LinearProgress
              sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
            />
          )}

          <CardHeader
            subheader="Detalles del rol"
            action={
              <Stack direction="row" alignItems="center" spacing={0.25}>
                <NextLink passHref href={Pages.USERS_ROLES}>
                  <IconButton
                    LinkComponent={MuiLink}
                    size="small"
                    sx={{ display: 'flex' }}
                  >
                    <ManageIcon />
                  </IconButton>
                </NextLink>

                <IconButton size="small" onClick={toggleEditUserRoleDialog}>
                  <EditIcon />
                </IconButton>
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
                <ListItemText primary="ID" secondary={getShortUUID(role.id)} />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText
                  primary="Rol"
                  secondary={`${role.name} (${role.type})`}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText
                  primary="Descripción"
                  secondary={role.description}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText
                  primary="Fecha de creación"
                  secondary={new Date(role.createdAt).toLocaleDateString()}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText
                  primary="Última modificación"
                  secondary={new Date(role.updatedAt).toLocaleDateString()}
                />
              </ListItem>
            </List>
          </CardContent>
        </>
      ) : (
        <NoData message="No se han encontrado datos del rol" />
      )}
    </Card>
  );
};

const UserRoleCardWrapper: React.FC<UserRoleCardProps> = (props) => (
  <UserRoleCardProvider>
    <UserRoleCard {...props} />
  </UserRoleCardProvider>
);

export { UserRoleCardWrapper as UserRoleCard };

export default UserRoleCardWrapper;
