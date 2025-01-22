'use client';

import { useEffect, useRef, useState } from 'react';
import { css } from '@/../styled-system/css';
import IBlockType from '@/types/block-type';
import PlusIcon from '@/icons/plus-icon';
import GripVerticalIcon from '@/icons/grip-vertical-icon';

const blockContainer = css({
  display: 'flex',
  flexDirection: 'row',
});

const blockBtnContainer = css({
  position: 'absolute',
  left: '-3rem',
  display: 'flex',
  flexDirection: 'row',
});

const blockBtn = css({
  width: '1.5em',
  height: '1.5rem',
  padding: '0.2rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '0.5rem',
  cursor: 'pointer',

  _hover: {
    backgroundColor: '#F1F1F0',
  },
});

const noteContentContainer = css({
  boxSizing: 'border-box',
  display: 'flex',
  flex: '1',
  width: 'full',
  outline: 'none',
  overflowY: 'hidden',
  flexShrink: 0,
  resize: 'none',
  justifyContent: 'center',
  height: 'auto',
  alignItems: 'center',
});

const focusTextStyle = css({
  position: 'absolute',
  color: 'gray',
  fontSize: 'md',
  pointerEvents: 'none',
});

const wrapper = css({
  position: 'relative',
  verticalAlign: 'middle',
});

const NoteContent = () => {
  const [blockList, setBlockList] = useState<IBlockType[]>([
    { type: '', tag: '', content: '', style: '', children: null },
  ]);
  const textAreaRefs = useRef<HTMLTextAreaElement[]>([]);
  const [isFocused, setIsFocused] = useState<boolean[]>([false]);
  const [isHover, setIsHover] = useState<boolean[]>([]);

  const handleMouseEnter = (index: number) => {
    const newHoverState = [...isHover];
    newHoverState[index] = true;
    setIsHover(newHoverState);
  };

  const handleMouseLeave = (index: number) => {
    const newHoverState = [...isHover];
    newHoverState[index] = false;
    setIsHover(newHoverState);
  };

  const handleInput = (index: number) => {
    const blockRef = textAreaRefs.current[index];
    if (blockRef) {
      const updatedBlockList = [...blockList];
      updatedBlockList[index].content = blockRef.value;
      setBlockList(updatedBlockList);

      blockRef.style.height = 'auto';
      blockRef.style.height = `${blockRef.scrollHeight}px`;
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

      const newBlock = { type: '', tag: '', content: '', style: '', children: null };
      const updatedBlockList = [
        ...blockList.slice(0, index + 1),
        newBlock,
        ...blockList.slice(index + 1),
      ];
      setBlockList(updatedBlockList);

      setTimeout(() => {
        textAreaRefs.current[index + 1]?.focus();
        handleBlur(index);
      }, 0);
    }
    if (e.key === 'Backspace') {
      e.preventDefault();

      if (blockList.length > 1) {
        const updatedBlocks = [...blockList];
        const previousBlock = updatedBlocks[index - 1];
        const currentBlock = updatedBlocks[index];

        const previousContent = previousBlock.content ?? '';
        const currentContent = currentBlock.content ?? '';
        previousBlock.content = previousContent + currentContent;

        updatedBlocks.splice(index, 1);
        setBlockList(updatedBlocks);

        setTimeout(() => {
          if (index > 0) {
            textAreaRefs.current[index - 1]?.focus();
          }
        }, 0);
      }
    }
  };

  return (
    <>
      {blockList.map((block, index) => (
        <div className={wrapper}>
          <div
            className={blockContainer}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            {isHover[index] && (
              <div className={blockBtnContainer}>
                <div className={blockBtn}>
                  <PlusIcon />
                </div>
                <div className={blockBtn}>
                  <GripVerticalIcon />
                </div>
              </div>
            )}
            {isFocused[index] && block.content?.trim() === '' && (
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
              value={block.content}
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default NoteContent;
