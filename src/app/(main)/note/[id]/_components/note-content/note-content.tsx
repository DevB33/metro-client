'use client';

import { useState, useRef, useEffect } from 'react';
import { css } from '@/../styled-system/css';

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
  position: 'fixed',
  left: '0',
  right: '0',
  width: '100vw',
  height: 'var(--block-height)',
  zIndex: '-1',

  pointerEvents: 'auto',
});

const NoteContent = () => {
  const blockButtonRef = useRef<(HTMLDivElement | null)[]>([]);
  const blockRef = useRef<(HTMLDivElement | null)[]>([]);
  const noteRef = useRef<HTMLDivElement | null>(null);
  const selectionMenuRef = useRef<HTMLDivElement | null>(null);

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

  const [isSlashMenuOpen, setIsSlashMenuOpen] = useState<boolean[]>([]);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 });

  const [isSelectionMenuOpen, setIsSelectionMenuOpen] = useState(true);
  const [selectionMenuPosition, setSelectionMenuPosition] = useState({ x: 0, y: 0 });

  const updateBlockButtonPosition = (index: number) => {
    const blockEl = blockRef.current[index];
    const buttonEl = blockButtonRef.current[index];

    if (blockEl && buttonEl) {
      const rect = blockEl.getBoundingClientRect();
      buttonEl.style.position = 'absolute';
      buttonEl.style.top = '12px';
      buttonEl.style.right = `${rect.right + 24}px`;
      buttonEl.style.display = 'flex';
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
    blockButtonRef.current[index]?.style.setProperty('display', 'none');
  };

  useEffect(() => {
    setIsSlashMenuOpen(Array(blockList.length).fill(false));
  }, [blockList.length]);

  // isSlashMenuOpen 상태에 따라 스크롤 막기
  useEffect(() => {
    const grandParent = noteRef.current?.parentElement?.parentElement;
    if (!grandParent) return;
    const isAnyMenuOpen = isSlashMenuOpen.some(state => state === true);
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
    };

    const handleOutsideClick = (event: MouseEvent) => {
      if (blockRef.current.some(block => block?.contains(event.target as Node))) {
        return;
      }

      if (blockRef.current && !blockRef.current.some(block => block?.contains(event.target as Node))) {
        isDraggingRef.current = true;
        if (selectionMenuRef.current && !selectionMenuRef.current.contains(event.target as Node)) {
          resetSelection();
        }

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

  const fakeBoxRef = useRef<(HTMLDivElement | null)[]>([]);

  const getNodeBounds = (node: Node, startOffset: number, endOffset: number) => {
    const range = document.createRange();
    range.setStart(node as Node, startOffset);
    range.setEnd(node as Node, endOffset);
    return range.getBoundingClientRect();
  };

  const handleFakeBoxMouseEnter = (index: number) => {
    if (!isDragging) return;
    const parent = blockRef.current[index];
    const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);

    setSelectionEndPosition((prev: ISelectionPosition) => ({
      ...prev,
      blockIndex: index,
    }));

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
  };

  const handleFakeBoxMouseLeave = (index: number) => {
    if (!isDragging) return;

    const parent = blockRef.current[index];
    const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);

    if (selectionStartPosition.blockIndex === selectionEndPosition.blockIndex) {
      if (isUp && selectionStartPosition.blockIndex === 0) {
        const el = blockRef.current[index];
        if (!el) return;
        el.style.backgroundImage = `none`;
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

  useEffect(() => {
    // 각 블록에 대해 반복하여 해당하는 fakeBox 높이 설정
    blockRef.current.forEach((block, index) => {
      if (block && fakeBoxRef.current[index]) {
        const blockHeight = block.offsetHeight;
        if (blockHeight) {
          fakeBoxRef.current[index]?.style.setProperty('height', `${blockHeight}px`);
        }
      }
    });
  }, [key, blockList]);

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        style={{ pointerEvents: 'none' }}
        key={key}
        ref={noteRef}
        onMouseUp={() =>
          handleMouseUp(
            blockRef,
            selectionStartPosition,
            selectionEndPosition,
            setIsSelectionMenuOpen,
            setSelectionMenuPosition,
          )
        }
        onMouseDown={() => setIsSelectionMenuOpen(false)}
        onKeyDown={() => setIsSelectionMenuOpen(false)}
      >
        {blockList.map((block, index) => (
          <div
            role="button"
            tabIndex={0}
            key={block.id}
            className={blockContainer}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
            onKeyDown={() => handleMouseLeave(index)}
            onMouseMove={() => handleMouseEnter(index)}
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
                <BlockButton />
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
