import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{
          __html: `
            // Fallback for Right Grotesk font
            (function() {
              var fontFamilies = ['Space Mono:regular,700'];
              var WebFont = window.WebFont || {};
              if (WebFont.load) {
                WebFont.load({ google: { families: fontFamilies } });
              }
            })();
          `
        }} />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;