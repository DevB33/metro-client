import './globals.css';
import { Noto_Sans_KR } from 'next/font/google';
import type { Metadata } from 'next';
import Sidebar from './_components/sidebar/sidebar';

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
  return (
    <html lang="ko">
      <body className={notoSans.className} style={{ display: 'flex', flexDirection: 'row' }}>
        <Sidebar />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
