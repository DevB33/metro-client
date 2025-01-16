import { css } from '@/../styled-system/css';

import IconSelector from './_components/_content/icon-selector';
import LineInfo from './_components/_content/line-info';
import NoteContent from './_components/_content/note-content';
import Tag from './_components/_content/tag';
import Title from './_components/_content/title';
import Header from './_components/header';

const noteContainer = css({
  width: 'full',
  minHeight: 'full',
  height: 'auto',
  display: 'flex',
  overflowY: 'auto',
  alignItems: 'start',
  justifyContent: 'center',
});

const container = css({
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 'huge',
});

const content = css({
  width: '44.5rem',
  minHeight: '48rem',
  display: 'flex',
  flexDirection: 'column',
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
          <IconSelector />
          <Title />
          <Tag />
          <div className={divider} />
          <LineInfo />
          <div className={divider} />
          <NoteContent />
        </div>
      </div>
    </div>
  );
};

export default Note;
