import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Box, Slide, SlideProps } from '@mui/material';

export interface PageProps {
  title: string;
  description?: string;
  transition?: SlideProps['direction'];
}

export const Page: React.FC<React.PropsWithChildren<PageProps>> = ({
  title,
  description,
  transition,
  children,
}) => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    if (transition) setMounted(true);

    return () => setMounted(false);
  }, [transition]);

  return (
    <>
      <Head>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
      </Head>

      {transition ? (
        <Slide in={mounted} direction={transition}>
          <Box sx={{ display: 'inherit', width: '100%', height: '100%' }}>
            {children}
          </Box>
        </Slide>
      ) : (
        <Box sx={{ display: 'inherit', width: '100%', height: '100%' }}>
          {children}
        </Box>
      )}
    </>
  );
};

export default Page;
