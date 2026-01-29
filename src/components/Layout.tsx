import React from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

type LayoutProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
};

const DEFAULT_TITLE = 'Hello Gorgeous Med Spa';
const DEFAULT_DESCRIPTION =
  'A modern med spa experience focused on confidence, wellness, and natural-looking results.';

const Layout: React.FC<LayoutProps> = ({
  children,
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
      </Head>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
