import { ITextBlock } from '@/types/block-type';

interface IBlockTag {
  block: ITextBlock;
  blocks: ITextBlock[];
  index: number;
  children: React.ReactNode[];
}

const BlockHTMLTag = ({ block, blocks, index, children }: IBlockTag) => {
  if (block.type === 'DEFAULT') {
    return <p>{children}</p>;
  }

  if (block.type === 'H1') {
    return <h1>{children}</h1>;
  }

  if (block.type === 'H2') {
    return <h2>{children}</h2>;
  }

  if (block.type === 'H3') {
    return <h3>{children}</h3>;
  }

  if (block.type === 'UL') {
    return (
      <ul>
        <li>
          <p>{children}</p>
        </li>
      </ul>
    );
  }

  if (block.type === 'OL') {
    let startNumber = 1;

    blocks.forEach((item, idx) => {
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
          <p>{children}</p>
        </li>
      </ol>
    );
  }

  if (block.type === 'QUOTE') {
    return (
      <blockquote>
        <p>{children}</p>
      </blockquote>
    );
  }

  return null;
};

export default BlockHTMLTag;
