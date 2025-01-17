import './globals.css';
import { Noto_Sans_KR } from 'next/font/google';
import type { Metadata } from 'next';
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

const contentContainer = css({
  flex: '1',
  transition: '0.3s',
});

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const isLogin = true;

  if (!isLogin) {
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
        <Sidebar />
        <div className={contentContainer}>{children}</div>
      </body>
    </html>
  );
};

export default RootLayout;
