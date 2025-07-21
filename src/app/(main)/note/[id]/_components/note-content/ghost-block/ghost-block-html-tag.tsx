import { css } from '@/../styled-system/css';

import { ITextBlock } from '@/types/block-type';

interface IGhostBlockHTMLTag {
  block: ITextBlock;
  blockList: ITextBlock[];
  index: number;
  children: React.ReactNode[];
}

const GhostBlockHTMLTag = ({ block, blockList, index, children }: IGhostBlockHTMLTag) => {
  if (block.type === 'DEFAULT') {
    return <p className={htmltag}>{children}</p>;
  }

  if (block.type === 'H1') {
    return <h1 className={htmltag}>{children}</h1>;
  }

  if (block.type === 'H2') {
    return <h2 className={htmltag}>{children}</h2>;
  }

  if (block.type === 'H3') {
    return <h3 className={htmltag}>{children}</h3>;
  }

  if (block.type === 'UL') {
    return (
      <ul>
        <li>
          <p className={htmltag}>{children}</p>
        </li>
      </ul>
    );
  }

  if (block.type === 'OL') {
    let startNumber = 1;

    blockList.forEach((item, idx) => {
      // 현재 블록 이후 블록은 볼 필요가 없어서 return
      if (idx >= index) return;

      // 현재 블록이 OL 타입이고, 이전 블록이 OL 타입이면 startNumber를 증가시킴
      if (item.type === 'OL') {
        startNumber += 1;
      } else {
        // 현재 블록이 OL 타입이 아니면 startNumber를 1로 초기화
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

  if (block.type === 'QUOTE') {
    return (
      <blockquote>
        <p className={htmltag}>{children}</p>
      </blockquote>
    );
  }

  // TODO: 페이지 블록 추가

  return null;
};

const htmltag = css({
  opacity: '0.4',
});

export default GhostBlockHTMLTag;
