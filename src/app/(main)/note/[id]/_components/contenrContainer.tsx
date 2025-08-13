'use client';

import { css } from '@/../styled-system/css';
import { useRef } from 'react';

import NoteHeader from './note-header/note-header';
import NoteConent from './note-content/note-content';

const ContentContainer = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className={Container} ref={scrollRef}>
      <div className={noteContainer}>
        <NoteHeader />
        <div className={divider} />
        <NoteConent scrollRef={scrollRef} />
      </div>
    </div>
  );
};

const Container = css({
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

export default ContentContainer;
