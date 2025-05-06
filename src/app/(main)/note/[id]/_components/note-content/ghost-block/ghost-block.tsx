import { css } from '@/../styled-system/css';

import { ITextBlock } from '@/types/block-type';
import GhostBlockHTMLTag from './ghost-block-html-tag';

interface IGhostBlock {
  ghostRef: React.RefObject<HTMLDivElement | null>;
  block: ITextBlock;
  blockList: ITextBlock[];
  index: number;
}

const container = css({
  position: 'absolute',
  top: '-9999px',
  left: '-9999px',
  padding: '8px 16px',
  borderRadius: '4px',
});

const GhostBlock = ({ ghostRef, block, blockList, index }: IGhostBlock) => {
  console.log(block);
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

export default GhostBlock;
