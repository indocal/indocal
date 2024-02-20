import { Container } from '@mui/material';

import { Page, Widget, BasicLayout } from '@indocal/ui';

import { CertificatesSearcher } from '@/features';
import { EnhancedNextPage } from '@/types';

const DashboardPage: EnhancedNextPage = () => (
  <Page title="INDOCAL" transition="down">
    <Container
      fixed
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: '1fr',
        paddingY: (theme) => theme.spacing(2),
      }}
    >
      <Widget disableDefaultSizes>
        <CertificatesSearcher />
      </Widget>
    </Container>
  </Page>
);

DashboardPage.getLayout = (page) => <BasicLayout>{page}</BasicLayout>;

export default DashboardPage;
