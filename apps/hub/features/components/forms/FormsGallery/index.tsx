import { useMemo } from 'react';
import { Paper, Grid } from '@mui/material';

import { Widget, NoData } from '@indocal/ui';
import { Form } from '@indocal/services';

import { GroupFormsList } from './components';

export interface FormsGalleryProps {
  forms: Form[];
}

export const FormsGallery: React.FC<FormsGalleryProps> = ({ forms }) => {
  const formsByGroup: Array<{ group: Form['group']; forms: Form[] }> =
    useMemo(() => {
      const groups = Array.from(new Set(forms.map((form) => form.group)));

      return groups.map((group) => ({
        group,
        forms: forms.filter((form) => form.group.id === group.id),
      }));
    }, [forms]);

  return (
    <>
      {forms.length > 0 ? (
        <Grid container justifyContent="center" alignItems="center" spacing={1}>
          {formsByGroup.map(({ group, forms }) => (
            <Grid key={group.id} item xs={12} md={4}>
              <Widget>
                <GroupFormsList group={group} forms={forms} />
              </Widget>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ margin: 'auto', padding: (theme) => theme.spacing(4) }}>
          <NoData message="Sin formularios" />
        </Paper>
      )}
    </>
  );
};

export default FormsGallery;
