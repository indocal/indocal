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
  HomeRepairService as AdjustmentIcon,
  Print as PrintIcon,
} from '@mui/icons-material';

import { Can, InventoryMovement } from '@indocal/services';

import { Pages } from '@/config';

export interface AdjustmentMovementProps {
  movement: InventoryMovement;
  item: InventoryMovement['items'][number];
}

export const AdjustmentMovement: React.FC<AdjustmentMovementProps> = ({
  movement,
  item,
}) => (
  <ListItem dense divider>
    <Tooltip title={movement.concept}>
      <ListItemIcon>
        <Badge variant="dot" color="info" invisible={!movement.concept}>
          <AdjustmentIcon htmlColor="purple" />
        </Badge>
      </ListItemIcon>
    </Tooltip>

    <ListItemText
      primary={new Date(movement.createdAt).toLocaleString()}
      secondary={`(${item.quantity}) Ajustes al sistema`}
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

export default AdjustmentMovement;
