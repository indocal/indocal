import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { Container } from '@mui/material';

import { Page, BasicLayout, NotFound } from '@indocal/ui';

import { Pages } from '@/config';
import { EnhancedNextPage } from '@/types';

const NotFoundPage: EnhancedNextPage = () => {
  const router = useRouter();

  const isAdminPage = useMemo(
    () => router.asPath.startsWith(Pages.ADMIN_ROOT),
    [router.asPath]
  );

  return (
    <Page title="404: Recurso no encontrado">
      <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
        <NotFound fallbackUrl={isAdminPage ? Pages.ADMIN_ROOT : Pages.ROOT} />
      </Container>
    </Page>
  );
};

NotFoundPage.getLayout = (page) => <BasicLayout>{page}</BasicLayout>;

export default NotFoundPage;
