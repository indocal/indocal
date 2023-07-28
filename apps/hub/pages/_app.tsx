import { useState, useEffect } from 'react';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { SnackbarProvider } from 'notistack';
import { SWRConfig, Fetcher } from 'swr';

import { ThemeProvider } from '@indocal/theme';
import { ErrorBoundary, ConfirmProvider, Loader } from '@indocal/ui';
import { AbilityProvider } from '@indocal/services';

import { indocal } from '@/lib';
import { EnhancedNextApp } from '@/types';

const fetcher: Fetcher = (url: string) =>
  indocal.config.axios.get(url).then((response) => response.data);

const App: EnhancedNextApp = ({ Component, pageProps }) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  const [boostraping, setBoostraping] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => setBoostraping(false), 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        <title>INDOCAL</title>
      </Head>

      <ErrorBoundary fullscreen message="Error al cargar la aplicación">
        <SessionProvider session={pageProps.session}>
          <SWRConfig value={{ fetcher }}>
            <AbilityProvider>
              <ThemeProvider>
                <SnackbarProvider>
                  <ConfirmProvider>
                    {boostraping ? (
                      <Loader fullscreen />
                    ) : (
                      getLayout(<Component {...pageProps} />)
                    )}
                  </ConfirmProvider>
                </SnackbarProvider>
              </ThemeProvider>
            </AbilityProvider>
          </SWRConfig>
        </SessionProvider>
      </ErrorBoundary>
    </>
  );
};

export default App;
