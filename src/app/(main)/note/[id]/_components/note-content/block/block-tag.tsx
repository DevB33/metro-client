import { css } from '@/../styled-system/css';

import { ITextBlock } from '@/types/block-type';
import placeholder from '@/constants/placeholder';

interface IBlockTag {
  block: ITextBlock;
  index: number;
  blockRef: React.RefObject<(HTMLDivElement | null)[]>;
  children: React.ReactNode[];
}

const placeholderDiv = css({
  position: 'relative',

  '.parent:focus-within &': {
    '&[data-empty=true]': {
      '&::before': {
        position: 'absolute',
        top: '0',
        left: '0',
        content: 'attr(data-placeholder)',
        color: 'gray',
        fontSize: 'md',
        pointerEvents: 'none',
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
        className={placeholderDiv}
        ref={element => {
          // eslint-disable-next-line no-param-reassign
          blockRef.current[index] = element;
        }}
      >
        {children}
      </p>
    );
  }

  return null;
};

export default BlockTag;
