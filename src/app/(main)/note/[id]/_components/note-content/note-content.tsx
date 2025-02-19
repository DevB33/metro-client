'use client';

import { useState, useRef } from 'react';
import { css } from '@/../styled-system/css';
import { ITextBlock } from '@/types/block-type';
import Block from './block';
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

  const [isTyping, setIsTyping] = useState(false);
  const [isHover, setIsHover] = useState<boolean[]>([]);
  const isHoverRef = useRef<boolean[]>([]);
  const blockRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleMouseEnter = (index: number) => {
    isHoverRef.current[index] = true;
    setIsHover([...isHoverRef.current]);
  };

  const handleMouseLeave = (index: number) => {
    isHoverRef.current[index] = false;
    setIsHover([...isHoverRef.current]);
  };

  return (
    <>
      {blockList.map((block, index) => (
        <div
          key={block.id}
          className={blockContainer}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={() => handleMouseLeave(index)}
          onKeyDown={() => handleMouseLeave(index)}
          onMouseMove={() => handleMouseEnter(index)}
        >
          {isHover[index] && <BlockButton />}
          <Block
            index={index}
            block={block}
            blockRef={blockRef}
            blockList={blockList}
            setBlockList={setBlockList}
            isTyping={isTyping}
            setIsTyping={setIsTyping}
          />
        </div>
      ))}
    </>
  );
};

export default NoteContent;
