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
});

const NoteContent = () => {
  const [blockList, setBlockList] = useState<ITextBlock[]>([
    { id: 1, type: 'default', children: [{ type: 'text', content: '' }] },
    { id: 2, type: 'default', children: [{ type: 'text', content: '' }] },
    { id: 3, type: 'default', children: [{ type: 'text', content: '' }] },
    { id: 4, type: 'default', children: [{ type: 'text', content: '' }] },
  ]);

  const [key, setKey] = useState(Date.now());
  const [isTyping, setIsTyping] = useState(false);
  const [startBlockIndex, setStartBlockIndex] = useState<number | null>(null);
  const blockButtonRef = useRef<(HTMLDivElement | null)[]>([]);
  const blockRef = useRef<(HTMLDivElement | null)[]>([]);
  const selectRef = useRef<Set<number>>(new Set());
  const isMouseDown = useRef(false);

  const handleMouseDown = (index: number) => {
    isMouseDown.current = true;
    setStartBlockIndex(index);
    selectRef.current.clear();
    selectRef.current.add(index);
    console.log(`Selection Start: ${Array.from(selectRef.current)}`);
  };

  const handleMouseEnter = (index: number) => {
    blockButtonRef.current[index]?.style.setProperty('display', 'flex');

    if (isMouseDown.current && startBlockIndex !== null) {
      const min = Math.min(startBlockIndex, index);
      const max = Math.max(startBlockIndex, index);

      // 시작 블록과 현재 블록 사이의 모든 블록 선택
      selectRef.current.clear();
      for (let i = min; i <= max; i++) {
        selectRef.current.add(i);
      }

      console.log(`Dragging - Selected Blocks: ${Array.from(selectRef.current)}`);
    }
  };

  const handleMouseLeave = (index: number) => {
    blockButtonRef.current[index]?.style.setProperty('display', 'none');
    // 마우스를 벗어나도 중간 블록이 선택 해제되지 않음
  };

  const handleMouseUp = () => {
    isMouseDown.current = false;
    setStartBlockIndex(null);

    const selectedBlocks = Array.from(selectRef.current);
    console.log(`Final Selection: ${selectedBlocks}`);

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      let startNode = range.startContainer;
      let { startOffset } = range;
      let endNode = range.endContainer;
      let { endOffset } = range;

      // 🔹 선택 방향 정규화
      if (range.compareBoundaryPoints(Range.START_TO_END, range) > 0) {
        [startNode, endNode] = [endNode, startNode];
        [startOffset, endOffset] = [endOffset, startOffset];
      }

      console.log(`Selection Start: Block ${selectedBlocks[0]}, Node: ${startNode.nodeName}, Offset: ${startOffset}`);
      console.log(
        `Selection End: Block ${selectedBlocks[selectedBlocks.length - 1]}, Node: ${endNode.nodeName}, Offset: ${endOffset}`,
      );
    }
  };

  return (
    <div key={key} onMouseUp={handleMouseUp}>
      {blockList.map((block, index) => (
        <div
          role="button"
          tabIndex={0}
          key={block.id}
          className={blockContainer}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={() => handleMouseLeave(index)}
          onMouseDown={() => handleMouseDown(index)}
        >
          <div
            className={css({ display: 'none' })}
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
          />
        </div>
      ))}
    </div>
  );
};

export default NoteContent;
