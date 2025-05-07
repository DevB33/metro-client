import { memo, useState, useRef, useEffect } from 'react';
import { css } from '@/../styled-system/css';

import { ITextBlock } from '@/types/block-type';
import ISelectionPosition from '@/types/selection-position';
import IMenuState from '@/types/menu-type';
import keyName from '@/constants/key-name';
import handleInput from './handler/handleInput';
import handleKeyDown from './handler/handleKeyDown';
import handleMouseLeave from './handler/handleMouseLeave';
import BlockHTMLTag from './block-html-tag';
import handleMouseDown from './handler/handleMouseDown';
import handleMouseMove from './handler/handleMouseMove';
import handleMouseUp from './handler/handleMouseUp';
import editSelectionContent from '../selection-menu/editSelectionContent';

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
  isUp: React.RefObject<boolean>;
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

const hiddenInputContainer = css({
  position: 'absolute',
  opacity: 0,
  pointerEvents: 'none',
  width: '1px',
  height: '1px',
  zIndex: -1,
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
    selection,
    setSelection,
    menuState,
    setMenuState,
    dragBlockIndex,
    isUp,
  }: IBlockComponent) => {
    const prevChildNodesLength = useRef(0);
    const hiddenInputRef = useRef<HTMLInputElement>(null);

    const [isDragOver, setIsDragOver] = useState(false);

    useEffect(() => {
      prevChildNodesLength.current = blockList[index].children.length;
    }, [blockList, index]);

    useEffect(() => {
      if (menuState.isSelectionMenuOpen) {
        hiddenInputRef.current?.focus();
      }
    }, [menuState]);

    const focusAfterSelection = (
      selection: ISelectionPosition,
      isBackward: boolean,
      key: string,
      blockRef: React.RefObject<(HTMLDivElement | null)[]>,
    ) => {
      const target = isBackward ? selection.end : selection.start;
      const { blockIndex, childNodeIndex, offset } = target;
      const targetBlockNode = blockRef.current[blockIndex];
      const targetNode = targetBlockNode?.childNodes[childNodeIndex];
      const targetOffset = Math.min(offset, 0);

      setTimeout(() => {
        if (targetNode) {
          const newRange = document.createRange();
          const windowSelection = window.getSelection();

          if (targetNode.nodeType === Node.TEXT_NODE) {
            console.log(offset, targetNode.textContent?.length);
            newRange.setStart(targetNode, Math.min(offset, targetOffset));
            newRange.collapse(true);
            windowSelection?.removeAllRanges();
            windowSelection?.addRange(newRange);
            document.execCommand('insertText', false, key);
          } else {
            if (targetNode.nodeName === 'BR') {
              newRange.setStart(targetNode as Node, Math.min(offset, targetNode.textContent?.length ?? 0));
            } else {
              newRange.setStart(targetNode.firstChild as Node, Math.min(offset, targetNode.textContent?.length ?? 0));
            }
            newRange.collapse(true);
            windowSelection?.removeAllRanges();
            windowSelection?.addRange(newRange);
          }
        }
      }, 0);
    };

    const handleHiddenInput = (event: React.FormEvent<HTMLInputElement>) => {
      event.preventDefault();
      setIsTyping(false);
      setKey(Math.random());

      const isBackward =
        selection.start.blockIndex > selection.end.blockIndex ||
        (selection.start.blockIndex === selection.end.blockIndex &&
          selection.start.childNodeIndex > selection.end.childNodeIndex) ||
        (selection.start.blockIndex === selection.end.blockIndex &&
          selection.start.childNodeIndex === selection.end.childNodeIndex &&
          selection.start.offset > selection.end.offset);
      // if (!isBackward) {
      //   editSelectionContent('delete', event.nativeEvent.data, selection, blockList, setBlockList, blockRef);
      //   selection.start.offset = 1;
      //   // selection 시작점의 offset이 0이라 시작노드가 다 지워질떄가 아니면 새로 생성된 노드에 focus
      //   if (selection.start.offset !== 0) {
      //     selection.start.childNodeIndex += 1;
      //   }
      // } else {
      //   console.log(event);
      //   editSelectionContent('delete', event.nativeEvent.data, selection, blockList, setBlockList, blockRef);
      //   selection.end.offset = 1;
      //   if (selection.end.offset !== 0) {
      //     selection.end.childNodeIndex += 1;
      //   }
      // }
      editSelectionContent('delete', event.nativeEvent.data, selection, blockList, setBlockList, blockRef);
      setTimeout(() => {
        focusAfterSelection(selection, isBackward, event.nativeEvent.data, blockRef);
      }, 0);
    };

    return (
      <>
        <input
          className={hiddenInputContainer}
          ref={hiddenInputRef}
          onInput={event => {
            setIsTyping(true);
            handleHiddenInput(event);
          }}
        />
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
          onKeyDown={event => {
            setIsTyping(true);
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
            );
          }}
          onMouseUp={event => {
            handleMouseUp(event, index, blockRef, blockList, selection, setMenuState);
            setIsDragging(false);
          }}
          onMouseDown={event =>
            handleMouseDown(event, blockRef, index, blockList, setIsDragging, setIsTyping, setKey, setSelection)
          }
          onMouseMove={event => handleMouseMove(event, index, blockRef, isDragging, selection, setSelection)}
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
            {block.children.length === 1 && block.children[0].content === '' && <br />}
            {block.children.map(child => {
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
      </>
    );
  },
  (_prevProps, nextProps) => nextProps.isTyping,
);

export default Block;
