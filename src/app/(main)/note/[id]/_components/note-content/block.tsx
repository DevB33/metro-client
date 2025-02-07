import { memo } from 'react';
import { css } from '@/../styled-system/css';

import { ITextBlock } from '@/types/block-type';
import keyName from '@/constants/key-name';
import placeholder from '@/constants/placeholder';

interface IBlockComponent {
  block: ITextBlock;
  index: number;
  blockRef: React.RefObject<(HTMLDivElement | null)[]>;
  blockList: ITextBlock[];
  setBlockList: (blockList: ITextBlock[]) => void;
  isTyping: boolean;
  setIsTyping: (isTyping: boolean) => void;
}

const blockDiv = css({
  position: 'relative',
  boxSizing: 'border-box',
  display: 'flex',
  flex: '1',
  width: 'full',
  minHeight: '2rem',
  height: 'auto',
  outline: 'none',
  overflowY: 'hidden',
  flexShrink: 0,
  whiteSpace: 'pre-wrap',

  '&:focus:empty::before': {
    position: 'absolute',
    top: '0',
    left: '0',
    content: 'attr(data-placeholder)',
    color: 'gray',
    fontSize: 'md',
    pointerEvents: 'none',
  },
});

const Block = memo(
  ({
    block,
    index,
    blockRef,
    blockList,
    setBlockList,
    isTyping: _isTyping,
    setIsTyping,
  }: IBlockComponent) => {
    const handleInput = (e: React.FormEvent<HTMLDivElement>, i: number) => {
      setIsTyping(true);
      const updatedBlockList = [...blockList];
      const target = e.currentTarget;
      updatedBlockList[i].children[0].content = target.textContent || '';
      setBlockList(updatedBlockList);
      if (blockRef.current[index]?.innerText.trim() === '') {
        // eslint-disable-next-line no-param-reassign
        blockRef.current[index].innerHTML = '';
      }
    };

    const splitBlock = (i: number) => {
      setIsTyping(false);

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const container = range.startContainer; // 현재 커서가 위치한 노드
      const offset = range.startOffset; // 커서가 해당 노드 내에서 몇 번째 위치인지
      const parent = blockRef.current[i]; // contentEditable 전체 영역
      const children = parent?.childNodes; // contentEditable 내 자식 노드들
      const childNodes = Array.from(children as NodeListOf<HTMLElement>);

      const beforeBlock = Array.from(childNodes[0].childNodes as NodeListOf<HTMLElement>)
        .filter((_node, idx) => {
          return (
            idx <=
            Array.from(childNodes[0].childNodes as NodeListOf<HTMLElement>).indexOf(
              container as HTMLElement,
            )
          );
        })
        .map((node, idx) => {
          if (
            idx ===
            Array.from(childNodes[0].childNodes as NodeListOf<HTMLElement>).indexOf(
              container as HTMLElement,
            )
          ) {
            const newNode = document.createTextNode(node.textContent?.slice(0, offset) || '');
            console.log(newNode);
            return newNode;
          }
          return node;
        });

      const afterBlock = Array.from(childNodes[0].childNodes as NodeListOf<HTMLElement>)
        .filter((_node, idx) => {
          return (
            idx >=
            Array.from(childNodes[0].childNodes as NodeListOf<HTMLElement>).indexOf(
              container as HTMLElement,
            )
          );
        })
        .map((node, idx) => {
          if (idx === 0) {
            const newNode = document.createTextNode(node.textContent?.slice(offset) || '');
            return newNode;
          }
          return node;
        });

      const updatedBlockList = [...blockList];

      const newBeforeBlock = beforeBlock.map(node => {
        return {
          type: 'text' as 'text',
          style: {
            fontStyle: 'normal',
            fontWeight: 'regular',
            color: 'black',
            backgroundColor: 'white',
            width: 'auto',
            height: 'auto',
          },
          content: node.textContent,
        };
      });

      console.log(afterBlock);

      const newAfterBlock = afterBlock.map(node => {
        return {
          type: 'text' as 'text',
          style: {
            fontStyle: 'normal',
            fontWeight: 'regular',
            color: 'black',
            backgroundColor: 'white',
            width: 'auto',
            height: 'auto',
          },
          content: node.textContent,
        };
      });

      updatedBlockList[i].children = newBeforeBlock;

      updatedBlockList.splice(i + 1, 0, {
        id: Date.now(),
        type: 'default',
        children: newAfterBlock,
      });

      setBlockList(updatedBlockList);

      setTimeout(() => {
        blockRef.current[i + 1]?.focus();
      }, 0);
    };

    const mergeBlock = (i: number) => {
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
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, i: number) => {
      if (e.key === keyName.enter && !e.shiftKey) {
        e.preventDefault();
        if (e.nativeEvent.isComposing) {
          return;
        }
        splitBlock(i);
      }

      if (e.key === keyName.backspace) {
        const selection = window.getSelection();
        const cursorPosition = selection?.focusOffset || 0;

        if (cursorPosition === 0 && i > 0) {
          e.preventDefault();
          mergeBlock(i);
        }
      }
    };

    return (
      <div
        role="textbox"
        tabIndex={0}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder.block}
        className={blockDiv}
        onInput={event => handleInput(event, index)}
        onKeyDown={event => handleKeyDown(event, index)}
        ref={element => {
          // eslint-disable-next-line no-param-reassign
          blockRef.current[index] = element;
        }}
      >
        {block.children.map((child, idx) =>
          child.content === '\n' ? <br /> : <span key={idx}>{child.content}</span>,
        )}
      </div>
    );
  },
  (_prevProps, nextProps) => nextProps.isTyping,
);

export default Block;
