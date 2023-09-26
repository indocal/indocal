import NextLink from 'next/link';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Button,
} from '@mui/material';
import { Draw as RequestIcon } from '@mui/icons-material';

import { Entity, ServiceStatus, ServiceRequestStatus } from '@indocal/services';

import { Pages } from '@/config';

type Service = Entity & {
  title: string;
  description: string;
  status: ServiceStatus;
  supportedRequestStatus: ServiceRequestStatus[];
};

export interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => (
  <Card
    sx={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
    }}
  >
    <CardHeader
      title={service.title}
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
    />

    <CardContent sx={{ overflow: 'auto' }}>
      <Typography
        component="pre"
        variant="caption"
        color="text.secondary"
        sx={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {service.description}
      </Typography>
    </CardContent>

    <CardActions
      sx={{
        marginTop: 'auto',
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Button
        LinkComponent={NextLink}
        href={`${Pages.SERVICES}/${service.id}`}
        target="_blank"
        fullWidth
        size="small"
        variant="contained"
        endIcon={<RequestIcon />}
      >
        Solicitar Servicio
      </Button>
    </CardActions>
  </Card>
);

export default ServiceCard;
