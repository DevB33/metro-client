import { css } from '@/../styled-system/css';

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
  height: '1px',
  borderRadius: '1rem',
});

const Note = () => {
  return (
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
  );
};

export default Note;
