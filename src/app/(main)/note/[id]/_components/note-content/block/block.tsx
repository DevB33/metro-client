import { memo, useRef, useEffect } from 'react';
import { css } from '@/../styled-system/css';

import { ITextBlock } from '@/types/block-type';
import handleInput from './_handler/handleInput';
import handleKeyDown from './_handler/handleKeyDown';
import BlockTag from './block-tag';

interface IBlockComponent {
  block: ITextBlock;
  index: number;
  blockRef: React.RefObject<(HTMLDivElement | null)[]>;
  blockList: ITextBlock[];
  setBlockList: (blockList: ITextBlock[]) => void;
  isTyping: boolean;
  setIsTyping: (isTyping: boolean) => void;
  setKey: (key: number) => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  startOffest: number;
  setStartOffset: (startOffset: number) => void;
  startBlockIndex: number;
  setStartBlockIndex: (startBlockIndex: number) => void;
  endBlockIndex: number;
  setEndBlockIndex: (endBlockIndex: number) => void;

  isUp: boolean;
  setIsUp: (isUp: boolean) => void;
}

const blockDiv = css({
  boxSizing: 'border-box',
  width: 'full',
  minHeight: '1.5rem',
  height: 'auto',
  outline: 'none',
  overflowY: 'hidden',
  flexShrink: 0,
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
    setKey,
    isDragging,
    setIsDragging,
    startOffest,
    setStartOffset,
    startBlockIndex,
    setStartBlockIndex,
    endBlockIndex,
    setEndBlockIndex,
    isUp,
    setIsUp,
  }: IBlockComponent) => {
    const prevChildNodesLength = useRef(0);

    const prevClientY = useRef(0);

    useEffect(() => {
      prevChildNodesLength.current = blockList[index].children.length;
    }, [blockList, index]);

    const handleMouseDown = (e: any) => {
      setIsDragging(true);
      setIsTyping(false);
      setKey(Date.now());

      const charIdx = document.caretPositionFromPoint(e.clientX, e.clientY)?.offset as number;
      setStartOffset(charIdx);
      setStartBlockIndex(index);
    };

    const handleMouseMove = (e: any) => {
      if (!isDragging) return;

      if (index !== endBlockIndex) {
        setEndBlockIndex(index);
      }

      const charIdx = document.caretPositionFromPoint(e.clientX, e.clientY)?.offset as number;
      const textNode = document.caretPositionFromPoint(e.clientX + 10, e.clientY)?.offsetNode;
      const range = document.createRange();

      if (index === startBlockIndex && index === endBlockIndex) {
        if (charIdx < startOffest) {
          range.setStart(textNode as Node, charIdx);
          range.setEnd(textNode as Node, startOffest);
        } else {
          range.setStart(textNode as Node, startOffest);
          range.setEnd(textNode as Node, charIdx);
        }
      }

      if (index !== startBlockIndex && index === endBlockIndex) {
        if (startBlockIndex < endBlockIndex) {
          range.setStart(textNode as Node, 0);
          range.setEnd(textNode as Node, charIdx);
        } else {
          range.setStart(textNode as Node, charIdx);
          range.setEnd(textNode as Node, e.target.textContent.length);
        }
      }

      if (prevClientY.current < e.clientY) {
        setIsUp(false);
        prevClientY.current = e.clientY;
      } else if (prevClientY.current > e.clientY) {
        setIsUp(true);
        prevClientY.current = e.clientY;
      }

      const rect = range.getBoundingClientRect();
      const el = blockRef.current[index];
      const elLeft = el?.getBoundingClientRect().left;
      if (!el) return;
      el.style.backgroundImage = `linear-gradient(to right,
      transparent ${rect.left - elLeft}px,
      lightblue ${rect.left - elLeft}px,
      lightblue ${rect.right - elLeft}px,
      transparent ${rect.right - elLeft}px)`;
    };

    const handleMouseLeave = (e: any) => {
      if (!isDragging) return;

      const textNode = document.caretPositionFromPoint(
        e.clientX + 10,
        isUp ? e.clientY + 10 : e.clientY - 10,
      )?.offsetNode;
      const range = document.createRange();

      if (startBlockIndex < endBlockIndex) {
        if (index !== startBlockIndex && index === endBlockIndex && !isUp) {
          range.setStart(textNode as Node, 0);
          range.setEnd(textNode as Node, e.target.textContent.length);
        }
      } else {
        if (index !== startBlockIndex && index === endBlockIndex && isUp) {
          range.setStart(textNode as Node, 0);
          range.setEnd(textNode as Node, e.target.textContent.length);
        }
      }

      if (index === startBlockIndex && index === endBlockIndex) {
        if (!isUp) {
          range.setStart(textNode as Node, startOffest);
          range.setEnd(textNode as Node, e.target.textContent.length);
        } else {
          range.setStart(textNode as Node, 0);
          range.setEnd(textNode as Node, startOffest);
        }
      }

      const rect = range.getBoundingClientRect();
      const el = blockRef.current[index];
      const elLeft = el?.getBoundingClientRect().left;
      if (!el) return;
      el.style.backgroundImage = `linear-gradient(to right,
      transparent ${rect.left - elLeft}px,
      lightblue ${rect.left - elLeft}px,
      lightblue ${rect.right - elLeft}px,
      transparent ${rect.right - elLeft}px)`;
    };

    return (
      <div
        role="textbox"
        tabIndex={0}
        contentEditable
        suppressContentEditableWarning
        className={`parent ${blockDiv}`}
        onInput={event => {
          setIsTyping(true);
          handleInput(event, index, blockList, setBlockList, blockRef, prevChildNodesLength);
        }}
        onKeyDown={event => handleKeyDown(event, index, blockList, setBlockList, blockRef, setIsTyping, setKey)}
        onMouseUp={() => setIsDragging(false)}
        onMouseDown={e => handleMouseDown(e)}
        onMouseMove={e => {
          console.log('mouse move');
          handleMouseMove(e);
        }}
        onMouseLeave={e => handleMouseLeave(e)}
      >
        <BlockTag block={block} blockList={blockList} index={index} blockRef={blockRef}>
          {block.children.length === 1 && block.children[0].content === '' && <br />}
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
        </BlockTag>
      </div>
    );
  },
  (_prevProps, nextProps) => nextProps.isTyping,
);

export default Block;
