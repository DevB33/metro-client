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
    { id: 1, type: 'default', children: [{ type: 'text', content: '' }] },
  ]);

  const [key, setKey] = useState(Date.now());
  const [isTyping, setIsTyping] = useState(false);
  const [startBlockIndex, setStartBlockIndex] = useState<number | null>(null);
  const blockButtonRef = useRef<(HTMLDivElement | null)[]>([]);
  const blockRef = useRef<(HTMLDivElement | null)[]>([]);
  const selectRef = useRef<Set<number>>(new Set());
  const isMouseDown = useRef(false);
  const [offsets, setOffsets] = useState(blockList.map(() => ({ startOffset: -1, endOffset: -1 })));
  const initializeOffsets = (length: number) => {
    return Array.from({ length }, () => ({ startOffset: -1, endOffset: -1 }));
  };

  const resetOffsets = () => {
    setOffsets(initializeOffsets(blockList.length));
    blockRef.current.forEach(blockElement => {
      if (blockElement) {
        blockElement.style.backgroundImage = 'none';
      }
    });
  };

  const handleMouseDown = (index: number, event: React.MouseEvent<HTMLDivElement>) => {
    resetOffsets();
    isMouseDown.current = true;
    setStartBlockIndex(index);
    selectRef.current.clear();
    selectRef.current.add(index);

    const startOffset = event.nativeEvent.offsetX; // 마우스 클릭된 X 좌표 (블록 내부 기준)

    setOffsets(prev => {
      const newOffsets = [...prev];
      newOffsets[index] = { startOffset, endOffset: -1 }; // endOffset은 아직 없으므로 -1 설정
      return newOffsets;
    });

    console.log(`Selection Start: Block ${index}, Offset: ${startOffset}`);
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

  const handleMouseUp = (index: number, event: React.MouseEvent<HTMLDivElement>) => {
    isMouseDown.current = false;
    setStartBlockIndex(null);

    const endSelectOffset = event.nativeEvent.offsetX;

    setOffsets(prev => {
      const newOffsets = [...prev];
      newOffsets[index] = { ...(newOffsets[index] || { startOffset: -1 }), endOffset: endSelectOffset };
      return newOffsets;
    });
  };

  useEffect(() => {
    const selectedArray = Array.from(selectRef.current);
    selectedArray.forEach((element, selectIndex) => {
      const blockElement = blockRef.current[element]; // 선택된 블록의 DOM 요소 가져오기
      if (!blockElement) return; // 요소가 없으면 return

      const { startOffset, endOffset } = offsets[element]; // 해당 블록의 offset 가져오기
      const width = blockElement.clientWidth;

      const textWidth = blockElement.textContent?.length * 15;

      const adjustedEndOffset = endOffset !== -1 ? Math.min(Math.round(endOffset / 15) * 15, textWidth) : textWidth;

      const startPercent = startOffset !== -1 ? ((Math.round(startOffset / 15) * 15) / width) * 100 : 0;
      const endPercent = (adjustedEndOffset / width) * 100;

      console.log(startPercent, endPercent);

      // ✅ 첫 번째 블록 (index === 0)
      if (selectIndex === 0) {
        if (startOffset === endOffset) return;
        if (startOffset !== -1 && endOffset !== -1) {
          // startOffset ~ endOffset만 칠함
          blockElement.style.backgroundImage = `linear-gradient(to right, transparent ${startPercent}%, lightblue ${startPercent}%, lightblue ${endPercent}%, transparent ${endPercent}%)`;
        } else if (startOffset !== -1) {
          // startOffset부터 endPercent까지
          blockElement.style.backgroundImage = `linear-gradient(to right, transparent ${startPercent}%, lightblue ${startPercent}%, lightblue ${endPercent}%, transparent ${endPercent}%) `;
        } else if (endOffset !== -1) {
          // 처음부터 endOffset까지
          const textWidthPercent = (textWidth / width) * 100;
          blockElement.style.backgroundImage = `linear-gradient(to right, transparent ${endPercent}%, lightblue ${endPercent}%, lightblue ${textWidthPercent}%, transparent ${textWidthPercent}%)`;
        }
      }

      // ✅ 마지막 블록 (index === selectedArray.length - 1)
      else if (selectIndex === selectedArray.length - 1) {
        if (startOffset !== -1) {
          // 처음부터 startOffset까지
          blockElement.style.backgroundImage = `linear-gradient(to right, lightblue ${startPercent}%, transparent ${startPercent}%)`;
        } else if (endOffset !== -1) {
          // endOffset부터 끝까지
          blockElement.style.backgroundImage = `linear-gradient(to right, lightblue ${endPercent}%, transparent ${endPercent}%)`;
        }
      }

      // ✅ 중간 블록 (전체 색칠)
      else {
        blockElement.style.backgroundImage = `linear-gradient(to right, lightblue 0%, lightblue ${endPercent}%, transparent ${endPercent}%)`;
      }
    });
  }, [offsets]);

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
          onMouseDown={event => handleMouseDown(index, event)}
          onMouseUp={event => handleMouseUp(index, event)}
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
