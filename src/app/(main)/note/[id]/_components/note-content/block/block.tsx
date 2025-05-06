import { memo, useState, useRef, useEffect } from 'react';
import { css } from '@/../styled-system/css';

import { ITextBlock } from '@/types/block-type';
import ISelectionPosition from '@/types/selection-position';
import IMenuState from '@/types/menu-type';
import handleInput from './handler/handleInput';
import handleKeyDown from './handler/handleKeyDown';
import handleMouseLeave from './handler/handleMouseLeave';
import BlockHTMLTag from './block-html-tag';
import handleMouseDown from './handler/handleMouseDown';
import handleMouseMove from './handler/handleMouseMove';
import handleMouseUp from './handler/handleMouseUp';

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
  selection: ISelectionPosition;
  setSelection: React.Dispatch<React.SetStateAction<ISelectionPosition>>;
  menuState: IMenuState;
  setMenuState: React.Dispatch<React.SetStateAction<IMenuState>>;
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
    selection,
    setSelection,
    menuState,
    setMenuState,
    dragBlockIndex,
  }: IBlockComponent) => {
    const prevChildNodesLength = useRef(0);
    const prevClientY = useRef(0);

    const [isDragOver, setIsDragOver] = useState(false);

    useEffect(() => {
      prevChildNodesLength.current = blockList[index].nodes.length;
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
            menuState,
            setMenuState,
            selection,
          )
        }
        onMouseUp={event => {
          handleMouseUp(event, index, blockRef, selection, setMenuState);
          setIsDragging(false);
        }}
        onMouseDown={event =>
          handleMouseDown(event, blockRef, index, blockList, setIsDragging, setIsTyping, setKey, setSelection)
        }
        onMouseMove={event =>
          handleMouseMove(event, index, blockRef, isDragging, selection, setSelection, setIsUp, prevClientY)
        }
        onMouseLeave={event => handleMouseLeave(event, index, isDragging, isUp, blockRef, selection, setSelection)}
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
          {block.nodes?.length === 1 && block.nodes[0].content === '' && <br />}
          {block.nodes?.map(child => {
            if (child.type === 'br') {
              return <br key={Math.random()} />;
            }

            if (child.type === 'text' || child.content === '') {
              return child.content;
            }

            return (
              <span key={Math.random()} style={child.style}>
                {child.content}
              </span>
            );
          })}
        </BlockHTMLTag>
      </div>
    );
  },
  (_prevProps, nextProps) => nextProps.isTyping,
);

export default Block;
