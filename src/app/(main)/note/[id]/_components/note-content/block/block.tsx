import { useState, memo, useRef, useEffect } from 'react';
import { css } from '@/../styled-system/css';

import { ITextBlock } from '@/types/block-type';
import keyName from '@/constants/key-name';
import placeholder from '@/constants/placeholder';
import handleInput from './_handler/handleInput';

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
    const prevChildNodesLength = useRef(0);

    useEffect(() => {
      prevChildNodesLength.current = blockList[index].children.length;
    }, [blockList, index]);

    const splitBlock = (i: number) => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const container = range.startContainer;
      const offset = range.startOffset;
      const parent = blockRef.current[i];
      const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);
      const currentChildNodeIndex =
        childNodes.indexOf(container as HTMLElement) === -1 &&
        container?.nodeType === Node.TEXT_NODE
          ? childNodes.indexOf(container.parentNode as HTMLElement)
          : childNodes.indexOf(container as HTMLElement);

      const beforeText =
        currentChildNodeIndex === -1 ? '' : container.textContent?.slice(0, offset) || '';
      const afterText =
        currentChildNodeIndex === -1 ? '' : container.textContent?.slice(offset) || '';

      const beforeBlock = childNodes
        .filter((_node, idx) => {
          return currentChildNodeIndex === -1 ? idx <= offset : idx <= currentChildNodeIndex;
        })
        .map((node, idx) => {
          if ((currentChildNodeIndex === -1 && idx === offset) || idx === currentChildNodeIndex) {
            if (beforeText === '' && idx !== 0) {
              return;
            }

            if (node.nodeName === 'SPAN') {
              const newNode = document.createElement('span');
              newNode.style.cssText = node.style.cssText;
              newNode.textContent = beforeText;
              return newNode;
            }

            const newNode = document.createTextNode(beforeText);
            return newNode;
          }
          return node;
        })
        .filter(node => node != null);

      const afterBlock = childNodes
        .filter((_node, idx) => {
          return currentChildNodeIndex === -1 ? idx >= offset : idx >= currentChildNodeIndex;
        })
        .map((node, idx) => {
          if (idx === 0) {
            const filteredNodeCount = childNodes.filter(n => n != null).length;
            if (afterText === '' && idx !== filteredNodeCount - 1) {
              return;
            }

            if (node.nodeName === 'SPAN') {
              const newNode = document.createElement('span');
              newNode.style.cssText = node.style.cssText;
              newNode.textContent = afterText;
              return newNode;
            }

            const newNode = document.createTextNode(afterText);
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

        if (node.nodeName === 'SPAN') {
          return {
            type: 'span' as 'span',
            style: {
              fontStyle: node instanceof HTMLElement ? node.style.fontStyle : 'normal',
              fontWeight: node instanceof HTMLElement ? node.style.fontWeight : 'regular',
              color: node instanceof HTMLElement ? node.style.color : 'black',
              backgroundColor: node instanceof HTMLElement ? node.style.backgroundColor : 'white',
              width: 'auto',
              height: 'auto',
            },
            content: node.textContent,
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

        if (node.nodeName === 'SPAN') {
          return {
            type: 'span' as 'span',
            style: {
              fontStyle: node instanceof HTMLElement ? node.style.fontStyle : 'normal',
              fontWeight: node instanceof HTMLElement ? node.style.fontWeight : 'regular',
              color: node instanceof HTMLElement ? node.style.color : 'black',
              backgroundColor: node instanceof HTMLElement ? node.style.backgroundColor : 'white',
              width: 'auto',
              height: 'auto',
            },
            content: node.textContent,
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

      // 한 줄의 맨 앞에 커서를 두고 블록 나눌 때 beforeBlock 맨 뒤에 br 추가
      if (newBeforeBlock[newBeforeBlock.length - 1]?.type === 'br' && beforeText === '') {
        newBeforeBlock.push({
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

      // 빈 줄에서 블록 나눌 때 afterBlock 맨 앞에 br 추가
      if (beforeText === '' && afterText === '') {
        newAfterBlock.unshift({
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
      const currentChildNodeIndex =
        childNodes.indexOf(container as HTMLElement) === -1 &&
        container?.nodeType === Node.TEXT_NODE
          ? childNodes.indexOf(container.parentNode as HTMLElement)
          : childNodes.indexOf(container as HTMLElement);
      const newChildren = [...block.children];

      if (container.nodeType === Node.TEXT_NODE) {
        const textBefore = container.textContent?.substring(0, offset);
        const textAfter = container.textContent?.substring(offset);

        // 줄 바꿈이 반영된 children 배열 생성
        const updatedChildren = [
          ...newChildren.slice(0, currentChildNodeIndex),
          textBefore && {
            type: (container.parentNode as Element)?.tagName === 'DIV' ? 'text' : 'span',
            style: {
              fontStyle:
                (container.parentNode as Element)?.tagName === 'DIV'
                  ? 'normal'
                  : (container.parentNode as HTMLElement)?.style.fontStyle || 'normal',
              fontWeight:
                (container.parentNode as Element)?.tagName === 'DIV'
                  ? 'regular'
                  : (container.parentNode as HTMLElement)?.style.fontWeight || 'regular',
              color:
                (container.parentNode as Element)?.tagName === 'DIV'
                  ? 'black'
                  : (container.parentNode as HTMLElement)?.style.color || 'black',
              backgroundColor:
                (container.parentNode as Element)?.tagName === 'DIV'
                  ? 'white'
                  : (container.parentNode as HTMLElement)?.style.backgroundColor || 'white',
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
            type: (container.parentNode as Element)?.tagName === 'DIV' ? 'text' : 'span',
            style: {
              fontStyle:
                (container.parentNode as Element)?.tagName === 'DIV'
                  ? 'normal'
                  : (container.parentNode as HTMLElement)?.style.fontStyle || 'normal',
              fontWeight:
                (container.parentNode as Element)?.tagName === 'DIV'
                  ? 'regular'
                  : (container.parentNode as HTMLElement)?.style.fontWeight || 'regular',
              color:
                (container.parentNode as Element)?.tagName === 'DIV'
                  ? 'black'
                  : (container.parentNode as HTMLElement)?.style.color || 'black',
              backgroundColor:
                (container.parentNode as Element)?.tagName === 'DIV'
                  ? 'white'
                  : (container.parentNode as HTMLElement)?.style.backgroundColor || 'white',
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

        // 줄의 맨 마지막에서 줄바꿈을 할 떄는 <br> 태그가 하나 더 추가 되야함 ex) 줄바꿈 후 두 번째 줄이 빈 문자열일 때: ""<br><br>
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

        const updatedBlockList = [...blockList];
        updatedBlockList[i] = {
          ...updatedBlockList[i],
          children: updatedChildren as ITextBlock['children'],
        };
        setBlockList(updatedBlockList);
      } else {
        // 현재 커서 위치 한 곳이 빈 문자열일 때 → 중복 줄바꿈 로직
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

        // 한 줄이 다 지워졌을 때
        if (currentChildNodeIndex === -1) {
          event.preventDefault();
          setIsTyping(false);
          setKey(Math.random());

          if (cursorPosition === 0) {
            // 블록 합치기 로직
            mergeBlock(i);
          } else {
            // 줄 합치기 로직
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
          }

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
        onInput={event => {
          setIsTyping(true);
          handleInput(event, index, blockList, setBlockList, blockRef, prevChildNodesLength);
        }}
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
