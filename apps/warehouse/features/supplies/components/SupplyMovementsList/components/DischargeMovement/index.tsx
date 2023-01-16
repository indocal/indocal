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

export const DischargeMovement: React.FC = () => (
  <ListItem dense divider>
    <ListItemIcon>
      <DiscardIcon color="error" />
    </ListItemIcon>

    <ListItemText primary="Descargo" secondary="dcruz -> Almacén" />

    <ListItemSecondaryAction>
      <PrintIcon />
    </ListItemSecondaryAction>
  </ListItem>
);

export default DischargeMovement;
