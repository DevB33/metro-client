import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { css } from '@/../styled-system/css';
import { SWRConfig } from 'swr';

import SWR_KEYS from '@/constants/swr-keys';
import { getNoteList } from '@/apis/server/note';
import getUserInfo from '@/apis/server/users';
import Sidebar from './_components/sidebar/sidebar';

const MainLayout = async ({ children, modal }: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) => {
  if (!(await cookies()).has('accessToken')) {
    redirect('/login');
  }

  const data = await getNoteList();
  const userData = await getUserInfo();

  return (
    <SWRConfig
      value={{
        fallback: {
          [SWR_KEYS.NOTE_LIST]: data.notes,
          [SWR_KEYS.USER_INFO]: userData,
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
