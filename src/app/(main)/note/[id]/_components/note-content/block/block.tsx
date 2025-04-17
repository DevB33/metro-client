import { memo, useState, useRef, useEffect } from 'react';
import { css } from '@/../styled-system/css';

import { ITextBlock } from '@/types/block-type';
import ISelectionPosition from '@/types/selection-position';
import handleInput from './_handler/handleInput';
import handleKeyDown from './_handler/handleKeyDown';
import handleMouseLeave from './_handler/handleMouseLeave';
import BlockHTMLTag from './block-html-tag';
import handleMouseDown from './_handler/handleMouseDown';
import handleMouseMove from './_handler/handleMouseMove';
import SlashMenu from './slash-menu';

interface IBlockComponent {
  block: ITextBlock;
  index: number;
  blockRef: React.RefObject<(HTMLDivElement | null)[]>;
  blockList: ITextBlock[];
  setBlockList: (blockList: ITextBlock[]) => void;
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  setKey: React.Dispatch<React.SetStateAction<number>>;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  isUp: boolean;
  setIsUp: React.Dispatch<React.SetStateAction<boolean>>;
  selectionStartPosition: ISelectionPosition;
  setSelectionStartPosition: React.Dispatch<React.SetStateAction<ISelectionPosition>>;
  selectionEndPosition: ISelectionPosition;
  setSelectionEndPosition: React.Dispatch<React.SetStateAction<ISelectionPosition>>;
  isSlashMenuOpen: boolean;
  setIsSlashMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  slashMenuPosition: { x: number; y: number };
  setSlashMenuPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  dragBlockIndex: number | null;
}

const blockDiv = css({
  pointerEvents: 'auto',
  boxSizing: 'border-box',
  width: 'full',
  minHeight: '1.5rem',
  height: 'auto',
  outline: 'none',
  overflowY: 'hidden',
  flexShrink: 0,
  userSelect: 'none',
  '--block-height': 'auto',
  zIndex: '1000',
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
    isUp,
    setIsUp,
    selectionStartPosition,
    setSelectionStartPosition,
    selectionEndPosition,
    setSelectionEndPosition,
    isSlashMenuOpen,
    setIsSlashMenuOpen,
    slashMenuPosition,
    setSlashMenuPosition,
    dragBlockIndex,
  }: IBlockComponent) => {
    const prevChildNodesLength = useRef(0);
    const prevClientY = useRef(0);

    const [isDragOver, setIsDragOver] = useState(false);

    useEffect(() => {
      prevChildNodesLength.current = blockList[index].children.length;
    }, [blockList, index]);

    return (
      <div
        role="textbox"
        tabIndex={0}
        contentEditable
        suppressContentEditableWarning
        className={`parent ${blockDiv}`}
        style={{
          borderBottom: isDragOver ? '4px solid lightblue' : 'none',
        }}
        onInput={event => {
          setIsTyping(true);
          handleInput(event, index, blockList, setBlockList, blockRef, prevChildNodesLength);
        }}
        onKeyDown={event =>
          handleKeyDown(
            event,
            index,
            blockList,
            setBlockList,
            blockRef,
            setIsTyping,
            setKey,
            setIsSlashMenuOpen,
            setSlashMenuPosition,
          )
        }
        onMouseUp={() => {
          setIsDragging(false);
        }}
        onMouseDown={event =>
          handleMouseDown(
            event,
            blockRef,
            index,
            blockList,
            setIsDragging,
            setIsTyping,
            setKey,
            setSelectionStartPosition,
          )
        }
        onMouseMove={event =>
          handleMouseMove(
            event,
            index,
            blockRef,
            isDragging,
            selectionStartPosition,
            selectionEndPosition,
            setSelectionEndPosition,
            setIsUp,
            prevClientY,
          )
        }
        onMouseLeave={() =>
          handleMouseLeave(index, isDragging, isUp, blockRef, selectionStartPosition, selectionEndPosition)
        }
        onDragEnter={event => {
          if (dragBlockIndex === index) {
            return;
          }
          event.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={event => {
          if (dragBlockIndex === index) {
            return;
          }
          event.preventDefault();
          const currentTarget = event.currentTarget as HTMLElement;
          const related = event.relatedTarget as HTMLElement | null;

          if (related && currentTarget.contains(related)) {
            return;
          }
          setIsDragOver(false);
        }}
        onDragOver={event => {
          event.preventDefault();
        }}
        onDrop={() => {
          // TODO: 블록 순서 변경 로직
          setIsDragOver(false);
        }}
      >
        <BlockHTMLTag block={block} blockList={blockList} index={index} blockRef={blockRef}>
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
        </BlockHTMLTag>
        {isSlashMenuOpen && (
          <SlashMenu
            position={slashMenuPosition}
            index={index}
            blockList={blockList}
            blockRef={blockRef}
            setBlockList={setBlockList}
            isSlashMenuOpen={isSlashMenuOpen}
            setIsSlashMenuOpen={setIsSlashMenuOpen}
            openedBySlashKey
          />
        )}
      </div>
    );
  },
  (_prevProps, nextProps) => nextProps.isTyping,
);

export default Block;
