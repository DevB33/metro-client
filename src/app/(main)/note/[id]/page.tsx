import { css } from '@/../styled-system/css';

import IconSelector from './_components/content/icon-selector';
import LineInfo from './_components/content/line-info';
import NoteConent from './_components/content/note-content';
import Tag from './_components/content/tag';
import Title from './_components/content/title';
import Header from './_components/header';

const noteContainer = css({
  width: 'full',
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
          <NoteConent />
        </div>
      </div>
    </div>
  );
};

export default Note;
