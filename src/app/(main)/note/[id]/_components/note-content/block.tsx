import { useState, memo, useRef, useEffect } from 'react';
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
    const prevCurrentChildNodeIndex = useRef(0);
    const prevChildNodesLength = useRef(0);

    useEffect(() => {
      prevChildNodesLength.current = blockList[index].children.length;
    }, [blockList, index]);

    const getCurrentChildNodeIndex = (
      event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
    ) => {
      const target = event.currentTarget;
      setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const container = range.startContainer;
        const childNodes = Array.from(target.childNodes as NodeListOf<HTMLElement>);
        const currentChildNodeIndex = childNodes.indexOf(container as HTMLElement);

        prevCurrentChildNodeIndex.current = currentChildNodeIndex;
      }, 0);
    };

    const handleInput = (event: React.FormEvent<HTMLDivElement>, i: number) => {
      setIsTyping(true);
      const updatedBlockList = [...blockList];
      const target = event.currentTarget;

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const container = range.startContainer;
      const childNodes = Array.from(target.childNodes as NodeListOf<HTMLElement>);
      const currentChildNodeIndex = childNodes.indexOf(container as HTMLElement);

      // 블록에 모든 내용이 지워졌을 때 빈 블록으로 변경 로직
      if (currentChildNodeIndex === -1 && blockRef.current[index] && childNodes.length === 1) {
        // eslint-disable-next-line no-param-reassign
        blockRef.current[index]!.innerHTML = '';
        return;
      }

      // block의 자식 노드가 지워졌을 때 blockList에 반영하는 로직
      if (prevChildNodesLength.current > childNodes.length && currentChildNodeIndex !== -1) {
        updatedBlockList[i].children.splice(currentChildNodeIndex + 1, 1);
      }

      // 블록에 입력된 내용을 blockList에 반영하는 로직
      updatedBlockList[i].children[
        currentChildNodeIndex === -1 ? prevCurrentChildNodeIndex.current : currentChildNodeIndex
      ].content =
        currentChildNodeIndex !== -1 ? childNodes[currentChildNodeIndex].textContent || '' : '';

      setBlockList(updatedBlockList);
      prevCurrentChildNodeIndex.current = currentChildNodeIndex;
      prevChildNodesLength.current = childNodes.length;
    };

    const splitBlock = (i: number) => {
      // TODO: 줄바꿈 된 상태에서 블록 나누기 로직 추가
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
      prevCurrentChildNodeIndex.current += 2;

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
        const currentChildNodeIndex = childNodes.indexOf(container as HTMLElement);

        if (currentChildNodeIndex !== -1) {
          const textBefore = container.textContent?.substring(0, offset);
          const textAfter = container.textContent?.substring(offset);

          const updatedChildren = [
            ...newChildren.slice(0, currentChildNodeIndex),
            textBefore && {
              type: 'text' as 'text',
              style: {
                fontStyle: 'normal',
                fontWeight: 'regular',
                color: 'black',
                backgroundColor: 'white',
                width: 'auto',
                height: 'auto',
              },
              content: textBefore || '',
            },
            textBefore && textAfter
              ? {
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
                }
              : null,
            textAfter && {
              type: 'text' as 'text',
              style: {
                fontStyle: 'normal',
                fontWeight: 'regular',
                color: 'black',
                backgroundColor: 'white',
                width: 'auto',
                height: 'auto',
              },
              content: textAfter || '',
            },
            ...newChildren.slice(currentChildNodeIndex + 1),
          ]
            .map(child => {
              if (child === '') {
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

              return child;
            })
            .filter(child => child !== null);

          const updatedBlockList = [...blockList];
          if (
            updatedChildren[updatedChildren.length - 1]?.type === 'br' &&
            updatedChildren[updatedChildren.length - 2]?.type !== 'br'
          ) {
            updatedChildren.push({
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
            });
          }
          updatedBlockList[i] = {
            ...updatedBlockList[i],
            children: updatedChildren as ITextBlock['children'],
          };

          setBlockList(updatedBlockList);
        }
      } else if (
        container.nodeType === Node.ELEMENT_NODE &&
        (container as Element).tagName === 'DIV'
      ) {
        // 현재 커서 위치 한 곳이 빈 문자열일 때
        const updatedBlockList = [...blockList];
        updatedBlockList[i].children.splice(offset, 0, {
          type: 'br',
          style: {
            fontStyle: 'normal',
            fontWeight: 'regular',
            color: 'black',
            backgroundColor: 'white',
            width: 'auto',
            height: 'auto',
          },
          content: '',
        });

        setBlockList(updatedBlockList);
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

    const mergeLine = (i: number, currentChildNodeIndex: number) => {
      const updatedBlockList = [...blockList];
      const newChildren = [...block.children];
      newChildren.splice(currentChildNodeIndex - 1, 1);
      updatedBlockList[i] = { ...updatedBlockList[i], children: newChildren };

      setBlockList(updatedBlockList);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, i: number) => {
      if (
        event.key === keyName.arrowUp ||
        event.key === keyName.arrowDown ||
        event.key === keyName.arrowLeft ||
        event.key === keyName.arrowRight
      ) {
        getCurrentChildNodeIndex(event);
      }

      if (event.key === keyName.enter && !event.shiftKey) {
        event.preventDefault();
        setIsTyping(false);
        setKey(Math.random());
        splitBlock(i);
      }

      if (event.key === keyName.enter && event.shiftKey) {
        event.preventDefault();
        setIsTyping(false);
        setKey(Math.random());
        splitLine(i);
      }

      if (event.key === keyName.backspace) {
        const selection = window.getSelection();
        const cursorPosition = selection?.focusOffset || 0;

        const range = selection?.getRangeAt(0);
        const container = range?.startContainer;
        const parent = blockRef.current[i];
        const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);
        const currentChildNodeIndex =
          childNodes.indexOf(container as HTMLElement) === -1 &&
          container?.nodeType === Node.TEXT_NODE
            ? childNodes.indexOf(container.parentNode as HTMLElement)
            : childNodes.indexOf(container as HTMLElement);

        // 첫 블록 첫 커서에서 백스페이스 방지
        if (
          i === 0 &&
          (currentChildNodeIndex === -1 || currentChildNodeIndex === 0) &&
          cursorPosition === 0
        ) {
          event.preventDefault();
          return;
        }

        if (currentChildNodeIndex === -1) {
          // 한 줄이 다 지워졌을 때 줄 합치기 로직
          event.preventDefault();
          setIsTyping(false);
          setKey(Math.random());
          const updatedBlockList = [...blockList];

          if (
            (updatedBlockList[i].children[cursorPosition - 1].type === 'br' &&
              updatedBlockList[i].children[cursorPosition - 2].type !== 'br' &&
              !updatedBlockList[i].children[cursorPosition + 1]) ||
            updatedBlockList[i].children.length !== blockRef.current[i]?.childNodes.length
          ) {
            updatedBlockList[i].children.splice(cursorPosition - 1, 2);
          } else {
            updatedBlockList[i].children.splice(cursorPosition, 1);
          }

          setBlockList(updatedBlockList);

          // TODO: 한 줄이 다 지워졌을 때 블록 합치기 로직

          return;
        }

        // 줄 또는 블록 합치기 로직
        if (cursorPosition === 0) {
          event.preventDefault();
          setIsTyping(false);
          setKey(Math.random());
          if (currentChildNodeIndex <= 0) {
            mergeBlock(i);
          } else if (currentChildNodeIndex > 0) {
            mergeLine(i, currentChildNodeIndex);
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
        onClick={getCurrentChildNodeIndex}
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
