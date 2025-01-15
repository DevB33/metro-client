import './globals.css';
import { Noto_Sans_KR } from 'next/font/google';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Metro',
};

const notoSans = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-noto-sans',
});

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="ko" className={notoSans.variable}>
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
