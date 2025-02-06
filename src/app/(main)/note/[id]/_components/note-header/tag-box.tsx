import { css, cva } from '@/../styled-system/css';
import LineColor from '@/constants/line-color';

interface ITagBox {
  tagName: string;
  color: keyof typeof LineColor;
  isEditing: boolean;
  onDelete: (tagName: string) => void;
}

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
      lineOne: { backgroundColor: 'lineOne' },
      lineTwo: { backgroundColor: 'lineTwo' },
      lineThree: { backgroundColor: 'lineThree' },
      lineFour: { backgroundColor: 'lineFour' },
      lineFive: { backgroundColor: 'lineFive' },
      lineSix: { backgroundColor: 'lineSix' },
    },
  },
});

const deleteButton = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pb: '0.1rem',
  cursor: 'pointer',
});

const TagBox = ({ tagName, color, isEditing, onDelete }: ITagBox) => {
  return (
    <div className={tagBox({ color })}>
      {tagName}
      {isEditing && (
        <button type="button" className={deleteButton} onClick={() => onDelete(tagName)}>
          x
        </button>
      )}
    </div>
  );
};

export default TagBox;
