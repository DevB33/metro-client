import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { css } from '@/../styled-system/css';

import { SWRConfig } from 'swr';
import axios from 'axios';
import Sidebar from './_components/sidebar/sidebar';

const RootLayout = async ({ children, modal }: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) => {
  const cookie = await cookies();
  const isLogin = cookie.has('accessToken');
  const accessToken = cookie?.get('accessToken')?.value;

  if (!isLogin) {
    redirect('/login');
  }

  const pageResponse = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/documents`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const noteHeaderData = null;
  const pageList = pageResponse.data;

  return (
    <SWRConfig
      value={{
        fallback: {
          [`pageList`]: pageList,
          [`noteHeaderData`]: noteHeaderData,
        },
      }}
    >
      <div className={css({ display: 'flex', flexDirection: 'row' })}>
        <Sidebar />
        {children}
        {modal}
      </div>
    </SWRConfig>
  );
};

export default RootLayout;
