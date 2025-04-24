'use client';

import { useState, useRef, useEffect } from 'react';
import { css } from '@/../styled-system/css';

import getSelectionInfo from '@/utils/getSelectionInfo';
import { ITextBlock } from '@/types/block-type';
import fillHTMLElementBackgroundImage from '@/utils/fillHTMLElementBackgroundImage';
import ISelectionPosition from '@/types/selection-position';
import Block from './block/block';
import BlockButton from './block-button';
import SelectionMenu from './block/selection-menu';
import handleMouseUp from './block/_handler/handleMouseUp';

const blockContainer = css({
  boxSizing: 'content-box',
  position: 'relative',
  width: '44.5rem',
  display: 'flex',
  flexDirection: 'row',
  px: '5rem',
  mb: '0.5rem',
});

const fakeBox = css({
  position: 'absolute',
  width: '100vw',
  left: '50%',
  height: 'var(--block-height)',
  transform: 'translateX(-50%)',
  zIndex: '1',

  pointerEvents: 'auto',
});

const NoteContent = () => {
  const blockContainerRef = useRef<(HTMLDivElement | null)[]>([]);
  const blockButtonRef = useRef<(HTMLDivElement | null)[]>([]);
  const blockRef = useRef<(HTMLDivElement | null)[]>([]);
  const fakeBoxRef = useRef<(HTMLDivElement | null)[]>([]);
  const noteRef = useRef<HTMLDivElement | null>(null);
  const selectionMenuRef = useRef<HTMLDivElement | null>(null);
  const [dragBlockIndex, setDragBlockIndex] = useState<number | null>(null);

  const [blockList, setBlockList] = useState<ITextBlock[]>([
    {
      id: 1,
      type: 'default',
      children: [
        {
          type: 'text',
          content: '',
        },
      ],
    },
  ]);

  const [key, setKey] = useState(Date.now());
  const [isTyping, setIsTyping] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [isUp, setIsUp] = useState(false);

  const [selectionStartPosition, setSelectionStartPosition] = useState({
    blockIndex: 0,
    childNodeIndex: 0,
    offset: 0,
  });
  const [selectionEndPosition, setSelectionEndPosition] = useState({
    blockIndex: 0,
    childNodeIndex: 0,
    offset: 0,
  });

  const [isSlashMenuOpen, setIsSlashMenuOpen] = useState<boolean>(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 });

  const [isSelectionMenuOpen, setIsSelectionMenuOpen] = useState(true);
  const [selectionMenuPosition, setSelectionMenuPosition] = useState({ x: 0, y: 0 });

  const [isBlockMenuOpen, setIsBlockMenuOpen] = useState(false);
  const isSelection = useRef(false);

  const OpenBlockMenu = () => {
    setIsBlockMenuOpen(true);
  };

  const CloseBlockMenu = () => {
    setIsBlockMenuOpen(false);
  };

  const updateBlockButtonPosition = (index: number) => {
    const blockEl = blockRef.current[index];
    const buttonEl = blockButtonRef.current[index];
    const fakeBoxEl = fakeBoxRef.current[index];

    if (blockEl && buttonEl && fakeBoxEl) {
      const blockRect = blockEl.getBoundingClientRect();
      const containerRect = fakeBoxEl.getBoundingClientRect(); // relative 기준 부모

      const offsetLeft = blockRect.left - containerRect.left;
      const blockType = blockEl.getAttribute('data-placeholder');

      let left = offsetLeft - 50;
      let top = 12;

      switch (blockType) {
        case '리스트':
          left = offsetLeft - 70;
          top = 12;
          break;
        case '비어 있는 인용':
          left = offsetLeft - 70;
          top = 40;
          break;
        case '제목1':
          top = 24;
          break;
        case '제목2':
          top = 16;
          break;
        case '제목3':
          top = 14;
          break;
        default:
          left = offsetLeft - 50;
          top = 12;
          break;
      }

      buttonEl.style.position = 'fixed';
      buttonEl.style.top = `${top}px`;
      buttonEl.style.left = `${left}px`;
      buttonEl.style.display = 'flex';
      buttonEl.style.backgroundColor = 'red';
    }
  };

  const resetSelection = () => {
    setSelectionStartPosition({ blockIndex: 0, childNodeIndex: 0, offset: 0 });
    setSelectionEndPosition({ blockIndex: 0, childNodeIndex: 0, offset: 0 });
  };

  const handleMouseEnter = (index: number) => {
    updateBlockButtonPosition(index);
  };

  const handleMouseLeave = (index: number) => {
    if (isBlockMenuOpen) return;
    blockButtonRef.current[index]?.style.setProperty('display', 'none');
  };

  const hasSelection = () => {
    const { blockIndex: startBlock, childNodeIndex: startChild, offset: startOffset } = selectionStartPosition;
    const { blockIndex: endBlock, childNodeIndex: endChild, offset: endOffset } = selectionEndPosition;
    if (startBlock !== endBlock || startChild !== endChild || startOffset !== endOffset) isSelection.current = true;
    else isSelection.current = false;
  };

  const getNodeBounds = (node: Node, startOffset: number, endOffset: number) => {
    const range = document.createRange();
    range.setStart(node as Node, startOffset);
    range.setEnd(node as Node, endOffset);
    return range.getBoundingClientRect();
  };

  useEffect(() => {
    hasSelection();

    let left = 99999;
    let top = 0;

    const parent =
      selectionStartPosition.blockIndex < selectionEndPosition.blockIndex
        ? blockRef.current[selectionStartPosition.blockIndex]
        : blockRef.current[selectionEndPosition.blockIndex];
    const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);

    childNodes.forEach(childNode => {
      const rect = getNodeBounds(
        childNode as Node,
        selectionStartPosition.blockIndex < selectionEndPosition.blockIndex
          ? selectionStartPosition.offset
          : selectionEndPosition.offset,
        parent?.textContent?.length || (0 as number),
      );
      left = Math.min(left, rect.left);
      top = Math.max(top, rect.top);
    });

    setSelectionMenuPosition({
      x: left,
      y: top,
    });
  }, [selectionStartPosition, selectionEndPosition]);

  useEffect(() => {
    setIsSlashMenuOpen(false);
  }, []);

  // isSlashMenuOpen 상태에 따라 스크롤 막기
  useEffect(() => {
    const grandParent = noteRef.current?.parentElement?.parentElement;
    if (!grandParent) return;
    const isAnyMenuOpen = isSlashMenuOpen;
    if (isAnyMenuOpen) {
      grandParent.style.overflowY = 'hidden';
    } else {
      grandParent.style.overflowY = '';
    }

    return () => {
      grandParent.style.overflow = '';
    };
  }, [isSlashMenuOpen]);

  const isDraggingRef = useRef(false);

  const prevClientY = useRef(0);

  useEffect(() => {
    const handleOutsideMouseUp = (event: MouseEvent) => {
      if (blockRef.current.some(block => block?.contains(event.target as Node))) {
        return;
      }
      setIsDragging(false);
      isDraggingRef.current = false;
      if (isSelection.current) setIsSelectionMenuOpen(true);
    };

    const handleOutsideClick = (event: MouseEvent) => {
      if (blockRef.current.some(block => block?.contains(event.target as Node))) {
        return;
      }

      isDraggingRef.current = true;
      if (selectionMenuRef.current) {
        if (!selectionMenuRef.current.contains(event.target as Node)) resetSelection();
        setKey(Math.random());
      }
    };

    const handleOutsideDrag = (event: MouseEvent) => {
      if (prevClientY.current < event.clientY) {
        setIsUp(false);
        prevClientY.current = event.clientY;
      } else if (prevClientY.current > event.clientY) {
        setIsUp(true);
        prevClientY.current = event.clientY;
      }
      if (!isDraggingRef.current) return;
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
    };

    document.addEventListener('mouseup', handleOutsideMouseUp);
    document.addEventListener('mousedown', handleOutsideClick, true);
    document.addEventListener('mousemove', handleOutsideDrag);

    return () => {
      document.removeEventListener('mouseup', handleOutsideMouseUp);
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('mousemove', handleOutsideDrag);
    };
  }, []);

  const handleFakeBoxMouseEnter = (index: number) => {
    if (isTyping) {
      const { startOffset, startContainer } = getSelectionInfo(0) || {};
      const blockIndex = blockRef.current.findIndex(blockEl => blockEl && blockEl.contains(startContainer as Node));
      const parent = blockRef.current[blockIndex];
      const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);
      const currentChildNodeIndex =
        childNodes.indexOf(startContainer as HTMLElement) === -1 && startContainer?.nodeType === Node.TEXT_NODE
          ? childNodes.indexOf(startContainer.parentNode as HTMLElement)
          : childNodes.indexOf(startContainer as HTMLElement);

      setIsTyping(false);
      setKey(Math.random());

      setTimeout(() => {
        const range = document.createRange();
        const targetNode = blockRef.current[blockIndex]?.childNodes[currentChildNodeIndex];
        range.setStart(targetNode as Node, startOffset || 0);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }, 100);
    }

    if (!isDragging) return;
    const parent = blockRef.current[index];
    const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);

    const textLength = parent?.textContent?.length || 0;

    setSelectionEndPosition((prev: ISelectionPosition) => ({
      ...prev,
      blockIndex: index,
    }));

    // 로컬 변수를 활용해 비동기적 함수 처리
    const selectionEnd = {
      ...selectionEndPosition,
      blockIndex: index,
    };

    let left = 99999;
    let right = 0;

    if (selectionStartPosition.blockIndex === selectionEnd.blockIndex) {
      childNodes.forEach(childNode => {
        const rect = getNodeBounds(childNode as Node, 0, selectionStartPosition.offset as number);
        left = Math.min(left, rect.left);
        right = Math.max(right, rect.right);
        const blockElement = blockRef.current[index];
        const blockElementMarginLeft = blockElement?.getBoundingClientRect().left || 0;

        if (!blockElement) return;
        fillHTMLElementBackgroundImage(blockElement, left - blockElementMarginLeft, right - blockElementMarginLeft);
      });
    }

    if (selectionStartPosition.blockIndex > selectionEnd.blockIndex) {
      childNodes.forEach(childNode => {
        const rect = getNodeBounds(childNode as Node, 0, childNode.textContent?.length as number);
        left = Math.min(left, rect.left);
        right = Math.max(right, rect.right);
        const blockElement = blockRef.current[index];
        const blockElementMarginLeft = blockElement?.getBoundingClientRect().left || 0;

        if (!blockElement) return;
        fillHTMLElementBackgroundImage(blockElement, left - blockElementMarginLeft, right - blockElementMarginLeft);
      });
    }
    if (selectionStartPosition.blockIndex < selectionEnd.blockIndex) {
      setSelectionEndPosition((prev: ISelectionPosition) => ({
        ...prev,
        offset: textLength,
      }));
      childNodes.forEach(childNode => {
        const rect = getNodeBounds(childNode as Node, 0, childNode.textContent?.length as number);
        left = Math.min(left, rect.left);
        right = Math.max(right, rect.right);
        const blockElement = blockRef.current[index];
        const blockElementMarginLeft = blockElement?.getBoundingClientRect().left || 0;

        if (!blockElement) return;
        fillHTMLElementBackgroundImage(blockElement, left - blockElementMarginLeft, right - blockElementMarginLeft);
      });
    }
  };

  const handleFakeBoxMouseLeave = (index: number) => {
    if (!isDragging) return;

    const parent = blockRef.current[index];
    const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);
    const textLength = parent?.textContent?.length || 0;

    if (selectionStartPosition.blockIndex === selectionEndPosition.blockIndex) {
      if (isUp && selectionStartPosition.blockIndex === 0) {
        const el = blockRef.current[index];
        if (!el) return;
        el.style.backgroundImage = `none`;
      }
      if (!isUp) {
        let left = 99999;
        let right = 0;

        childNodes.forEach(childNode => {
          const rect = getNodeBounds(
            childNode as Node,
            selectionStartPosition.offset,
            childNode.textContent?.length as number,
          );
          left = Math.min(left, rect.left);
          right = Math.max(right, rect.right);
          const blockElement = blockRef.current[index];
          const blockElementMarginLeft = blockElement?.getBoundingClientRect().left || 0;

          if (!blockElement) return;
          fillHTMLElementBackgroundImage(blockElement, left - blockElementMarginLeft, right - blockElementMarginLeft);
        });
      }
    }

    // 아래로 드래그한 상태에서 블록을 떠날 때
    if (selectionStartPosition.blockIndex < selectionEndPosition.blockIndex) {
      if (index === selectionEndPosition.blockIndex && isUp) {
        const el = blockRef.current[index];
        if (!el) return;
        el.style.backgroundImage = `none`;
      }
      // 아래로 드래그 할 때
      if (index !== selectionStartPosition.blockIndex && index === selectionEndPosition.blockIndex && !isUp) {
        let left = 99999;
        let right = 0;
        childNodes.forEach(childNode => {
          const rect = getNodeBounds(childNode as Node, 0, childNode.textContent?.length as number);
          left = Math.min(left, rect.left);
          right = Math.max(right, rect.right);
          const blockElement = blockRef.current[index];
          const blockElementMarginLeft = blockElement?.getBoundingClientRect().left || 0;
          if (!blockElement) return;
          fillHTMLElementBackgroundImage(blockElement, left - blockElementMarginLeft, right - blockElementMarginLeft);
        });
        setSelectionEndPosition((prev: ISelectionPosition) => ({
          ...prev,
          offset: textLength,
        }));
      }
    }
    // 위로 드래그한 상태에서 블록을 떠날 때
    if (selectionStartPosition.blockIndex > selectionEndPosition.blockIndex) {
      // 아래로 드래그 할 때
      if (index !== selectionStartPosition.blockIndex && index === selectionEndPosition.blockIndex && !isUp) {
        const el = blockRef.current[index];
        if (!el) return;
        el.style.backgroundImage = `none`;
      }

      // 위로 드래그 할 때
      if (index !== selectionStartPosition.blockIndex && index === selectionEndPosition.blockIndex && isUp) {
        let left = 99999;
        let right = 0;
        childNodes.forEach(childNode => {
          const rect = getNodeBounds(childNode as Node, 0, childNode.textContent?.length as number);
          left = Math.min(left, rect.left);
          right = Math.max(right, rect.right);
          const blockElement = blockRef.current[index];
          const blockElementMarginLeft = blockElement?.getBoundingClientRect().left || 0;
          if (!blockElement) return;
          fillHTMLElementBackgroundImage(blockElement, left - blockElementMarginLeft, right - blockElementMarginLeft);
        });
      }
    }
  };

  const deleteBlockByIndex = (indexToDelete: number) => {
    if (blockList.length === 1) return;
    setBlockList(prev => prev.filter((_, index) => index !== indexToDelete));
    setKey(Math.random());
  };

  const createBlock = (index: number) => {
    const newBlock: ITextBlock = {
      id: Date.now(), // 고유 ID
      type: 'default',
      children: [
        {
          type: 'text',
          content: '',
        },
      ],
    };

    setBlockList(prev => {
      const newList = [...prev];
      newList.splice(index + 1, 0, newBlock);
      return newList;
    });

    setTimeout(() => {
      (blockRef.current[index + 1]?.parentNode as HTMLElement)?.focus();
    }, 0);
  };

  useEffect(() => {
    // 각 블록에 대해 반복하여 해당하는 fakeBox 높이 설정
    blockContainerRef.current.forEach((block, index) => {
      if (block && fakeBoxRef.current[index]) {
        const blockHeight = block.offsetHeight;
        if (blockHeight) {
          fakeBoxRef.current[index]?.style.setProperty('height', `${blockHeight}px`);
        }
      }
    });
  }, [key, blockList]);

  return (
    <div style={{ pointerEvents: 'none' }}>
      <div
        role="button"
        tabIndex={0}
        key={key}
        ref={noteRef}
        onMouseDown={() => setIsSelectionMenuOpen(false)}
        onKeyDown={() => setIsSelectionMenuOpen(false)}
      >
        {blockList.map((block, index) => (
          <div
            role="button"
            tabIndex={0}
            key={block.id}
            className={blockContainer}
            ref={element => {
              blockContainerRef.current[index] = element;
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
            onKeyDown={() => handleMouseLeave(index)}
            onMouseMove={() => handleMouseEnter(index)}
            onMouseUp={event =>
              handleMouseUp(
                event,
                index,
                blockRef,
                selectionStartPosition,
                selectionEndPosition,
                setIsSelectionMenuOpen,
                setSelectionMenuPosition,
              )
            }
          >
            <div
              className={fakeBox}
              ref={element => {
                fakeBoxRef.current[index] = element;
              }}
              onMouseEnter={() => handleFakeBoxMouseEnter(index)}
              onMouseLeave={() => handleFakeBoxMouseLeave(index)}
            >
              <div
                className={css({ display: 'none' })}
                ref={element => {
                  blockButtonRef.current[index] = element;
                }}
              >
                <BlockButton
                  OpenBlockMenu={OpenBlockMenu}
                  CloseBlockMenu={CloseBlockMenu}
                  deleteBlockByIndex={deleteBlockByIndex}
                  createBlock={createBlock}
                  index={index}
                  block={block}
                  blockList={blockList}
                  setBlockList={setBlockList}
                  blockRef={blockRef}
                  setDragBlockIndex={setDragBlockIndex}
                  setIsTyping={setIsTyping}
                />
              </div>
            </div>
            <Block
              index={index}
              block={block}
              blockRef={blockRef}
              blockList={blockList}
              setBlockList={setBlockList}
              isTyping={isTyping}
              setIsTyping={setIsTyping}
              setKey={setKey}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
              isUp={isUp}
              setIsUp={setIsUp}
              selectionStartPosition={selectionStartPosition}
              setSelectionStartPosition={setSelectionStartPosition}
              selectionEndPosition={selectionEndPosition}
              setSelectionEndPosition={setSelectionEndPosition}
              isSlashMenuOpen={isSlashMenuOpen}
              setIsSlashMenuOpen={setIsSlashMenuOpen}
              slashMenuPosition={slashMenuPosition}
              setSlashMenuPosition={setSlashMenuPosition}
              dragBlockIndex={dragBlockIndex}
              isSelectionMenuOpen={isSelectionMenuOpen}
            />
          </div>
        ))}
      </div>
      {isSelectionMenuOpen && (
        <div ref={selectionMenuRef}>
          <SelectionMenu
            position={selectionMenuPosition}
            setKey={setKey}
            selectionStartPosition={selectionStartPosition}
            selectionEndPosition={selectionEndPosition}
            blockList={blockList}
            setBlockList={setBlockList}
            blockRef={blockRef}
            setIsSelectionMenuOpen={setIsSelectionMenuOpen}
            resetSelection={resetSelection}
          />
        </div>
      )}
    </div>
  );
};

export default NoteContent;
