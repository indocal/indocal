import { Container, Typography } from '@mui/material';

import { Page } from '@indocal/ui';

import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const DashboardPage: EnhancedNextPage = () => (
  <Page title="Dashboard" transition="down">
    <Container
      fixed
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: (theme) => theme.spacing(0.25),
        paddingY: (theme) => theme.spacing(2),
      }}
    >
      <Typography variant="h4" align="center" fontWeight="bolder">
        Bienvenido a tu dashboard 💻
      </Typography>

      <Typography variant="body1" align="center" color="text.secondary">
        Para comenzar, selecciona una opción del menú lateral.
      </Typography>
    </Container>
  </Page>
);

DashboardPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default DashboardPage;
