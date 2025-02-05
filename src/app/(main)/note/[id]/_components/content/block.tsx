import { memo } from 'react';
import { css } from '@/../styled-system/css';

import { ITextBlock } from '@/types/block-type';

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

const Block = memo(
  ({
    block,
    index,
    blockRef,
    blockList,
    setBlockList,
    isTyping,
    setIsTyping,
    isFocused,
    setIsFocused,
  }: {
    block: ITextBlock;
    index: number;
    blockRef: React.RefObject<(HTMLDivElement | null)[]>;
    blockList: ITextBlock[];
    setBlockList: (blockList: ITextBlock[]) => void;
    isTyping: boolean;
    setIsTyping: (isTyping: boolean) => void;
    isFocused: boolean[];
    setIsFocused: (isFocused: boolean[]) => void;
  }) => {
    const handleInput = (e: React.FormEvent<HTMLDivElement>, i: number) => {
      setIsTyping(true);
      const updatedBlockList = [...blockList];
      const target = e.currentTarget;
      updatedBlockList[i].children[0].content = target.textContent || '';
      setBlockList(updatedBlockList);
    };

    const handleFocus = (i: number) => {
      const newFocusState = [...isFocused];
      newFocusState[i] = true;
      setIsFocused(newFocusState);
    };

    const handleBlur = (i: number) => {
      const newFocusState = [...isFocused];
      newFocusState[i] = false;
      setIsFocused(newFocusState);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, i: number) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        setIsTyping(false);

        const selection = window.getSelection();
        const cursorPosition = selection?.focusOffset || 0;
        const currentContent = blockList[i].children[0].content || '';

        const beforeContent = currentContent.slice(0, cursorPosition);
        const afterContent = currentContent.slice(cursorPosition);

        const updatedBlockList = [...blockList];
        updatedBlockList[i].children[0].content = beforeContent;

        const newBlock: ITextBlock = {
          id: Math.random(),
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

        updatedBlockList.splice(i + 1, 0, newBlock);

        setBlockList(updatedBlockList);

        setTimeout(() => {
          blockRef.current[i + 1]?.focus();
        }, 0);
      }

      if (e.key === 'Backspace') {
        const selection = window.getSelection();
        const cursorPosition = selection?.focusOffset || 0;

        if (cursorPosition === 0 && i > 0) {
          e.preventDefault();

          setIsTyping(false);

          const updatedBlockList = [...blockList];
          const previousBlock = updatedBlockList[i - 1];
          const currentBlock = updatedBlockList[i];
          const mergePosition = previousBlock.children[0].content?.length || 0;

          previousBlock.children[0].content += currentBlock.children[0].content ?? '';

          updatedBlockList.splice(i, 1);
          setBlockList(updatedBlockList);

          setTimeout(() => {
            const previousBackBlock = blockRef.current[i - 1];
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
      <div
        role="textbox"
        tabIndex={0}
        contentEditable
        suppressContentEditableWarning
        className={noteContentContainer}
        onInput={e => handleInput(e, index)}
        onFocus={() => handleFocus(index)}
        onBlur={() => handleBlur(index)}
        onKeyDown={event => handleKeyDown(event, index)}
        ref={element => {
          // eslint-disable-next-line no-param-reassign
          blockRef.current[index] = element;
        }}
      >
        {block.children[0].content}
      </div>
    );
  },
  (_, nextProps) => nextProps.isTyping,
);

export default Block;
