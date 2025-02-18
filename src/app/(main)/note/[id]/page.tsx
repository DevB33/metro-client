import { css } from '@/../styled-system/css';

import Header from './_components/header';
import NoteHeader from './_components/note-header/note-header';
import LineInfo from './_components/line-info/line-info';
import NoteConent from './_components/note-content/note-content';

const container = css({
  position: 'relative',
  width: '100%',
  minWidth: '54.5rem',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyItems: 'start',
  // overflowX: 'scroll',
});

const noteContainer = css({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'start',
  // overflowY: 'auto',
  overflowX: 'scroll',
  gap: 'tiny',
  zIndex: 3,
  // px: '5rem',
});

const divider = css({
  backgroundColor: 'gray',
  width: '44.5rem',
  height: '1px',
  borderRadius: '1rem',
});

const ContentContainer = css({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  height: '100%',
  overflowX: 'scroll',
  // backgroundColor: 'lightGray',
});

const SafeZone = css({
  width: '1rem',
  px: '2rem',
  height: '100%',
  backgroundColor: 'lightBlue',
  opacity: 0.4,
  zIndex: 2,
});

const Note = () => {
  return (
    <div className={container}>
      <Header />
      {/* <div className={ContentContainer}> */}
      {/* <div className={SafeZone} /> */}
      <div className={noteContainer}>
        <NoteHeader />
        <div className={divider} />
        <LineInfo />
        <div className={divider} />
        <NoteConent />
      </div>
      {/* <div className={SafeZone} /> */}
      {/* </div> */}
    </div>
  );
};

export default Note;
