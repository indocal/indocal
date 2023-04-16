import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  QueryStats as ReportsIcon,
  Launch as ViewDetailsIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

import { Service } from '@indocal/services';

export interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => (
  <Card
    sx={{
      display: 'flex',
      flexDirection: 'column',
      minWidth: { xs: 250, md: 300 },
      maxWidth: { xs: 250, md: 300 },
      height: { xs: 300, md: 350 },
    }}
  >
    <CardContent>
      <Tooltip title={service.title}>
        <Typography
          variant="h6"
          sx={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
            lineClamp: 3,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            wordBreak: 'break-word',
          }}
        >
          {service.title}
        </Typography>
      </Tooltip>

      {service.description && (
        <Tooltip title={service.description}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 7,
              lineClamp: 7,
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              wordBreak: 'break-word',
            }}
          >
            {service.description}
          </Typography>
        </Tooltip>
      )}
    </CardContent>

    <CardActions
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 'auto',
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <IconButton>
        <ReportsIcon />
      </IconButton>

      <IconButton>
        <ViewDetailsIcon />
      </IconButton>

      <IconButton>
        <EditIcon />
      </IconButton>
    </CardActions>
  </Card>
);

export default ServiceCard;
