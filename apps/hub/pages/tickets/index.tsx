import { Container } from '@mui/material';

import { Page } from '@indocal/ui';

import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const TicketsPage: EnhancedNextPage = () => (
  <Page title="Soporte técnico" transition="down">
    <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}></Container>
  </Page>
);

TicketsPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default TicketsPage;
