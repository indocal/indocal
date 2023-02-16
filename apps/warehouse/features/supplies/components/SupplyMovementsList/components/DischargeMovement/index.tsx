import NextLink from 'next/link';
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  SignLanguage as DischargeIcon,
  Print as PrintIcon,
} from '@mui/icons-material';

import { Can, InventoryMovement } from '@indocal/services';

import { Pages } from '@/config';

export interface DischargeMovementProps {
  movement: InventoryMovement;
  item: InventoryMovement['items'][number];
}

export const DischargeMovement: React.FC<DischargeMovementProps> = ({
  movement,
  item,
}) => (
  <ListItem dense divider>
    <Tooltip title={movement.concept}>
      <ListItemIcon>
        <Badge variant="dot" color="info" invisible={!movement.concept}>
          <DischargeIcon color="error" />
        </Badge>
      </ListItemIcon>
    </Tooltip>

    <ListItemText
      primary={new Date(movement.createdAt).toLocaleString()}
      secondary={`(${item.quantity}) ${movement.origin?.name}`}
    />

    <Can I="read" an="inventoryMovement">
      <ListItemSecondaryAction>
        <IconButton
          LinkComponent={NextLink}
          target="_blank"
          href={`${Pages.INVENTORY_MOVEMENTS}/${movement.id}`}
          size="small"
          sx={{ display: 'flex' }}
        >
          <PrintIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </Can>
  </ListItem>
);

export default DischargeMovement;
