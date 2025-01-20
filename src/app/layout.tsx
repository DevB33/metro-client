import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import { css } from '@/../styled-system/css';

import Sidebar from './_components/sidebar/sidebar';
import LoginPage from './_components/login/login-page';

export const metadata: Metadata = {
  title: 'Metro',
};

const notoSans = Noto_Sans_KR({
  subsets: ['latin'],
});

const Body = css({
  display: 'flex',
  flexDirection: 'row',
});

const RootLayout = async ({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) => {
  const isLogin = false;
  const headersList = await headers();
  const headerPathname = headersList.get('x-pathname') || '';

  if (!isLogin && headerPathname !== '/auth/callback') {
    return (
      <html lang="ko">
        <body className={notoSans.className}>
          <LoginPage />
        </body>
      </html>
    );
  }

  return (
    <html lang="ko">
      <body className={`${notoSans.className} ${Body}`}>
        {headerPathname !== '/auth/callback' && <Sidebar />}
        {modal}
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
