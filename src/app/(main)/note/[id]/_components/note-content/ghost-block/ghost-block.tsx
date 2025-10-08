import { Fragment } from 'react';
import { css } from '@/../styled-system/css';

import { ITextBlock } from '@/types/block-type';
import PageIcon from '@/icons/page-icon';
import GhostBlockHTMLTag from './ghost-block-html-tag';

interface IGhostBlock {
  ghostRef: React.RefObject<HTMLDivElement | null>;
  block: ITextBlock;
  blockList: ITextBlock[];
  index: number;
}

const GhostBlock = ({ ghostRef, block, blockList, index }: IGhostBlock) => {
  console.log('GhostBlock 렌더링', block);
  if (block.type === 'PAGE') {
    return (
      <div ref={ghostRef} className={container}>
        <GhostBlockHTMLTag block={block} blockList={blockList} index={index}>
          {block.nodes[0]?.content?.split(':')[0] === '' ? (
            <PageIcon color="grey" />
          ) : (
            block.nodes[0]?.content?.split(':')[0]
          )}
          <span className={pageTitle}>
            {block.nodes[0]?.content?.split(':')[1] === '' ? '새 페이지' : block.nodes[0]?.content?.split(':')[1]}
          </span>
        </GhostBlockHTMLTag>
      </div>
    );
  }

  return (
    <div ref={ghostRef} className={container}>
      <GhostBlockHTMLTag block={block} blockList={blockList} index={index}>
        {block.nodes?.map(child => {
          if (child.type === 'br') {
            return <br key={child.id} />;
          }

          if (child.type === 'text') {
            return <Fragment key={child.id}>{child.content}</Fragment>;
          }

          return (
            <span key={child.id} style={child.style}>
              {child.content}
            </span>
          );
        })}
      </GhostBlockHTMLTag>
    </div>
  );
};

const container = css({
  position: 'absolute',
  top: '-9999px',
  left: '-9999px',
  padding: '8px 16px',
  borderRadius: '4px',
});

const pageTitle = css({
  color: 'gray.600',
  textDecoration: 'underline',
  fontWeight: 'bold',
  width: '100%',
});

export default GhostBlock;
