import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { css } from '@/../styled-system/css';
import { SWRConfig } from 'swr';
import axios from 'axios';

import SWR_KEYS from '@/constants/swr-keys';
import Sidebar from './_components/sidebar/sidebar';

const MainLayout = async ({ children, modal }: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) => {
  const cookie = await cookies();
  const isLogin = cookie.has('accessToken');
  const accessToken = cookie?.get('accessToken')?.value;

  if (!isLogin) {
    redirect('/login');
  }

  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/notes`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const { data: userInfo } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/members`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return (
    <SWRConfig
      value={{
        fallback: {
          [SWR_KEYS.NOTE_LIST]: data.notes,
          [SWR_KEYS.USER_INFO]: userInfo,
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

export default MainLayout;
