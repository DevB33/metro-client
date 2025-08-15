import { css } from '@/../styled-system/css';

import INotes from '@/types/note-type';
import { ITextBlock } from '@/types/block-type';
import PageIcon from '@/icons/page-icon';
import GhostBlockHTMLTag from './ghost-block-html-tag';

interface IGhostBlock {
  ghostRef: React.RefObject<HTMLDivElement | null>;
  block: ITextBlock;
  blockList: ITextBlock[];
  index: number;
  childNotes: Record<string, INotes>;
}

const GhostBlock = ({ ghostRef, block, blockList, index, childNotes }: IGhostBlock) => {
  if (block.type === 'PAGE') {
    return (
      <div ref={ghostRef} className={container}>
        <GhostBlockHTMLTag block={block} blockList={blockList} index={index}>
          {(block.nodes[0]?.content && childNotes?.[block.nodes[0].content]?.icon) || <PageIcon color="grey" />}
          <span className={pageTitle}>
            {(block.nodes[0]?.content && childNotes?.[block.nodes[0].content]?.title) || '새 페이지'}
          </span>
        </GhostBlockHTMLTag>
      </div>
    );
  }

  return (
    <div ref={ghostRef} className={container}>
      <GhostBlockHTMLTag block={block} blockList={blockList} index={index}>
        {block.nodes?.map((child, idx) => {
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
