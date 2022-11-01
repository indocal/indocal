import { Html, Head, Main, NextScript } from 'next/document';

import { DEFAULT_THEME_COLORS } from '@indocal/theme';

const Document: React.FC = () => (
  <Html>
    <Head>
      {/* PWA primary color */}
      <meta name="theme-color" content={DEFAULT_THEME_COLORS.PRIMARY_COLOR} />

      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />

      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
    </Head>

    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
