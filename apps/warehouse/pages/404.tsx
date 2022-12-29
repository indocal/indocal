import { Container } from '@mui/material';

import { Page, BasicLayout, NotFound } from '@indocal/ui';

import { Pages } from '@/config';
import { EnhancedNextPage } from '@/types';

const NotFoundPage: EnhancedNextPage = () => (
  <Page title="404: Recurso no encontrado">
    <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
      <NotFound fallbackUrl={Pages.ROOT} />
    </Container>
  </Page>
);

NotFoundPage.getLayout = (page) => <BasicLayout>{page}</BasicLayout>;

export default NotFoundPage;
