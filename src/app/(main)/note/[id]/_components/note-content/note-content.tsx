'use client';

import { useState, useRef, useEffect } from 'react';
import { css } from '@/../styled-system/css';
import ITextBlock from '@/types/block-type';
import Block from './block/block';
import BlockButton from './block-button';

const blockContainer = css({
  boxSizing: 'content-box',
  position: 'relative',
  width: '44.5rem',
  display: 'flex',
  flexDirection: 'row',
  px: '5rem',
  mb: '0.5rem',
  pointerEvents: 'none',
});

const NoteContent = () => {
  const blockButtonRef = useRef<(HTMLDivElement | null)[]>([]);
  const blockRef = useRef<(HTMLDivElement | null)[]>([]);
  const noteRef = useRef<HTMLDivElement | null>(null);

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

  const resetSelection = () => {
    setSelectionStartPosition({ blockIndex: 0, childNodeIndex: 0, offset: 0 });
    setSelectionEndPosition({ blockIndex: 0, childNodeIndex: 0, offset: 0 });
  };

  const handleMouseEnter = (index: number) => {
    blockButtonRef.current[index]?.style.setProperty('display', 'flex');
  };

  const handleMouseLeave = (index: number) => {
    blockButtonRef.current[index]?.style.setProperty('display', 'none');
  };

  const [isSlashMenuOpen, setIsSlashMenuOpen] = useState<boolean[]>([]);

  // blockList 길이에 맞게 isSlashMenuOpen 배열을 다시 설정
  useEffect(() => {
    setIsSlashMenuOpen(Array(blockList.length).fill(false));
  }, [blockList.length]);

  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 });

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
    const handleMouseUp = (event: MouseEvent) => {
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
        resetSelection();
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

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleOutsideClick, true);
    document.addEventListener('mousemove', handleOutsideDrag);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('mousemove', handleOutsideDrag);
    };
  }, []);

  return (
    <div style={{ pointerEvents: 'none' }} key={key} ref={noteRef}>
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
            className={css({ display: 'none', pointerEvents: 'none' })}
            ref={element => {
              blockButtonRef.current[index] = element;
            }}
          >
            <BlockButton />
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
  );
};

export default NoteContent;
