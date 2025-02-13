import { useState, memo } from 'react';
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
  width: 'full',
  minHeight: '2rem',
  height: 'auto',
  outline: 'none',
  overflowY: 'hidden',
  flexShrink: 0,

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
    const [key, setKey] = useState(Date.now());

    const handleInput = (e: React.FormEvent<HTMLDivElement>, i: number) => {
      setIsTyping(true);
      const updatedBlockList = [...blockList];
      const target = e.currentTarget;

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const container = range.startContainer;
      const childNodes = Array.from(target.childNodes as NodeListOf<HTMLElement>);
      const currentIndex = childNodes.indexOf(container as HTMLElement);

      if (currentIndex === -1) {
        if (blockRef.current[index] && childNodes.length === 1) {
          // eslint-disable-next-line no-param-reassign
          blockRef.current[index]!.innerHTML = '';
        }
        return;
      }

      // 빈 노드 제거
      if (!target.childNodes[currentIndex + 1]) {
        updatedBlockList[i].children.splice(currentIndex + 1, 1);
      }

      updatedBlockList[i].children[currentIndex].content =
        childNodes[currentIndex].textContent || '';

      setBlockList(updatedBlockList);
    };

    const splitBlock = (i: number) => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const container = range.startContainer;
      const offset = range.startOffset;
      const parent = blockRef.current[i];
      const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);

      const beforeBlock = childNodes
        .filter((_node, idx) => {
          return idx <= childNodes.indexOf(container as HTMLElement);
        })
        .map((node, idx) => {
          if (idx === childNodes.indexOf(container as HTMLElement)) {
            const newNode = document.createTextNode(node.textContent?.slice(0, offset) || '');
            if (newNode.textContent === '' && idx !== 0) {
              return;
            }
            return newNode;
          }
          return node;
        })
        .filter(node => node != null);

      const afterBlock = childNodes
        .filter((_node, idx) => {
          return idx >= childNodes.indexOf(container as HTMLElement);
        })
        .map((node, idx) => {
          if (idx === 0) {
            const newNode = document.createTextNode(node.textContent?.slice(offset) || '');
            const filteredNodeCount = childNodes.filter(n => n != null).length;
            if (newNode.textContent === '' && idx !== filteredNodeCount - 1) {
              return;
            }
            return newNode;
          }
          return node;
        })
        .filter(node => node != null);

      const updatedBlockList = [...blockList];

      const newBeforeBlock = beforeBlock.map(node => {
        if (node.nodeName === 'BR') {
          return {
            type: 'br' as 'br',
            style: {
              fontStyle: 'normal',
              fontWeight: 'regular',
              color: 'black',
              backgroundColor: 'white',
              width: 'auto',
              height: 'auto',
            },
            content: '',
          };
        }

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

      const newAfterBlock = afterBlock.map(node => {
        if (node.nodeName === 'BR') {
          return {
            type: 'br' as 'br',
            style: {
              fontStyle: 'normal',
              fontWeight: 'regular',
              color: 'black',
              backgroundColor: 'white',
              width: 'auto',
              height: 'auto',
            },
            content: '',
          };
        }

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

    const splitLine = (i: number) => {
      const selection = window.getSelection();
      if (!selection) return;

      const range = selection.getRangeAt(0);
      const container = range.startContainer;
      const offset = range.startOffset;
      const parent = blockRef.current[i];
      const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);
      const newChildren = [...block.children];

      childNodes.indexOf(container as HTMLElement);
      if (container.nodeType === Node.TEXT_NODE) {
        const parentBlockIndex = childNodes.indexOf(container as HTMLElement);

        if (parentBlockIndex !== -1) {
          const textBefore = container.textContent?.substring(0, offset);
          const textAfter = container.textContent?.substring(offset);

          const updatedChildren = [
            ...newChildren.slice(0, parentBlockIndex),
            {
              type: 'text' as 'text',
              style: {
                fontStyle: 'normal',
                fontWeight: 'regular',
                color: 'black',
                backgroundColor: 'white',
                width: 'auto',
                height: 'auto',
              },
              content: textBefore || '.',
            },
            {
              type: 'br' as 'br',
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
            {
              type: 'text' as 'text',
              style: {
                fontStyle: 'normal',
                fontWeight: 'regular',
                color: 'black',
                backgroundColor: 'white',
                width: 'auto',
                height: 'auto',
              },
              content: textAfter || '.',
            },
            ...newChildren.slice(parentBlockIndex + 1),
          ];

          const updatedBlockList = [...blockList];
          updatedBlockList[i] = {
            ...updatedBlockList[i],
            children: updatedChildren,
          };

          setBlockList(updatedBlockList);
        }
      } else if (
        container.nodeType === Node.ELEMENT_NODE &&
        (container as Element).tagName === 'SPAN'
      ) {
        // TODO: span 태그일 때 처리
      }
    };

    const mergeBlock = (i: number) => {
      const updatedBlockList = [...blockList];
      const previousBlock = updatedBlockList[i - 1];
      const currentBlock = updatedBlockList[i];

      previousBlock.children = [...previousBlock.children, ...currentBlock.children];

      updatedBlockList.splice(i, 1);

      setBlockList(updatedBlockList);
    };

    const mergeLine = (i: number, parentBlockIndex: number) => {
      const updatedBlockList = [...blockList];
      const newChildren = [...block.children];
      newChildren.splice(parentBlockIndex - 1, 1);
      updatedBlockList[i] = { ...updatedBlockList[i], children: newChildren };
      setBlockList(updatedBlockList);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, i: number) => {
      if (e.key === keyName.enter && !e.shiftKey) {
        e.preventDefault();
        setIsTyping(false);
        setKey(Math.random());
        splitBlock(i);
      }

      if (e.key === keyName.enter && e.shiftKey) {
        e.preventDefault();
        setIsTyping(false);
        setKey(Math.random());
        splitLine(i);
      }

      if (e.key === keyName.backspace) {
        const selection = window.getSelection();
        const cursorPosition = selection?.focusOffset || 0;

        const range = selection?.getRangeAt(0);
        const container = range?.startContainer;
        const parent = blockRef.current[i];
        const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);
        const parentBlockIndex = childNodes.indexOf(container as HTMLElement);

        if (
          i === 0 &&
          (parentBlockIndex === -1 || parentBlockIndex === 0) &&
          cursorPosition === 0
        ) {
          e.preventDefault();
          return;
        }

        if (cursorPosition === 0) {
          e.preventDefault();
          setIsTyping(false);
          setKey(Math.random());
          if (parentBlockIndex <= 0) {
            mergeBlock(i);
          } else if (parentBlockIndex > 0) {
            mergeLine(i, parentBlockIndex);
          }
        }
      }
    };

    return (
      <div
        key={key}
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
        {block.children.map(child => {
          if (child.type === 'br') {
            return <br key={Math.random()} />;
          }

          if (child.type === 'text') {
            return child.content;
          }

          return (
            <span key={Math.random()} style={child.style}>
              {child.content}
            </span>
          );
        })}
      </div>
    );
  },
  (_prevProps, nextProps) => nextProps.isTyping,
);

export default Block;
