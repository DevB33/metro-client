import type { Metadata } from 'next';

import { Noto_Sans_KR } from 'next/font/google';
import './styles/globals.css';
import { ToastContainer } from 'react-toastify';

export const metadata: Metadata = {
  title: 'Metro',
};

const notoSans = Noto_Sans_KR({
  subsets: ['latin'],
});

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="ko">
      <body className={notoSans.className}>
        <ToastContainer autoClose={1500} />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
