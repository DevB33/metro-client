import './globals.css';
import { Noto_Sans_KR } from 'next/font/google';
import type { Metadata } from 'next';
import LoginPage from './_components/login/login-page';

export const metadata: Metadata = {
  title: 'Metro',
};

const notoSans = Noto_Sans_KR({
  subsets: ['latin'],
});

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const isLogin = false;

  if (!isLogin) {
    return (
      <html lang="ko">
        <body>
          <LoginPage />
        </body>
      </html>
    );
  }

  return (
    <html lang="ko" className={notoSans.variable}>
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
