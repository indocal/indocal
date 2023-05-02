import { useState, useMemo } from 'react';
import {
  Paper,
  Stack,
  Unstable_Grid2,
  Divider,
  Autocomplete,
  TextField,
  debounce,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

import { NoData } from '@indocal/ui';
import { Service } from '@indocal/services';

import { ServicesRow } from './components';

export interface ServicesGalleryProps {
  services: Service[];
}

export const ServicesGallery: React.FC<ServicesGalleryProps> = ({
  services,
}) => {
  const [search, setSearch] = useState<string>('');

  const servicesByGroup: Array<{
    group: Service['group'];
    services: Service[];
  }> = useMemo(() => {
    const groups = new Map<string, Service['group']>();

    services.forEach((service) => {
      if (!groups.has(service.group.id)) {
        groups.set(service.group.id, service.group);
      }
    });

    return Array.from(groups.values())
      .map((group) => ({
        group,
        services: services.filter((service) => {
          const searchMatch =
            !search ||
            service.id.toLowerCase().includes(search.toLowerCase()) ||
            service.title.toLowerCase().includes(search.toLowerCase());

          return searchMatch && service.group.id === group.id;
        }),
      }))
      .filter(({ services }) => services.length > 0);
  }, [services, search]);

  return (
    <>
      <Stack spacing={2} divider={<Divider flexItem />}>
        <Unstable_Grid2
          container
          justifyContent={{ xs: 'center', md: 'space-between' }}
          alignItems="center"
          spacing={1}
        >
          <Unstable_Grid2
            container
            justifyContent={{ xs: 'center', md: 'flex-start' }}
            alignContent="center"
            spacing={1}
          ></Unstable_Grid2>

          <Unstable_Grid2>
            <Autocomplete
              freeSolo
              size="small"
              options={[]}
              onInputChange={debounce((_, value) => setSearch(value), 400)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Buscar..."
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        <SearchIcon />
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              sx={{ width: 225 }}
            />
          </Unstable_Grid2>
        </Unstable_Grid2>

        <Stack spacing={2} divider={<Divider flexItem />}>
          {servicesByGroup.length > 0 ? (
            servicesByGroup.map(({ group, services }) => (
              <ServicesRow
                key={group.id}
                title={group.name}
                services={services}
              />
            ))
          ) : (
            <Paper sx={{ padding: (theme) => theme.spacing(4) }}>
              <NoData message="Sin servicios a mostrar" />
            </Paper>
          )}
        </Stack>
      </Stack>
    </>
  );
};

export default ServicesGallery;
