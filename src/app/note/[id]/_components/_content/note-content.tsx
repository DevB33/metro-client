'use client';

import { useRef, useState } from 'react';
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

const focusTextStyle = css({
  position: 'absolute',
  color: 'gray',
  fontSize: 'md',
  top: 'tiny',
  pointerEvents: 'none',
});

const wrapper = css({
  position: 'relative',
});

const NoteContent = () => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleInput = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
      setHasValue(textAreaRef.current.value.length > 0);
    }
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className={wrapper}>
      {isFocused && !hasValue && (
        <div className={focusTextStyle}>
          글을 작성하거나 AI를 사용하려면 '스페이스' 키를, 명령어를 사용하려면 '/' 키를 누르세요.
        </div>
      )}
      <textarea
        ref={textAreaRef}
        className={noteContentContainer}
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default NoteContent;
