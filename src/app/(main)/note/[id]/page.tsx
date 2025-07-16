import { css } from '@/../styled-system/css';
import axios from 'axios';
import { cookies } from 'next/headers';
import { SWRConfig } from 'swr';

import SWR_KEYS from '@/constants/swr-keys';
import Header from './_components/header';
import NoteHeader from './_components/note-header/note-header';
import NoteConent from './_components/note-content/note-content';

const Note = async ({ params }: { params: Promise<{ id: string }> }) => {
  const cookie = await cookies();
  const accessToken = cookie?.get('accessToken')?.value;
  const { id } = await params;

  const { data: noteMetadata } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/notes/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const { data: blockList } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/blocks`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      noteId: id,
    },
  });

  return (
    <SWRConfig
      value={{
        fallback: {
          [SWR_KEYS.noteMetadata(id)]: noteMetadata,
          [SWR_KEYS.blockList(id)]: blockList.blocks,
        },
      }}
    >
      <div className={container}>
        <Header />
        <div className={contentContainer}>
          <div className={noteContainer}>
            <NoteHeader />
            <div className={divider} />
            <NoteConent />
          </div>
        </div>
      </div>
    </SWRConfig>
  );
};

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
  overflowY: 'scroll',
});

const noteContainer = css({
  position: 'relative',
  width: 'auto',
  minWidth: '54.5rem',
  minHeight: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'start',
  gap: 'tiny',
  zIndex: 3,
});

const divider = css({
  backgroundColor: 'gray',
  width: '44.5rem',
  height: '.5px',
  borderRadius: '1rem',
  mb: 'small',
});

export default Note;
