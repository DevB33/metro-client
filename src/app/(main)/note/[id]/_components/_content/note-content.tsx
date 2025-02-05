'use client';

import { useRef, useState } from 'react';
import { css } from '@/../styled-system/css';
import { ITextBlock } from '@/types/block-type';
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
  console.log('render NoteContent');
  const [blockList, setBlockList] = useState<ITextBlock[]>([
    {
      type: 'default',
      children: [
        {
          type: 'text',
          style: {
            fontStyle: 'normal',
            fontWeight: 'regular',
            color: 'black',
            backgroundColor: 'white',
            width: 'auto',
            height: 'auto',
          },
          content: '',
        },
      ],
    },
  ]);

  const [isFocused, setIsFocused] = useState<boolean[]>([false]);
  const [isHover, setIsHover] = useState<boolean[]>([]);
  const blockRef = useRef<(HTMLDivElement | null)[]>([]);

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

  //
  const [isComposing, setIsComposing] = useState(false); // 한글 조합 중 여부

  const handleCompositionStart = () => {
    setIsComposing(true); // 한글 입력 조합 시작
  };

  const handleCompositionEnd = (e: React.FormEvent<HTMLDivElement>, index: number) => {
    setIsComposing(false); // 한글 입력 조합 완료
    handleInput(e, index); // 입력값 반영
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>, index: number) => {
    // const updatedBlockList = [...blockList];
    // const target = e.currentTarget;
    // updatedBlockList[index].children[0].content = target.textContent || '';
    // setBlockList(updatedBlockList);
    if (isComposing) return; // 한글 조합 중이면 상태 업데이트 방지

    const updatedBlockList = [...blockList];
    const target = e.currentTarget;

    // 커서 위치 저장
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    const cursorPosition = range ? range.startOffset : 0;

    updatedBlockList[index].children[0].content = target.textContent || '';
    setBlockList(updatedBlockList);

    setTimeout(() => {
      //  커서 위치 복구
      const newRange = document.createRange();
      const newSelection = window.getSelection();
      if (blockRef.current[index]?.firstChild) {
        newRange.setStart(blockRef.current[index]?.firstChild, cursorPosition);
        newRange.collapse(true);
        newSelection?.removeAllRanges();
        newSelection?.addRange(newRange);
      }
    }, 0);
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
      const currentContent = blockList[index].children[0].content || '';

      const beforeContent = currentContent.slice(0, cursorPosition);
      const afterContent = currentContent.slice(cursorPosition);

      const updatedBlockList = [...blockList];
      updatedBlockList[index].children[0].content = beforeContent;

      const newBlock: ITextBlock = {
        type: 'default',
        children: [
          {
            type: 'text',
            style: {
              fontStyle: 'normal',
              fontWeight: 'regular',
              color: 'black',
              backgroundColor: 'white',
              width: 'auto',
              height: 'auto',
            },
            content: afterContent,
          },
        ],
      };

      updatedBlockList.splice(index + 1, 0, newBlock);

      setBlockList(updatedBlockList);

      setTimeout(() => {
        blockRef.current[index + 1]?.focus();
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
        const mergePosition = previousBlock.children[0].content?.length || 0;

        previousBlock.children[0].content += currentBlock.children[0].content ?? '';

        updatedBlockList.splice(index, 1);
        setBlockList(updatedBlockList);

        setTimeout(() => {
          const previousBackBlock = blockRef.current[index - 1];
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
            {isFocused[index] && block.children[0].content?.trim() === '' && (
              <div className={focusTextStyle}>
                글을 작성하거나 AI를 사용하려면 '스페이스' 키를, 명령어를 사용하려면 '/' 키를
                누르세요.
              </div>
            )}
            <div
              contentEditable
              suppressContentEditableWarning
              className={noteContentContainer}
              onCompositionStart={handleCompositionStart} // 한글 입력 시작 감지
              onCompositionEnd={e => handleCompositionEnd(e, index)} // 한글 입력 완료 시 업데이트
              onInput={e => handleInput(e, index)}
              onFocus={() => handleFocus(index)}
              onBlur={() => handleBlur(index)}
              onKeyDown={event => handleKeyDown(event, index)}
              ref={element => {
                blockRef.current[index] = element;
              }}
            >
              {block.children[0].content}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default NoteContent;
