import {
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Print as PrintIcon,
  AssignmentReturned as InputIcon,
  AssignmentReturn as OutputIcon,
  SwapHoriz as SwapIcon,
  VolunteerActivism as DiscardIcon,
} from '@mui/icons-material';

export const OutputMovement: React.FC = () => (
  <ListItem dense divider>
    <ListItemIcon>
      <OutputIcon color="info" />
    </ListItemIcon>

    <ListItemText primary="Entrega de material" secondary="Almacén -> dcruz" />

    <ListItemSecondaryAction>
      <PrintIcon />
    </ListItemSecondaryAction>
  </ListItem>
);

export default OutputMovement;
