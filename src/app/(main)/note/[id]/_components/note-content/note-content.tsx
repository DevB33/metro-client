'use client';

import { useState, useRef } from 'react';
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
  mb: '0.5rem',
});

const NoteContent = () => {
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
  const blockButtonRef = useRef<(HTMLDivElement | null)[]>([]);
  const blockRef = useRef<(HTMLDivElement | null)[]>([]);

  const [startOffest, setStartOffset] = useState(0);
  const [endOffset, setEndOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startBlockIndex, setStartBlockIndex] = useState(0);
  const [endBlockIndex, setEndBlockIndex] = useState(0);
  const [startChildNodeIndex, setStartChildNodeIndex] = useState(0);
  const [endChildNodeIndex, setEndChildNodeIndex] = useState(0);
  const [isUp, setIsUp] = useState(false);

  const handleMouseEnter = (index: number) => {
    blockButtonRef.current[index]?.style.setProperty('display', 'flex');
  };

  const handleMouseLeave = (index: number) => {
    blockButtonRef.current[index]?.style.setProperty('display', 'none');
  };

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
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            startOffest={startOffest}
            setStartOffset={setStartOffset}
            endOffset={endOffset}
            setEndOffset={setEndOffset}
            startBlockIndex={startBlockIndex}
            setStartBlockIndex={setStartBlockIndex}
            endBlockIndex={endBlockIndex}
            setEndBlockIndex={setEndBlockIndex}
            startChildNodeIndex={startChildNodeIndex}
            setStartChildNodeIndex={setStartChildNodeIndex}
            endChildNodeIndex={endChildNodeIndex}
            setEndChildNodeIndex={setEndChildNodeIndex}
            isUp={isUp}
            setIsUp={setIsUp}
          />
        </div>
      ))}
    </div>
  );
};

export default NoteContent;
