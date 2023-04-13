import { useState, useMemo } from 'react';
import {
  Paper,
  Stack,
  Unstable_Grid2,
  Divider,
  Autocomplete,
  TextField,
  Chip,
  debounce,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

import { NoData } from '@indocal/ui';
import { Form, FormVisibility } from '@indocal/services';

import { FormsRow } from './components';

export interface FormsGalleryProps {
  forms: Form[];
}

export const FormsGallery: React.FC<FormsGalleryProps> = ({ forms }) => {
  const [search, setSearch] = useState<string>('');
  const [visibility, setVisibility] = useState<FormVisibility | null>(null);

  const formsByGroup: Array<{ group: Form['group']; forms: Form[] }> =
    useMemo(() => {
      const groups = new Map<string, Form['group']>();

      forms.forEach((form) => {
        if (!groups.has(form.group.id)) {
          groups.set(form.group.id, form.group);
        }
      });

      return Array.from(groups.values())
        .map((group) => ({
          group,
          forms: forms.filter((form) => {
            const visibilityMatch =
              visibility === null || form.visibility === visibility;

            const searchMatch =
              !search ||
              form.id.toLowerCase().includes(search.toLowerCase()) ||
              form.title.toLowerCase().includes(search.toLowerCase());

            return visibilityMatch && searchMatch && form.group.id === group.id;
          }),
        }))
        .filter(({ forms }) => forms.length > 0);
    }, [forms, search, visibility]);

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
          >
            <Unstable_Grid2>
              <Chip
                label="Todos"
                variant={visibility === null ? 'filled' : 'outlined'}
                onClick={() => setVisibility(null)}
              />
            </Unstable_Grid2>

            <Unstable_Grid2>
              <Chip
                label="Públicos"
                variant={visibility === 'PUBLIC' ? 'filled' : 'outlined'}
                onClick={() => setVisibility('PUBLIC')}
              />
            </Unstable_Grid2>

            <Unstable_Grid2>
              <Chip
                label="Internos"
                variant={visibility === 'PROTECTED' ? 'filled' : 'outlined'}
                onClick={() => setVisibility('PROTECTED')}
              />
            </Unstable_Grid2>

            <Unstable_Grid2>
              <Chip
                label="Privados"
                variant={visibility === 'PRIVATE' ? 'filled' : 'outlined'}
                onClick={() => setVisibility('PRIVATE')}
              />
            </Unstable_Grid2>
          </Unstable_Grid2>

          <Unstable_Grid2>
            <Autocomplete
              freeSolo
              size="small"
              options={[]}
              onInputChange={debounce((e) => setSearch(e.target.value), 500)}
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
          {formsByGroup.length > 0 ? (
            formsByGroup.map(({ group, forms }) => (
              <FormsRow key={group.id} title={group.name} forms={forms} />
            ))
          ) : (
            <Paper sx={{ padding: (theme) => theme.spacing(4) }}>
              <NoData message="Sin formularios a mostrar" />
            </Paper>
          )}
        </Stack>
      </Stack>
    </>
  );
};

export default FormsGallery;
