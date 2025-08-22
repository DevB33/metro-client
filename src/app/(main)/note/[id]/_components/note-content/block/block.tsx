import { memo, useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mutate } from 'swr';
import { css } from '@/../styled-system/css';

import { ITextBlock } from '@/types/block-type';
import INotes from '@/types/note-type';
import ISelectionPosition from '@/types/selection-position';
import IMenuState from '@/types/menu-type';
import { getBlockList, updateBlocksOrder } from '@/apis/client/block';
import { getNoteList } from '@/apis/client/note';
import PageIcon from '@/icons/page-icon';
import SWR_KEYS from '@/constants/swr-keys';
import handleInput from './handler/handleInput';
import handleKeyDown from './handler/handleKeyDown';
import handleMouseLeave from './handler/handleMouseLeave';
import handleMouseDown from './handler/handleMouseDown';
import handleMouseMove from './handler/handleMouseMove';
import handleMouseUp from './handler/handleMouseUp';
import BlockHTMLTag from './block-html-tag';

interface IBlockComponent {
  block: ITextBlock;
  index: number;
  blockRef: React.RefObject<(HTMLDivElement | null)[]>;
  blockList: ITextBlock[];
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  setKey: React.Dispatch<React.SetStateAction<number>>;
  isDragging: React.RefObject<boolean>;
  isUp: React.RefObject<boolean>;
  selection: ISelectionPosition;
  setSelection: React.Dispatch<React.SetStateAction<ISelectionPosition>>;
  menuState: IMenuState;
  setMenuState: React.Dispatch<React.SetStateAction<IMenuState>>;
  dragBlockIndex: number | null;
  childNotes: Record<string, INotes>;
}

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
    selection,
    setSelection,
    menuState,
    setMenuState,
    dragBlockIndex,
    isUp,
    childNotes,
  }: IBlockComponent) => {
    const router = useRouter();
    const params = useParams();
    const noteId = params.id as string;

    const prevChildNodesLength = useRef(0);

    const [isDragOver, setIsDragOver] = useState(false);
    const [isDragFirst, setIsDragFirst] = useState(false);

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

      await mutate(SWR_KEYS.blockList(noteId), getBlockList(noteId), false);
      await mutate(SWR_KEYS.NOTE_LIST, getNoteList, false);
    };

    const changeBlockOrderToFirst = async () => {
      setIsDragFirst(false);
      await updateBlocksOrder(
        noteId,
        blockList[dragBlockIndex as number].order,
        blockList[dragBlockIndex as number].order,
        -1,
      );

      await mutate(SWR_KEYS.blockList(noteId), getBlockList(noteId), false);
      await mutate(SWR_KEYS.NOTE_LIST, getNoteList, false);
    };

    if (block.type === 'PAGE') {
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
            className={`parent ${blockDiv} ${pageButton} `}
            style={{
              borderBottom: isDragOver ? '4px solid lightblue' : 'none',
              borderTop: isDragFirst ? '4px solid lightblue' : 'none',
            }}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                router.push(`/note/${block.nodes[0].content}`);
              }
            }}
            onMouseUp={event => {
              handleMouseUp(event, index, blockRef, blockList, selection, setSelection, setMenuState);
              isDragging.current = false;
            }}
            onMouseDown={_event => {
              router.push(`/note/${block.nodes[0].content}`);
            }}
            onMouseMove={event =>
              handleMouseMove(event, index, blockRef, blockList, isDragging, selection, setSelection)
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
            onDrop={changeBlockOrder}
          >
            <BlockHTMLTag block={block} blockList={blockList} index={index} blockRef={blockRef}>
              {(block.nodes[0]?.content && childNotes?.[block.nodes[0].content]?.icon) || <PageIcon color="grey" />}
              <span className={pageTitle}>
                {(block.nodes[0]?.content && childNotes?.[block.nodes[0].content]?.title) || '새 페이지'}
              </span>
            </BlockHTMLTag>
          </div>
        </div>
      );
    }

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
            isDragging.current = false;
          }}
          onMouseDown={event => {
            handleMouseDown(event, blockRef, index, blockList, isDragging, setIsTyping, setKey, setSelection);
            setMenuState(prev => ({
              ...prev,
              blockButtonModalIndex: null,
              isBlockMenuOpen: false,
              slashMenuOpenIndex: null,
              isSlashMenuOpen: false,
            }));
          }}
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

const pageButton = css({
  display: 'flex',
  justifyContent: 'start',
  width: 'full',
  backgroundColor: 'transparent',
  _hover: {
    backgroundColor: 'gray.200',
  },
  borderRadius: '0.25rem',
});

const pageTitle = css({
  color: 'gray.600',
  textDecoration: 'underline',
  fontWeight: 'bold',
  width: '100%',
});

export default Block;
