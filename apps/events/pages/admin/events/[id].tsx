import { Container } from '@mui/material';

import { Page } from '@indocal/ui';

import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const EventPage: EnhancedNextPage = () => (
  <Page title="Evento ###" transition="right">
    <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }} />
  </Page>
);

EventPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default EventPage;
