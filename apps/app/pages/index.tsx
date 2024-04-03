import { Container, Typography } from '@mui/material';

import { Page, Widget, BasicLayout } from '@indocal/ui';

import { CertificatesSearcher } from '@/features';
import { EnhancedNextPage } from '@/types';

const DashboardPage: EnhancedNextPage = () => (
  <Page title="INDOCAL" transition="down">
    <Container fixed sx={{ width: 500, paddingY: 4 }}>
      <Typography variant="h4" textAlign="center" sx={{ marginBottom: 2 }}>
        Consultar certificados
      </Typography>

      <Widget disableDefaultSizes>
        <CertificatesSearcher />
      </Widget>
    </Container>
  </Page>
);

DashboardPage.getLayout = (page) => <BasicLayout>{page}</BasicLayout>;

export default DashboardPage;
