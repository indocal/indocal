import { AppProps } from 'next/app';
import { Session } from 'next-auth';

import { EnhancedNextPage } from '@/types';

export type EnhancedNextAppProps = AppProps<{ session: Session | null }> & {
  Component: EnhancedNextPage;
};

export type EnhancedNextApp = (
  props: EnhancedNextAppProps
) => React.ReactElement;

export default EnhancedNextApp;
