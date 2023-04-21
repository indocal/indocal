import {
  Box,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Button,
} from '@mui/material';

import { getShortUUID, Log } from '@indocal/services';

import { ApiTokenCard, UserCard } from '@/features';

import { useGenericLogsDataGrid } from '../../context';

export interface LogDetailsDialogProps {
  log: Log;
}

export const LogDetailsDialog: React.FC<LogDetailsDialogProps> = ({ log }) => {
  const { isLogDetailsDialogOpen, toggleLogDetailsDialog } =
    useGenericLogsDataGrid();

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={isLogDetailsDialogOpen}
      onClose={toggleLogDetailsDialog}
    >
      <DialogTitle>Detalles del registro</DialogTitle>

      <DialogContent dividers>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1}
          divider={<Divider flexItem />}
        >
          <Box sx={{ flex: 7 }}>
            <List disablePadding>
              <ListItem dense disableGutters divider>
                <ListItemText primary="ID" secondary={getShortUUID(log.id)} />
              </ListItem>

              <ListItem dense disableGutters divider>
                <ListItemText primary="Contexto" secondary={log.context} />
              </ListItem>

              <ListItem dense disableGutters divider>
                <ListItemText primary="Acción" secondary={log.action} />
              </ListItem>

              <ListItem dense disableGutters divider>
                <ListItemText
                  primary="Fecha y hora"
                  secondary={new Date(log.createdAt).toLocaleString()}
                />
              </ListItem>

              <ListItem dense disableGutters divider>
                <ListItemText
                  primary="Metadatos"
                  secondary={JSON.stringify(log.metadata, null, 2)}
                  secondaryTypographyProps={{
                    component: 'pre',
                    sx: { whiteSpace: 'pre-wrap', wordBreak: 'break-word' },
                  }}
                />
              </ListItem>
            </List>
          </Box>

          {log.authentication &&
            (log.authentication.type === 'api-token' ? (
              <Box sx={{ flex: 5, height: 'fit-content' }}>
                <ApiTokenCard apiToken={log.authentication.apiToken.id} />
              </Box>
            ) : (
              <Box sx={{ flex: 5, height: 'fit-content' }}>
                <UserCard user={log.authentication.user.id} />
              </Box>
            ))}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={toggleLogDetailsDialog}
        >
          Finalizar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogDetailsDialog;
