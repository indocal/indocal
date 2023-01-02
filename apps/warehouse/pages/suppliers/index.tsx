import { Container } from '@mui/material';

import { Page } from '@indocal/ui';

import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const SuppliersPage: EnhancedNextPage = () => (
  <Page title="Suplidores" transition="down">
    <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }} />
  </Page>
);

SuppliersPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default SuppliersPage;
