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

export const InputMovement: React.FC = () => (
  <ListItem dense divider>
    <ListItemIcon>
      <InputIcon color="success" />
    </ListItemIcon>

    <ListItemText primary="Recepción" secondary="OmegaTech -> Almacén" />

    <ListItemSecondaryAction>
      <PrintIcon />
    </ListItemSecondaryAction>
  </ListItem>
);

export default InputMovement;
