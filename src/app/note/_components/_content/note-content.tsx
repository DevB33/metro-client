'use client';

import { useRef } from 'react';
import { css } from '@/../styled-system/css';

const noteContentContainer = css({
  boxSizing: 'border-box',
  paddingTop: 'tiny',
  display: 'flex',
  flex: '1 0 auto',
  width: 'full',
  minHeight: 'full',
  height: 'auto',
  outline: 'none',
  overflowY: 'hidden',
  flexShrink: 0,
  resize: 'none',
  _placeholder: { color: 'gray' },
});

const NoteContent = () => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };
  return (
    <textarea
      ref={textAreaRef}
      className={noteContentContainer}
      onInput={handleInput}
      placeholder="글을 작성하거나 AI를 사용하려면 '스페이스' 키를, 명령어를 사용하려면 '/' 키를 누르세요."
    />
  );
};

export default NoteContent;
