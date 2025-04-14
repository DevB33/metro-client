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
      id: 1,
      type: 'h1',
      children: [
        {
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
    },
    {
      id: 2,
      type: 'default',
      children: [
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
    },
    {
      id: 3,
      type: 'quote',
      children: [
        {
          type: 'text',
          style: {
            fontStyle: 'italic',
            fontWeight: 'regular',
            textDecoration: 'none',
            color: 'black',
            backgroundColor: 'grey',
            width: '100%',
            height: 'auto',
            borderRadius: 8,
          },
          content: '인용문입니다.',
        },
      ],
    },
    {
      id: 4,
      type: 'h2',
      children: [
        {
          type: 'text',
          style: {
            fontStyle: 'normal',
            fontWeight: 'bold',
            textDecoration: 'underline',
            color: 'black',
            backgroundColor: 'white',
            width: '100%',
            height: 'auto',
            borderRadius: 4,
          },
          content: '제목2 입니다.',
        },
      ],
    },
    {
      id: 5,
      type: 'ul',
      children: [
        {
          type: 'span',
          style: {
            fontStyle: 'normal',
            fontWeight: 'bold',
            textDecoration: 'none',
            color: 'black',
            backgroundColor: 'white',
            width: '100%',
            height: 'auto',
            borderRadius: 0,
          },
          content: '순서가 없는 리스트 1 bold',
        },
      ],
    },
    {
      id: 6,
      type: 'ul',
      children: [
        {
          type: 'span',
          style: {
            fontStyle: 'italic',
            fontWeight: 'regular',
            textDecoration: 'none',
            color: 'black',
            backgroundColor: 'white',
            width: '100%',
            height: 'auto',
            borderRadius: 0,
          },
          content: '순서가 없는 리스트 2 italic',
        },
      ],
    },
    {
      id: 7,
      type: 'ol',
      children: [
        {
          type: 'text',
          style: {
            fontStyle: 'normal',
            fontWeight: 'bold',
            textDecoration: 'none',
            color: 'black',
            backgroundColor: 'white',
            width: '100%',
            height: 'auto',
            borderRadius: 0,
          },
          content: '순서가 있는 리스트 1',
        },
      ],
    },
    {
      id: 8,
      type: 'ol',
      children: [
        {
          type: 'text',
          style: {
            fontStyle: 'italic',
            fontWeight: 'regular',
            textDecoration: 'none',
            color: 'black',
            backgroundColor: 'white',
            width: '100%',
            height: 'auto',
            borderRadius: 0,
          },
          content: '순서가 있는 리스트 2',
        },
      ],
    },
    {
      id: 9,
      type: 'default',
      children: [
        {
          type: 'span',
          style: {
            fontStyle: 'normal',
            fontWeight: 'regular',
            textDecoration: 'none',
            color: 'red',
            backgroundColor: 'rgba(161, 161, 161, 0.5)',
            width: '100%',
            height: 'auto',
            borderRadius: 0,
          },
          content: '코드 블록 입니다.',
        },
      ],
    },
  ];

  return (
    <div className={container}>
      {blocks.map((block, index) => (
        <div key={block.id} className={blockDiv}>
          <BlockHTMLTag block={block} blocks={blocks} index={index}>
            {block.children.map((child, idx) => {
              if (child.type === 'br') {
                return <br key={idx} />;
              }

              if (child.type === 'text') {
                return child.content;
              }

              return (
                <span key={idx} style={child.style}>
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
