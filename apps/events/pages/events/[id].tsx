import { GetServerSideProps } from 'next';
import { getToken } from 'next-auth/jwt';
import { Container } from '@mui/material';
import axios from 'axios';

import { Page } from '@indocal/ui';
import { Event } from '@indocal/services';

import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

type EventPageParams = {
  id: string;
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

  const { data: event } = await axios.get<Event | null>(
    `/events/${ctx.params?.id}`,
    {
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
      },
    }
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
