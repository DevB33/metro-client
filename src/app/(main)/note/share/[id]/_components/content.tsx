import { css } from '@/../styled-system/css';

import { ITextBlock } from '@/types/block-type';
import BlockHTMLTag from './block-html-tag';

const container = css({
  display: 'flex',
  flexDirection: 'column',
  width: '44.5rem',
  mt: 'base',
});

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
  mb: 'tiny',
});

const Content = () => {
  const blocks: ITextBlock[] = [
    {
      id: '1',
      type: 'H1',
      nodes: [
        {
          id: '1-1',
          type: 'text',
          style: {
            fontStyle: 'italic',
            fontWeight: 'bold',
            textDecoration: 'underline',
            color: 'black',
            backgroundColor: 'white',
            width: '100%',
            height: 'auto',
            borderRadius: 4,
          },
          content: '제목1 입니다.',
        },
      ],
      order: 1,
    },
    {
      id: '2',
      type: 'DEFAULT',
      nodes: [
        {
          type: 'text',
          style: {
            fontStyle: 'normal',
            fontWeight: 'regular',
            textDecoration: 'none',
            color: 'black',
            backgroundColor: 'white',
            width: '100%',
            height: 'auto',
            borderRadius: 0,
          },
          content: '기본 블록 입니다.',
        },
      ],
      order: 2,
    },
  ];

  return (
    <div className={container}>
      {blocks.map((block, index) => (
        <div key={block.id} className={blockDiv}>
          <BlockHTMLTag block={block} blocks={blocks} index={index}>
            {block.nodes.map(child => {
              if (child.type === 'br') {
                return <br key={child.id} />;
              }

              if (child.type === 'text') {
                return child.content;
              }

              return (
                <span key={child.id} style={child.style}>
                  {child.content}
                </span>
              );
            })}
          </BlockHTMLTag>
        </div>
      ))}
    </div>
  );
};

export default Content;
