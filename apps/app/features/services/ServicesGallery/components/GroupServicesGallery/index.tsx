import { Box, Paper, Stack, Divider, Typography } from '@mui/material';

import { NoData } from '@indocal/ui';

import { ServiceCard } from '@/features';

import { GroupServices } from '../../types';

export type GroupServicesGalleryProps = GroupServices;

export const GroupServicesGallery: React.FC<GroupServicesGalleryProps> = ({
  group,
  services,
}) => (
  <Stack spacing={0.5} divider={<Divider flexItem />}>
    <Typography variant="h5" sx={{ fontWeight: 'bolder' }}>
      {group.name}
    </Typography>

    {services.length > 0 ? (
      <Stack
        direction="row"
        spacing={1}
        sx={{ paddingY: (theme) => theme.spacing(0.5), overflow: 'auto' }}
      >
        {services.map((service) => (
          <Box key={service.id} sx={{ minWidth: 350, width: 350, height: 400 }}>
            <ServiceCard service={service} />
          </Box>
        ))}
      </Stack>
    ) : (
      <Paper sx={{ padding: (theme) => theme.spacing(2) }}>
        <NoData message="Sin servicios a mostrar" />
      </Paper>
    )}
  </Stack>
);

export default GroupServicesGallery;
