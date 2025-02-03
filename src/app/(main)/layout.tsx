import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { css } from '@/../styled-system/css';

import Sidebar from './_components/sidebar/sidebar';

const RootLayout = async ({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) => {
  const cookie = await cookies();
  const isLogin = cookie.has('accessToken');

  if (!isLogin) {
    redirect('/login');
  }

  return (
    <div className={css({ display: 'flex', flexDirection: 'row' })}>
      <Sidebar />
      {children}
      {modal}
    </div>
  );
};

export default RootLayout;
