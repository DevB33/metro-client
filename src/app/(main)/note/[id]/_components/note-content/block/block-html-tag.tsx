import { css, cva } from '@/../styled-system/css';

import { ITextBlock } from '@/types/block-type';
import PLACEHOLDER from '@/constants/placeholder';

interface IBlockTag {
  block: ITextBlock;
  blockList: ITextBlock[];
  index: number;
  blockRef: React.RefObject<(HTMLDivElement | null)[]>;
  children: React.ReactNode[];
}

const BlockHTMLTag = ({ block, blockList, index, blockRef, children }: IBlockTag) => {
  if (block.type === 'DEFAULT') {
    return (
      <p
        data-placeholder={PLACEHOLDER.block}
        data-empty={`${block.nodes.length === 1 && block.nodes[0].content === ''}`}
        className={placeholderStyles({ tag: 'p' })}
        ref={element => {
          blockRef.current[index] = element;
        }}
      >
        {children}
      </p>
    );
  }

  if (block.type === 'H1') {
    return (
      <h1
        data-placeholder={PLACEHOLDER.h1}
        data-empty={`${block.nodes.length === 1 && block.nodes[0].content === ''}`}
        className={placeholderStyles({ tag: 'h1' })}
        ref={element => {
          blockRef.current[index] = element;
        }}
      >
        {children}
      </h1>
    );
  }

  if (block.type === 'H2') {
    return (
      <h2
        data-placeholder={PLACEHOLDER.h2}
        data-empty={`${block.nodes.length === 1 && block.nodes[0].content === ''}`}
        className={placeholderStyles({ tag: 'h2' })}
        ref={element => {
          blockRef.current[index] = element;
        }}
      >
        {children}
      </h2>
    );
  }

  if (block.type === 'H3') {
    return (
      <h3
        data-placeholder={PLACEHOLDER.h3}
        data-empty={`${block.nodes.length === 1 && block.nodes[0].content === ''}`}
        className={placeholderStyles({ tag: 'h3' })}
        ref={element => {
          blockRef.current[index] = element;
        }}
      >
        {children}
      </h3>
    );
  }

  if (block.type === 'UL') {
    return (
      <ul>
        <li>
          <p
            data-placeholder={PLACEHOLDER.li}
            data-empty={`${block.nodes.length === 1 && block.nodes[0].content === ''}`}
            className={placeholderStyles({ tag: 'p' })}
            ref={element => {
              blockRef.current[index] = element;
            }}
          >
            {children}
          </p>
        </li>
      </ul>
    );
  }

  if (block.type === 'OL') {
    let startNumber = 1;

    blockList.forEach((item, idx) => {
      if (idx >= index) return;

      if (item.type === 'OL') {
        startNumber += 1;
      } else {
        startNumber = 1;
      }
    });

    return (
      <ol start={startNumber}>
        <li>
          <p
            data-placeholder={PLACEHOLDER.li}
            data-empty={`${block.nodes.length === 1 && block.nodes[0].content === ''}`}
            className={placeholderStyles({ tag: 'p' })}
            ref={element => {
              blockRef.current[index] = element;
            }}
          >
            {children}
          </p>
        </li>
      </ol>
    );
  }

  if (block.type === 'QUOTE') {
    return (
      <blockquote style={{ margin: '0' }}>
        <p
          data-placeholder={PLACEHOLDER.quote}
          data-empty={`${block.nodes.length === 1 && block.nodes[0].content === ''}`}
          className={placeholderStyles({ tag: 'p' })}
          ref={element => {
            blockRef.current[index] = element;
          }}
        >
          {children}
        </p>
      </blockquote>
    );
  }

  if (block.type === 'PAGE') {
    return (
      <div
        className={pageBlock}
        ref={element => {
          blockRef.current[index] = element;
        }}
      >
        {children}
      </div>
    );
  }

  return null;
};

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
      p: {
        '.parent:focus-within &': {
          '&[data-empty=true]::before': {
            fontSize: 'md',
          },
        },
      },
      h1: {
        '.parent:focus-within &': {
          '&[data-empty=true]::before': {
            left: '0.5rem',
            fontSize: 'lg',
          },
        },
      },
      h2: {
        '.parent:focus-within &': {
          '&[data-empty=true]::before': {
            left: '0.5rem',
            fontSize: '1.5rem',
          },
        },
      },
      h3: {
        '.parent:focus-within &': {
          '&[data-empty=true]::before': {
            left: '0.5rem',
            fontSize: '1.25rem',
          },
        },
      },
    },
  },
});

const pageBlock = css({
  display: 'flex',
  justifyContent: 'start',
  gap: '2px',
  width: '100%',
  cursor: 'pointer',
});

export default BlockHTMLTag;
