import { css, cva } from '@/../styled-system/css';

import { ITextBlock } from '@/types/block-type';
import LineColor from '@/constants/line-color';
import TagIcon from '@/icons/tag-icon';

interface IHeader {
  noteData: {
    title: string;
    icon: string;
    cover: string;
    tags: { name: string; color: string }[];
    blocks: ITextBlock[];
  };
}

const container = css({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: '44.5rem',
  pt: '6rem',
});

const cover = css({
  position: 'absolute',
  left: '0',
  top: '0',
  width: '100vw',
  height: '15.5rem',
  zIndex: -1,
});

const icon = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '4rem',
    height: '5.5rem',
    fontSize: 'xl',
  },
  variants: {
    hasCover: {
      true: { mt: '6rem' },
      false: {
        mt: '0',
      },
    },
  },
});

const title = css({
  fontSize: 'lg',
  fontWeight: 'bold',
  color: 'black',
  mt: 'base',
});

const tagContainer = css({
  minHeight: '2rem',
  height: 'auto',
  width: '44.5rem',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'start',
  justifyContent: 'start',
  gap: 'small',
  userSelect: 'none',
  mt: 'base',
});

const typeContainer = css({
  minHeight: '2.5rem',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'start',
  width: '10rem',
  height: 'auto',
  borderRadius: '0.2rem',
  gap: 'tiny',
  color: 'grey',
  cursor: 'pointer',
});

const tagBoxContainer = css({
  minHeight: '2.5rem',
  height: 'auto',
  width: '100%',
  maxWidth: '35rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'start',
  gap: 'tiny',
  cursor: 'pointer',
  padding: 'tiny',
  borderRadius: '0.2rem',
  color: 'grey',
  flexWrap: 'wrap',
});

const tagBox = cva({
  base: {
    height: '1.2rem',
    width: 'auto',
    color: 'white',
    fontSize: '0.75rem',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.25rem',
    px: 'tiny',
    gap: 'tiny',
    cursor: 'default',
  },
  variants: {
    color: {
      LINE_ONE: { backgroundColor: 'lineOne' },
      LINE_TWO: { backgroundColor: 'lineTwo' },
      LINE_THREE: { backgroundColor: 'lineThree' },
      LINE_FOUR: { backgroundColor: 'lineFour' },
      LINE_FIVE: { backgroundColor: 'lineFive' },
      LINE_SIX: { backgroundColor: 'lineSix' },
    },
  },
});

const Header = ({ noteData }: IHeader) => {
  return (
    <>
      {noteData.cover && <div className={cover} style={{ backgroundColor: noteData.cover }} />}
      <div className={container}>
        {(noteData.cover || noteData.icon) && (
          <div className={icon({ hasCover: !!noteData.cover })}>{noteData.icon && noteData.icon}</div>
        )}
        <div className={title}>{noteData.title}</div>
        <div className={tagContainer}>
          <div className={typeContainer}>
            <TagIcon />
            태그
          </div>
          <div className={tagBoxContainer}>
            {noteData.tags.length !== 0 ? (
              noteData.tags.map(tag => (
                <div key={tag.name} className={tagBox({ color: tag.color as keyof typeof LineColor })}>
                  {tag.name}
                </div>
              ))
            ) : (
              <div>비어있음</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;

// cover 있고 아이콘 있으면 아이콘 있음
// cover 없고 아이콘 있으면 아이콘 있음
// cover 있고 아이콘 없으면 아이콘 있음
// cover 없고 아이콘 없으면 아이콘 없음
