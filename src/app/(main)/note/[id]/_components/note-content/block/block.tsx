import { useState, memo, useRef, useEffect } from 'react';
import { css } from '@/../styled-system/css';

import { ITextBlock } from '@/types/block-type';
import placeholder from '@/constants/placeholder';
import handleInput from './_handler/handleInput';
import handleKeyDown from './_handler/handleKeyDown';

interface IBlockComponent {
  block: ITextBlock;
  index: number;
  blockRef: React.RefObject<(HTMLDivElement | null)[]>;
  blockList: ITextBlock[];
  setBlockList: (blockList: ITextBlock[]) => void;
  isTyping: boolean;
  setIsTyping: (isTyping: boolean) => void;
}

const blockDiv = css({
  position: 'relative',
  boxSizing: 'border-box',
  width: 'full',
  minHeight: '2rem',
  height: 'auto',
  outline: 'none',
  overflowY: 'hidden',
  flexShrink: 0,

  '&:focus:empty::before': {
    position: 'absolute',
    top: '0',
    left: '0',
    content: 'attr(data-placeholder)',
    color: 'gray',
    fontSize: 'md',
    pointerEvents: 'none',
  },
});

const Block = memo(
  ({ block, index, blockRef, blockList, setBlockList, isTyping: _isTyping, setIsTyping }: IBlockComponent) => {
    const [key, setKey] = useState(Date.now());
    const prevChildNodesLength = useRef(0);

    useEffect(() => {
      prevChildNodesLength.current = blockList[index].children.length;
    }, [blockList, index]);

    return (
      <div
        key={key}
        role="textbox"
        tabIndex={0}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder.block}
        className={blockDiv}
        onInput={event => {
          setIsTyping(true);
          handleInput(event, index, blockList, setBlockList, blockRef, prevChildNodesLength);
        }}
        onKeyDown={event => handleKeyDown(event, index, blockList, setBlockList, blockRef, setIsTyping, setKey)}
        ref={element => {
          // eslint-disable-next-line no-param-reassign
          blockRef.current[index] = element;
        }}
      >
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
      </div>
    );
  },
  (_prevProps, nextProps) => nextProps.isTyping,
);

export default Block;
