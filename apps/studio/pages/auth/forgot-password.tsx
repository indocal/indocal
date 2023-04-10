import { Container } from '@mui/material';

import { Page, BasicLayout } from '@indocal/ui';

import { ForgotPassword } from '@/auth';
import { EnhancedNextPage } from '@/types';

const ForgotPasswordPage: EnhancedNextPage = () => (
  <Page title="Olvidé mi Contraseña">
    <Container
      fixed
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: '1fr',
        paddingY: (theme) => theme.spacing(2),
      }}
    >
      <ForgotPassword />
    </Container>
  </Page>
);

ForgotPasswordPage.getLayout = (page) => <BasicLayout>{page}</BasicLayout>;

export default ForgotPasswordPage;
