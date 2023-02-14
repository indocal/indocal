import {
  Paper,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  Typography,
  LinearProgress,
} from '@mui/material';

import { Loader, NoData, ErrorInfo } from '@indocal/ui';
import { useInventoryMovements, UUID, UserGroup } from '@indocal/services';

// TODO: implement correctly
export const InventoryMovementsByGroupList: React.FC = () => {
  const { loading, validating, user, error } = useInventoryMovements({});

  return (
    <Paper
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      {loading ? (
        <Loader invisible message="Cargando grupos..." />
      ) : error ? (
        <ErrorInfo error={error} />
      ) : user ? (
        <>
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
            </ListSubheader>

            {user.groups.length > 0 ? (
              user.groups.map((group) => (
                <ListItem key={group.id} divider>
                  <ListItemText>{group.name}</ListItemText>
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

export default InventoryMovementsByGroupList;
