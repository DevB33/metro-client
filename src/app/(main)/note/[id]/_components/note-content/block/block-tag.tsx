import { cva } from '@/../styled-system/css';

import { ITextBlock } from '@/types/block-type';
import placeholder from '@/constants/placeholder';

interface IBlockTag {
  block: ITextBlock;
  index: number;
  blockRef: React.RefObject<(HTMLDivElement | null)[]>;
  children: React.ReactNode[];
}

const placeholderStyles = cva({
  base: {
    position: 'relative',
    '.parent:focus-within &': {
      '&[data-empty=true]::before': {
        position: 'absolute',
        top: '0',
        color: 'gray',
        pointerEvents: 'none',
        content: 'attr(data-placeholder)',
      },
    },
  },
  variants: {
    tag: {
      div: {
        '.parent:focus-within &': {
          '&[data-empty=true]::before': {
            left: '0',
            fontSize: 'md',
          },
        },
      },
      h1: {
        '.parent:focus-within &': {
          '&[data-empty=true]::before': {
            left: '5rem',
            fontSize: 'lg',
          },
        },
      },
      h2: {
        '.parent:focus-within &': {
          '&[data-empty=true]::before': {
            left: '5rem',
            fontSize: '1.5rem',
          },
        },
      },
    },
  },
});

const BlockTag = ({ block, index, blockRef, children }: IBlockTag) => {
  if (block.type === 'default') {
    return (
      <p
        data-placeholder={placeholder.block}
        data-empty={`${block.children.length === 1 && block.children[0].content === ''}`}
        className={placeholderStyles({ tag: 'div' })}
        ref={element => {
          // eslint-disable-next-line no-param-reassign
          blockRef.current[index] = element;
        }}
      >
        {children}
      </p>
    );
  }

  if (block.type === 'h1') {
    return (
      <h1
        data-placeholder={placeholder.h1}
        data-empty={`${block.children.length === 1 && block.children[0].content === ''}`}
        className={placeholderStyles({ tag: 'h1' })}
        ref={element => {
          // eslint-disable-next-line no-param-reassign
          blockRef.current[index] = element;
        }}
      >
        {children}
      </h1>
    );
  }

  if (block.type === 'h2') {
    return (
      <h2
        data-placeholder={placeholder.h2}
        data-empty={`${block.children.length === 1 && block.children[0].content === ''}`}
        className={placeholderStyles({ tag: 'h2' })}
        ref={element => {
          // eslint-disable-next-line no-param-reassign
          blockRef.current[index] = element;
        }}
      >
        {children}
      </h2>
    );
  }

  return null;
};

export default BlockTag;
