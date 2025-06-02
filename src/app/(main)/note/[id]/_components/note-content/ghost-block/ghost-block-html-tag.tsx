import { css } from '@/../styled-system/css';

import { ITextBlock } from '@/types/block-type';

interface IGhostBlockHTMLTag {
  block: ITextBlock;
  blockList: ITextBlock[];
  index: number;
  children: React.ReactNode[];
}

const htmltag = css({
  opacity: '0.4',
});

const GhostBlockHTMLTag = ({ block, blockList, index, children }: IGhostBlockHTMLTag) => {
  if (block.type === 'DEFAULT') {
    return <p className={htmltag}>{children}</p>;
  }

  if (block.type === 'h1') {
    return <h1 className={htmltag}>{children}</h1>;
  }

  if (block.type === 'h2') {
    return <h2 className={htmltag}>{children}</h2>;
  }

  if (block.type === 'h3') {
    return <h3 className={htmltag}>{children}</h3>;
  }

  if (block.type === 'ul') {
    return (
      <ul>
        <li>
          <p className={htmltag}>{children}</p>
        </li>
      </ul>
    );
  }

  if (block.type === 'ol') {
    let startNumber = 1;

    blockList.forEach((item, idx) => {
      if (idx >= index) return;

      if (item.type === 'ol') {
        startNumber += 1;
      } else {
        startNumber = 1;
      }
    });

    return (
      <ol start={startNumber}>
        <li>
          <p className={htmltag}>{children}</p>
        </li>
      </ol>
    );
  }

  if (block.type === 'quote') {
    return (
      <blockquote>
        <p className={htmltag}>{children}</p>
      </blockquote>
    );
  }

  return null;
};

export default GhostBlockHTMLTag;
