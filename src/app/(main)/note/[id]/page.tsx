import { css } from '@/../styled-system/css';

import Header from './_components/header';
import NoteHeader from './_components/note-header/note-header';
import LineInfo from './_components/line-info/line-info';
import NoteConent from './_components/note-content/note-content';

const container = css({
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 'large',
});

const noteContainer = css({
  width: 'full',
  display: 'flex',
  overflowY: 'auto',
  alignItems: 'start',
  justifyContent: 'center',
});

const content = css({
  display: 'flex',
  flexDirection: 'column',
  width: '44.5rem',
  minHeight: '48rem',
  gap: 'tiny',
});

const divider = css({
  backgroundColor: 'gray',
  height: '1px',
  borderRadius: '1rem',
});

const Note = () => {
  return (
    <div className={container}>
      <Header />
      <div className={noteContainer}>
        <div className={content}>
          <NoteHeader />
          <div className={divider} />
          <LineInfo />
          <div className={divider} />
          <NoteConent />
        </div>
      </div>
    </div>
  );
};

export default Note;
