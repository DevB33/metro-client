import { memo, useRef, useEffect } from 'react';
import { css } from '@/../styled-system/css';

import ITextBlock from '@/types/block-type';
import ISelectionPosition from '@/types/selection-position';
import fillHTMLElementBackgroundImage from '@/utils/fillHTMLElementBackgroundImage';
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
});

const fakeBox = css({
  position: 'fixed',
  left: '0',
  right: '0',
  width: '100vw',
  height: 'var(--block-height)',
  zIndex: '-1',

  pointerEvents: 'auto',
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
  }: IBlockComponent) => {
    const prevChildNodesLength = useRef(0);
    const prevClientY = useRef(0);

    const fakeBoxRef = useRef<HTMLDivElement | null>(null);

    const getNodeBounds = (node: Node, startOffset: number, endOffset: number) => {
      const range = document.createRange();
      range.setStart(node as Node, startOffset);
      range.setEnd(node as Node, endOffset);
      return range.getBoundingClientRect();
    };

    const handleFakeBoxMouseEnter = () => {
      console.log('enter');
      if (!isDragging) return;
      const parent = blockRef.current[index];
      const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);

      setSelectionEndPosition((prev: ISelectionPosition) => ({
        ...prev,
        blockIndex: index,
      }));

      let left = 99999;
      let right = 0;

      childNodes.forEach(childNode => {
        const rect = getNodeBounds(childNode as Node, 0, childNode.textContent?.length as number);
        left = Math.min(left, rect.left);
        right = Math.max(right, rect.right);
        const blockElement = blockRef.current[index];
        const blockElementMarginLeft = blockElement?.getBoundingClientRect().left || 0;

        if (!blockElement) return;
        fillHTMLElementBackgroundImage(blockElement, left - blockElementMarginLeft, right - blockElementMarginLeft);
      });
    };

    const handleFakeBoxMouseLeave = () => {
      console.log('leave:', index);
      if (!isDragging) return;
      const parent = blockRef.current[index];
      const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);

      if (selectionStartPosition.blockIndex === selectionEndPosition.blockIndex) {
        if (isUp && selectionStartPosition.blockIndex === 0) {
          const el = blockRef.current[index];
          if (!el) return;
          el.style.backgroundImage = `none`;
        }
      }

      // 아래로 드래그한 상태에서 블록을 떠날 때
      if (selectionStartPosition.blockIndex < selectionEndPosition.blockIndex) {
        if (index === selectionEndPosition.blockIndex && isUp) {
          const el = blockRef.current[index];
          if (!el) return;
          el.style.backgroundImage = `none`;
        }
        // 아래로 드래그 할 때
        if (index !== selectionStartPosition.blockIndex && index === selectionEndPosition.blockIndex && !isUp) {
          let left = 99999;
          let right = 0;
          childNodes.forEach(childNode => {
            const rect = getNodeBounds(childNode as Node, 0, childNode.textContent?.length as number);
            left = Math.min(left, rect.left);
            right = Math.max(right, rect.right);
            const blockElement = blockRef.current[index];
            const blockElementMarginLeft = blockElement?.getBoundingClientRect().left || 0;
            if (!blockElement) return;
            fillHTMLElementBackgroundImage(blockElement, left - blockElementMarginLeft, right - blockElementMarginLeft);
          });
        }
      }
      // 위로 드래그한 상태에서 블록을 떠날 때
      if (selectionStartPosition.blockIndex > selectionEndPosition.blockIndex) {
        // 아래로 드래그 할 때
        if (index !== selectionStartPosition.blockIndex && index === selectionEndPosition.blockIndex && !isUp) {
          const el = blockRef.current[index];
          if (!el) return;
          el.style.backgroundImage = `none`;
        }

        // 위로 드래그 할 때
        if (index !== selectionStartPosition.blockIndex && index === selectionEndPosition.blockIndex && isUp) {
          let left = 99999;
          let right = 0;
          childNodes.forEach(childNode => {
            const rect = getNodeBounds(childNode as Node, 0, childNode.textContent?.length as number);
            left = Math.min(left, rect.left);
            right = Math.max(right, rect.right);
            const blockElement = blockRef.current[index];
            const blockElementMarginLeft = blockElement?.getBoundingClientRect().left || 0;
            if (!blockElement) return;
            fillHTMLElementBackgroundImage(blockElement, left - blockElementMarginLeft, right - blockElementMarginLeft);
          });
        }
      }
    };

    useEffect(() => {
      if (blockRef.current && blockRef.current[index]) {
        const blockHeight = blockRef.current[index]?.offsetHeight;
        if (fakeBoxRef.current && blockHeight) {
          fakeBoxRef.current.style.height = `${blockHeight}px`;
        }
      }
    }, [blockList]);

    useEffect(() => {
      prevChildNodesLength.current = blockList[index].children.length;
    }, [blockList, index]);

    return (
      <>
        <div
          className={fakeBox}
          ref={fakeBoxRef}
          onMouseEnter={handleFakeBoxMouseEnter}
          onMouseLeave={handleFakeBoxMouseLeave}
        />
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
          onMouseUp={() => {
            setIsDragging(false);
          }}
          onMouseDown={event =>
            handleMouseDown(event, blockRef, index, setIsDragging, setIsTyping, setKey, setSelectionStartPosition)
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
      </>
    );
  },
  (_prevProps, nextProps) => nextProps.isTyping,
);

export default Block;
