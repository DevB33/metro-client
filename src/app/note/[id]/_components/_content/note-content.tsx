'use client';

import { useState } from 'react';
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
  pt: '0.2rem',
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
  minHeight: '2rem',
  height: 'auto',
  outline: 'none',
  overflowY: 'hidden',
  flexShrink: 0,
  resize: 'none',
  alignItems: 'center',
});
const focusTextStyle = css({
  position: 'absolute',
  top: '0.1rem',
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

  const handleInput = (e: React.FormEvent<HTMLDivElement>, index: number) => {
    const updatedBlockList = [...blockList];
    const target = e.currentTarget;
    updatedBlockList[index].content = target.textContent || '';
    setBlockList(updatedBlockList);
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      const selection = window.getSelection();
      const cursorPosition = selection?.focusOffset || 0;
      const currentContent = blockList[index].content || '';

      const beforeContent = currentContent.slice(0, cursorPosition);
      const afterContent = currentContent.slice(cursorPosition);

      const updatedBlockList = [...blockList];
      updatedBlockList[index].content = beforeContent;

      const newBlock = { type: '', tag: '', content: afterContent, style: '', children: null };
      updatedBlockList.splice(index + 1, 0, newBlock);

      setBlockList(updatedBlockList);

      setTimeout(() => {
        const nextBlock = document.querySelectorAll('[contenteditable]')[index + 1];
        (nextBlock as HTMLDivElement)?.focus();
      }, 0);
    }

    if (e.key === 'Backspace') {
      const selection = window.getSelection();
      const cursorPosition = selection?.focusOffset || 0;

      if (cursorPosition === 0 && index > 0) {
        e.preventDefault();

        const updatedBlockList = [...blockList];
        const previousBlock = updatedBlockList[index - 1];
        const currentBlock = updatedBlockList[index];
        const mergePosition = previousBlock.content?.length || 0;

        previousBlock.content += currentBlock.content ?? '';

        updatedBlockList.splice(index, 1);
        setBlockList(updatedBlockList);

        setTimeout(() => {
          const previousBackBlock = document.querySelectorAll('[contenteditable]')[index - 1];
          if (previousBackBlock) {
            const range = document.createRange();
            const previousSelection = window.getSelection();

            range.setStart(previousBackBlock.childNodes[0] || previousBackBlock, mergePosition);
            range.collapse(true);

            previousSelection?.removeAllRanges();
            previousSelection?.addRange(range);
          }
        }, 0);
      }
    }
  };

  return (
    <>
      {blockList.map((block, index) => (
        <div className={wrapper} key={index}>
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
            <div
              contentEditable
              suppressContentEditableWarning
              className={noteContentContainer}
              onInput={e => handleInput(e, index)}
              onFocus={() => handleFocus(index)}
              onBlur={() => handleBlur(index)}
              onKeyDown={event => handleKeyDown(event, index)}
            >
              {block.content}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default NoteContent;
