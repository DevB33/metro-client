import { memo, useRef, useEffect } from 'react';
import { css } from '@/../styled-system/css';

import { ITextBlock } from '@/types/block-type';
import handleInput from './_handler/handleInput';
import handleKeyDown from './_handler/handleKeyDown';
import BlockTag from './block-tag';
import SlashMenu from './slash-menu';

interface IBlockComponent {
  block: ITextBlock;
  index: number;
  blockRef: React.RefObject<(HTMLDivElement | null)[]>;
  blockList: ITextBlock[];
  setBlockList: (blockList: ITextBlock[]) => void;
  isTyping: boolean;
  setIsTyping: (isTyping: boolean) => void;
  setKey: (key: number) => void;
  isSlashMenuOpen: boolean;
  setIsSlashMenuOpen: (isSlashMenu: boolean) => void;
  slashMenuPosition: { x: number; y: number };
  setSlashMenuPosition: (slashMenuPosition: { x: number; y: number }) => void;
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
    isSlashMenuOpen,
    setIsSlashMenuOpen,
    slashMenuPosition,
    setSlashMenuPosition,
  }: IBlockComponent) => {
    const prevChildNodesLength = useRef(0);

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
        onInput={event => {
          setIsTyping(true);
          handleInput(event, index, blockList, setBlockList, blockRef, prevChildNodesLength);
        }}
        onKeyDown={event => {
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
          );
        }}
      >
        <BlockTag block={block} index={index} blockRef={blockRef}>
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
        {isSlashMenuOpen && (
          <SlashMenu
            position={slashMenuPosition}
            index={index}
            blockList={blockList}
            setBlockList={setBlockList}
            setIsSlashMenuOpen={setIsSlashMenuOpen}
          />
        )}
      </div>
    );
  },
  (_prevProps, nextProps) => nextProps.isTyping,
);

export default Block;
