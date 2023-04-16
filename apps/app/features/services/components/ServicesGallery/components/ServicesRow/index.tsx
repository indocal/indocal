import { Paper, Stack, Chip } from '@mui/material';

import { NoData } from '@indocal/ui';
import { Service } from '@indocal/services';

import { ServiceCard } from '../ServiceCard';

export interface ServicesRowProps {
  title: string;
  services: Service[];
}

export const ServicesRow: React.FC<ServicesRowProps> = ({
  title,
  services,
}) => (
  <Stack spacing={0.25} sx={{ width: '100%' }}>
    <Chip label={title} sx={{ width: 'fit-content' }} />

    <Stack
      direction="row"
      spacing={1}
      sx={{
        width: '100%',
        paddingY: (theme) => theme.spacing(1),
        overflow: 'auto',
      }}
    >
      {services.length > 0 ? (
        services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))
      ) : (
        <Paper sx={{ width: '100%' }}>
          <NoData message="Sin servicios" />
        </Paper>
      )}
    </Stack>
  </Stack>
);

export default ServicesRow;
