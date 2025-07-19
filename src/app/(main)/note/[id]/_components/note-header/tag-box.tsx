import { css, cva } from '@/../styled-system/css';

import LineColor from '@/constants/line-color';

interface ITagBox {
  tagName: string;
  color: keyof typeof LineColor;
  isEditing: boolean;
  onDelete: (tagName: string) => void;
}

const TagBox = ({ tagName, color, isEditing, onDelete }: ITagBox) => {
  return (
    <div className={tagBox({ color })}>
      <div className={tagNameContainer}>{tagName}</div>
      {isEditing && (
        <button type="button" className={deleteButton} onClick={() => onDelete(tagName)}>
          x
        </button>
      )}
    </div>
  );
};

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

const tagNameContainer = css({
  width: 'max-content',
  maxWidth: '30rem',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const deleteButton = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pb: '0.1rem',
  cursor: 'pointer',
});

export default TagBox;
