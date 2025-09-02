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

  let notes;
  try {
    const data = await getNoteList();
    notes = data.notes;
  } catch (error) {
    throw new Error('노트 목록 불러오기 실패');
  }

  let user;
  try {
    user = await getUserInfo();
  } catch (error) {
    throw new Error('사용자 정보를 불러오기 실패');
  }

  return (
    <SWRConfig
      value={{
        fallback: {
          [SWR_KEYS.NOTE_LIST]: notes,
          [SWR_KEYS.USER_INFO]: user,
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
