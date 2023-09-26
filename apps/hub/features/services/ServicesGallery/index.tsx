import { useState, useMemo } from 'react';
import { Paper, Stack, TextField } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

import { NoData } from '@indocal/ui';
import { UUID, Service } from '@indocal/services';

import { GroupServicesGallery } from './components';
import { GroupServices } from './types';

export interface ServicesGalleryProps {
  services: Service[];
}

export const ServicesGallery: React.FC<ServicesGalleryProps> = ({
  services,
}) => {
  const [search, setSearch] = useState<string>('');

  const servicesByGroup = useMemo<GroupServices[]>(() => {
    const map = new Map<UUID, GroupServices>();

    services.forEach((service) => {
      const groupServices = map.get(service.group.id);

      if (groupServices) {
        map.set(service.group.id, {
          group: service.group,
          services: groupServices.services.concat(service),
        });
      } else {
        map.set(service.group.id, {
          group: service.group,
          services: [service],
        });
      }
    });

    return Array.from(map.values());
  }, [services]);

  const filteredServicesByGroup = useMemo<GroupServices[]>(() => {
    if (!search) return servicesByGroup;

    return servicesByGroup
      .map(({ group, services: groupServices }) => {
        const services = groupServices.filter(
          (service) =>
            service.title.toLowerCase().includes(search.toLowerCase()) ||
            service.description.toLowerCase().includes(search.toLowerCase()) ||
            service.group.name.toLowerCase().includes(search.toLowerCase())
        );

        return { group, services };
      })
      .filter(({ services }) => services.length > 0);
  }, [search, servicesByGroup]);

  return (
    <Stack spacing={4}>
      <Stack
        direction="row"
        justifyContent={{ xs: 'center', md: 'flex-end' }}
        alignItems="center"
      >
        <TextField
          autoComplete="off"
          size="small"
          label="Buscar servicio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ endAdornment: <SearchIcon /> }}
        />
      </Stack>

      {filteredServicesByGroup.length > 0 ? (
        <Stack spacing={4}>
          {filteredServicesByGroup.map(({ group, services }) => (
            <GroupServicesGallery
              key={group.id}
              group={group}
              services={services}
            />
          ))}
        </Stack>
      ) : (
        <Paper sx={{ padding: (theme) => theme.spacing(4) }}>
          <NoData message="Sin servicios a mostrar" />
        </Paper>
      )}
    </Stack>
  );
};

export default ServicesGallery;
