import { GetServerSideProps } from 'next';
import { getToken } from 'next-auth/jwt';
import { Container } from '@mui/material';

import { Page } from '@indocal/ui';
import { INDOCAL, Event } from '@indocal/services';

import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

type EventPageParams = {
  event_id: string;
};

type EventPageProps = {
  event: Event;
};

const EventPage: EnhancedNextPage<EventPageProps> = ({ event }) => (
  <Page title={event.title}>
    <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }} />
  </Page>
);

EventPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export const getServerSideProps: GetServerSideProps<
  EventPageProps,
  EventPageParams
> = async (ctx) => {
  const token = await getToken(ctx);

  const indocal = new INDOCAL({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    token: token?.access_token,
  });

  const { event } = await indocal.events.findOneByUUID(
    ctx.params?.event_id as string
  );

  if (!event) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      event,
    },
  };
};

export default EventPage;
