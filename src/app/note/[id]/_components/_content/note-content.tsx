'use client';

import { useRef, useState } from 'react';
import { css } from '@/../styled-system/css';
import IBlockType from '@/types/block-type';

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
  const [blockList, setBlockList] = useState<IBlockType[]>([{ type: '', tag: '' }]);
  const textAreaRefs = useRef<HTMLTextAreaElement[]>([]);
  const [isFocused, setIsFocused] = useState<boolean[]>([false]);
  const [hasValue, setHasValue] = useState<boolean[]>([false]);

  const handleInput = (index: number) => {
    const blockRef = textAreaRefs.current[index];
    if (blockRef) {
      blockRef.style.height = 'auto';
      blockRef.style.height = `${blockRef.scrollHeight}px`;

      const newHasValue = [...hasValue];
      newHasValue[index] = blockRef.value.trim().length > 0;
      setHasValue(newHasValue);
    }
  };

  const handleFocus = (index: number) => {
    const newFocusState = [...isFocused];
    newFocusState[index] = true;
    setIsFocused(newFocusState);
  };

  const handleBlur = (index: number) => {
    const newFocusState = [...isFocused];
    newFocusState[index] = false;
    setIsFocused(newFocusState);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, index: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      const newBlock = { type: '', tag: '' };
      const updatedBlockList = [
        ...blockList.slice(0, index + 1),
        newBlock,
        ...blockList.slice(index + 1),
      ];
      setBlockList(updatedBlockList);

      setTimeout(() => {
        textAreaRefs.current[index + 1]?.focus();
      }, 0);
    }
  };

  return (
    <>
      {blockList.map((block, index) => (
        <div className={wrapper}>
          {isFocused[index] && !hasValue[index] && (
            <div className={focusTextStyle}>
              글을 작성하거나 AI를 사용하려면 '스페이스' 키를, 명령어를 사용하려면 '/' 키를
              누르세요.
            </div>
          )}
          <textarea
            ref={el => {
              if (el) textAreaRefs.current[index] = el;
            }}
            className={noteContentContainer}
            onInput={() => handleInput(index)}
            onFocus={() => handleFocus(index)}
            onBlur={() => handleBlur(index)}
            onKeyDown={event => handleKeyDown(event, index)}
          />
        </div>
      ))}
    </>
  );
};

export default NoteContent;
