import { css } from '@/../styled-system/css';

import Header from './_components/header';
import NoteHeader from './_components/note-header/note-header';
import LineInfo from './_components/line-info/line-info';
import NoteConent from './_components/note-content/note-content';

const container = css({
  position: 'relative',
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyItems: 'start',
});

const noteContainer = css({
  width: 'full',
  height: 'full',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  alignItems: 'center',
  justifyContent: 'start',
  gap: 'tiny',
});

const divider = css({
  backgroundColor: 'gray',
  width: '44.5rem',
  height: '1px',
  borderRadius: '1rem',
});

const Note = () => {
  return (
    <div className={container}>
      <Header />
      <div className={noteContainer}>
        <NoteHeader />
        <div className={divider} />
        <LineInfo />
        <div className={divider} />
        <NoteConent />
      </div>
    </div>
  );
};

export default Note;
