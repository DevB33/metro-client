import { memo, useRef, useEffect, useState } from 'react';
import { css } from '@/../styled-system/css';

import ITextBlock from '@/types/block-type';
import ISelectionPosition from '@/types/selection-position';
import handleInput from './_handler/handleInput';
import handleKeyDown from './_handler/handleKeyDown';
import handleMouseLeave from './_handler/handleMouseLeave';
import BlockTag from './block-tag';
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
  isSlashMenuOpen: boolean[];
  setIsSlashMenuOpen: React.Dispatch<React.SetStateAction<boolean[]>>;
  slashMenuPosition: { x: number; y: number };
  setSlashMenuPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  startPosition: { x: number; y: number };
  setStartPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  setIsSelectionMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectionMenuPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
}

const blockDiv = css({
  boxSizing: 'border-box',
  width: 'full',
  minHeight: '1.5rem',
  height: 'auto',
  outline: 'none',
  overflowY: 'hidden',
  flexShrink: 0,
  userSelect: 'none',
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
    startPosition,
    setStartPosition,
    setIsSelectionMenuOpen,
    setSelectionMenuPosition,
  }: IBlockComponent) => {
    const prevChildNodesLength = useRef(0);
    const prevClientY = useRef(0);

    // const [isSelectionMenuOpen, setIsSelectionMenuOpen] = useState(true);
    // const [selectionMenuPosition, setSelectionMenuPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
      prevChildNodesLength.current = blockList[index].children.length;
    }, [blockList, index]);

    const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
      setIsDragging(false);

      const textNode = document.caretPositionFromPoint(event.clientX, event.clientY)?.offsetNode;
      const element =
        textNode.nodeType === Node.TEXT_NODE ? (textNode.parentNode as HTMLElement) : (textNode as HTMLElement);
      if (element) {
        const rect = element.getBoundingClientRect();
        const endX = rect.left;
        const endY = rect.top;
        console.log('end 좌표:', rect.left, rect.top);

        // selection이 없을 때, 다른 곳 클릭시 메뉴 닫기
        // if (selectionStartPosition === selectionEndPosition) {
        //   setIsSelectionMenuOpen(false);
        //   return;
        // }

        if (startPosition.y <= endY) {
          setSelectionMenuPosition({ x: startPosition.x, y: startPosition.y });
          setIsSelectionMenuOpen(true);
          console.log('위에서 아래로 드래그');
        }

        if (startPosition.y > endY) {
          setSelectionMenuPosition({ x: endX, y: endY });
          setIsSelectionMenuOpen(true);
          console.log('아래에서 위로 드래그');
        }
      }

      setIsSelectionMenuOpen(true);
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
        onKeyDown={event =>
          handleKeyDown(
            event,
            index,
            blockList,
            setBlockList,
            blockRef,
            setIsTyping,
            setKey,
            isSlashMenuOpen,
            setIsSlashMenuOpen,
            setSlashMenuPosition,
          )
        }
        onMouseUp={event => handleMouseUp(event)}
        onMouseDown={event =>
          handleMouseDown(
            event,
            blockRef,
            index,
            setIsDragging,
            setIsTyping,
            setKey,
            setSelectionStartPosition,
            setStartPosition,
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
        {isSlashMenuOpen[index] && (
          <SlashMenu
            position={slashMenuPosition}
            index={index}
            blockList={blockList}
            blockRef={blockRef}
            setBlockList={setBlockList}
            isSlashMenuOpen={isSlashMenuOpen}
            setIsSlashMenuOpen={setIsSlashMenuOpen}
          />
        )}
      </div>
    );
  },
  (_prevProps, nextProps) => nextProps.isTyping,
);

export default Block;
