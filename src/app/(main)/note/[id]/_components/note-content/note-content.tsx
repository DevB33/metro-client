'use client';

import { useState, useRef, useEffect } from 'react';
import { css } from '@/../styled-system/css';
import { ITextBlock } from '@/types/block-type';
import Block from './block/block';
import BlockButton from './block-button';

const blockContainer = css({
  boxSizing: 'content-box',
  position: 'relative',
  width: '44.5rem',
  display: 'flex',
  flexDirection: 'row',
  px: '5rem',
});

const NoteContent = () => {
  const [blockList, setBlockList] = useState<ITextBlock[]>([
    {
      id: 1,
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

  const [key, setKey] = useState(Date.now());
  const [isTyping, setIsTyping] = useState(false);
  const blockButtonRef = useRef<(HTMLDivElement | null)[]>([]);
  const blockRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleMouseEnter = (index: number) => {
    blockButtonRef.current[index]?.style.setProperty('display', 'flex');
  };

  const handleMouseLeave = (index: number) => {
    blockButtonRef.current[index]?.style.setProperty('display', 'none');
  };

  const [isSlashMenuOpen, setIsSlashMenuOpen] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 });

  // isSlashMenuOpen 상태에 따라 스크롤 막기
  useEffect(() => {
    if (isSlashMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto'; // cleanup
    };
  }, [isSlashMenuOpen]);
  return (
    <div key={key}>
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
            className={css({ display: 'none' })}
            ref={element => {
              // eslint-disable-next-line no-param-reassign
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
