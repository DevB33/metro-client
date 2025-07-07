import { memo, useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { mutate } from 'swr';
import { css } from '@/../styled-system/css';

import { ITextBlock } from '@/types/block-type';
import ISelectionPosition from '@/types/selection-position';
import IMenuState from '@/types/menu-type';
import { getBlockList, updateBlocksOrder } from '@/apis/block';
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
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  setKey: React.Dispatch<React.SetStateAction<number>>;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  isUp: React.RefObject<boolean>;
  selection: ISelectionPosition;
  setSelection: React.Dispatch<React.SetStateAction<ISelectionPosition>>;
  menuState: IMenuState;
  setMenuState: React.Dispatch<React.SetStateAction<IMenuState>>;
  dragBlockIndex: number | null;
}

const container = css({
  position: 'relative',
  width: 'full',
  minHeight: '1.5rem',
  height: 'auto',
  zIndex: '10',
});

const blockDiv = css({
  pointerEvents: 'auto',
  boxSizing: 'border-box',
  width: 'full',
  minHeight: '1.5rem',
  height: 'auto',
  padding: '2px 0 !important',
  outline: 'none',
  overflowY: 'hidden',
  flexShrink: 0,
  userSelect: 'none',
  '--block-height': 'auto',
});

const Block = memo(
  ({
    block,
    index,
    blockRef,
    blockList,
    isTyping: _isTyping,
    setIsTyping,
    setKey,
    isDragging,
    setIsDragging,
    selection,
    setSelection,
    menuState,
    setMenuState,
    dragBlockIndex,
    isUp,
  }: IBlockComponent) => {
    const prevChildNodesLength = useRef(0);

    const [isDragOver, setIsDragOver] = useState(false);
    const [isDragFirst, setIsDragFirst] = useState(false);

    const params = useParams();
    const noteId = params.id as string;

    useEffect(() => {
      prevChildNodesLength.current = blockList[index].nodes.length;
    }, [blockList, index]);

    const changeBlockOrder = async () => {
      setIsDragOver(false);

      await updateBlocksOrder(
        noteId,
        blockList[dragBlockIndex as number].order,
        blockList[dragBlockIndex as number].order,
        blockList[index].order,
      );

      await mutate(`blockList-${noteId}`, getBlockList(noteId), false);
    };

    const changeBlockOrderToFirst = async () => {
      setIsDragFirst(false);
      await updateBlocksOrder(
        noteId,
        blockList[dragBlockIndex as number].order,
        blockList[dragBlockIndex as number].order,
        -1,
      );

      await mutate(`blockList-${noteId}`, getBlockList(noteId), false);
    };

    return (
      <div className={container}>
        {index === 0 && (
          <div
            style={{
              width: '100%',
              height: '80px',
              position: 'absolute',
              top: '-80px',
              pointerEvents: 'auto',
            }}
            onDragEnter={event => {
              event.preventDefault();
              if (dragBlockIndex !== 0) {
                setIsDragFirst(true);
                setIsDragOver(false);
              }
            }}
            onDragLeave={() => setIsDragFirst(false)}
            onDragOver={event => event.preventDefault()}
            onDrop={changeBlockOrderToFirst}
          />
        )}
        <div
          role="textbox"
          tabIndex={0}
          contentEditable
          suppressContentEditableWarning
          className={`parent ${blockDiv}`}
          style={{
            borderBottom: isDragOver ? '4px solid lightblue' : 'none',
            borderTop: isDragFirst ? '4px solid lightblue' : 'none',
          }}
          onInput={event => {
            setIsTyping(true);
            handleInput(event, index, blockList, blockRef, prevChildNodesLength, noteId);
          }}
          onKeyDown={event => {
            setIsTyping(true);
            handleKeyDown(
              event,
              index,
              blockList,
              blockRef,
              setIsTyping,
              setKey,
              menuState,
              setMenuState,
              selection,
              noteId,
            );
          }}
          onMouseUp={event => {
            handleMouseUp(event, index, blockRef, blockList, selection, setSelection, setMenuState);
            setIsDragging(false);
          }}
          onMouseDown={event =>
            handleMouseDown(event, blockRef, index, blockList, setIsDragging, setIsTyping, setKey, setSelection)
          }
          onMouseMove={event => handleMouseMove(event, index, blockRef, blockList, isDragging, selection, setSelection)}
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
          onDrop={changeBlockOrder}
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
      </div>
    );
  },
  (_prevProps, nextProps) => nextProps.isTyping,
);

export default Block;
