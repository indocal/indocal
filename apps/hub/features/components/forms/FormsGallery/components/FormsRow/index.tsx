import { Paper, Stack, Chip } from '@mui/material';

import { NoData } from '@indocal/ui';
import { Form } from '@indocal/services';

import { FormCard } from '../FormCard';

export interface FormsRowProps {
  title: string;
  forms: Form[];
}

export const FormsRow: React.FC<FormsRowProps> = ({ title, forms }) => (
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
      {forms.length > 0 ? (
        forms.map((form) => <FormCard key={form.id} form={form} />)
      ) : (
        <Paper sx={{ width: '100%' }}>
          <NoData message="Sin formularios" />
        </Paper>
      )}
    </Stack>
  </Stack>
);

export default FormsRow;
