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
  endOffset: number;
  setEndOffset: (endOffset: number) => void;
  startBlockIndex: number;
  setStartBlockIndex: (startBlockIndex: number) => void;
  endBlockIndex: number;
  setEndBlockIndex: (endBlockIndex: number) => void;
  startChildNodeIndex: number;
  setStartChildNodeIndex: (startChildNodeIndex: number) => void;
  endChildNodeIndex: number;
  setEndChildNodeIndex: (endChildNodeIndex: number) => void;
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
    endOffset,
    setEndOffset,
    startBlockIndex,
    setStartBlockIndex,
    endBlockIndex,
    setEndBlockIndex,
    startChildNodeIndex,
    setStartChildNodeIndex,
    endChildNodeIndex,
    setEndChildNodeIndex,
    isUp,
    setIsUp,
  }: IBlockComponent) => {
    const prevChildNodesLength = useRef(0);

    const prevClientY = useRef(0);

    const selectedBlockIndex = useRef<number | null>(null);

    useEffect(() => {
      prevChildNodesLength.current = blockList[index].children.length;
    }, [blockList, index]);

    const handleMouseDown = (e: any) => {
      const parent = blockRef.current[index];
      const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);
      const textNode = document.caretPositionFromPoint(e.clientX, e.clientY)?.offsetNode;
      const currentChildNodeIndex =
        childNodes.indexOf(textNode as HTMLElement) === -1 && textNode?.nodeType === Node.TEXT_NODE
          ? childNodes.indexOf(textNode.parentNode as HTMLElement)
          : childNodes.indexOf(textNode as HTMLElement);

      setIsDragging(true);
      setIsTyping(false);
      setKey(Math.random());

      selectedBlockIndex.current = index;

      const range = document.createRange();
      const charIdx = document.caretPositionFromPoint(e.clientX, e.clientY)?.offset as number;

      setStartOffset(charIdx);
      setStartBlockIndex(index);
      setStartChildNodeIndex(currentChildNodeIndex);

      setTimeout(() => {
        if (range) {
          blockRef.current[index]?.parentNode?.focus();
          const selection = window.getSelection();
          range?.setStart(blockRef.current[0]?.childNodes[currentChildNodeIndex] as Node, charIdx);

          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }, 0);
    };

    const handleMouseMove = (e: any) => {
      if (!isDragging) return;

      if (index !== endBlockIndex) {
        setEndBlockIndex(index);
      }

      const parent = blockRef.current[index];
      const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);
      const textNode = document.caretPositionFromPoint(e.clientX, e.clientY)?.offsetNode;
      const currentChildNodeIndex =
        childNodes.indexOf(textNode as HTMLElement) === -1 && textNode?.nodeType === Node.TEXT_NODE
          ? childNodes.indexOf(textNode.parentNode as HTMLElement)
          : childNodes.indexOf(textNode as HTMLElement);

      if (currentChildNodeIndex !== endChildNodeIndex) {
        setEndChildNodeIndex(currentChildNodeIndex);
      }

      const charIdx = document.caretPositionFromPoint(e.clientX, e.clientY)?.offset as number;
      const range = document.createRange();

      setEndOffset(charIdx);

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
      const elLeft = el?.getBoundingClientRect().left || 0;
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
      const elLeft = el?.getBoundingClientRect().left || 0;
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
        onKeyDown={event => {
          handleKeyDown(event, index, blockList, setBlockList, blockRef, setIsTyping, setKey);
        }}
        onMouseUp={() => {
          setIsDragging(false);
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
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
