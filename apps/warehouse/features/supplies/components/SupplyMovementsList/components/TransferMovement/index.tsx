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

export const TransferMovement: React.FC = () => (
  <ListItem dense divider>
    <ListItemIcon>
      <SwapIcon color="warning" />
    </ListItemIcon>

    <ListItemText primary="Transpaso" secondary="dcruz -> ahernandez" />

    <ListItemSecondaryAction>
      <PrintIcon />
    </ListItemSecondaryAction>
  </ListItem>
);

export default TransferMovement;
