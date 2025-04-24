import { css } from '@/../styled-system/css';

import axios from 'axios';
import { cookies } from 'next/headers';
import { SWRConfig } from 'swr';
import Header from './_components/header';
import NoteHeader from './_components/note-header/note-header';
import LineInfo from './_components/line-info/line-info';
import NoteConent from './_components/note-content/note-content';

const container = css({
  position: 'relative',
  width: '100%',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyItems: 'start',
  overflowX: 'scroll',
});

const contentContainer = css({
  width: '100%',
  height: '100%',
  overflowX: 'scroll',
});

const noteContainer = css({
  position: 'relative',
  width: 'auto',
  minWidth: '54.5rem',
  minHeight: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'start',
  gap: 'tiny',
  zIndex: 3,
  mb: '10rem',
});

const divider = css({
  backgroundColor: 'gray',
  width: '44.5rem',
  height: '.5px',
  borderRadius: '1rem',
});

const Note = async ({ params }: { params: Promise<{ id: string }> }) => {
  const cookie = await cookies();
  const accessToken = cookie?.get('accessToken')?.value;
  const { id } = await params;

  const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/notes/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const noteHeaderData = response.data;

  return (
    <SWRConfig
      value={{
        fallback: {
          [`noteHeaderData-${id}`]: noteHeaderData,
        },
      }}
    >
      <div className={container}>
        <Header />
        <div className={contentContainer}>
          <div className={noteContainer}>
            <NoteHeader />
            <div className={divider} />
            <LineInfo />
            <div className={divider} />
            <NoteConent />
          </div>
        </div>
      </div>
    </SWRConfig>
  );
};

export default Note;
