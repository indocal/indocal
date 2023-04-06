import { Container } from '@mui/material';

import { Page } from '@indocal/ui';

import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const DashboardPage: EnhancedNextPage = () => (
  <Page title="Dashboard" transition="down">
    <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }} />
  </Page>
);

DashboardPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default DashboardPage;
