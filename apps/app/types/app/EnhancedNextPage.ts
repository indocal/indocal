import { NextPage } from 'next';

export type EnhancedNextPage<P = unknown> = NextPage<P> & {
  getLayout?: (page: React.ReactElement) => React.ReactElement;
};

export default EnhancedNextPage;
