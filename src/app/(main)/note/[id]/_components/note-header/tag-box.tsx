import { cva } from '@/../styled-system/css';
import LineColor from '@/constants/line-color';

interface ITagBox {
  tagName: string;
  color: keyof typeof LineColor;
}

const tagBox = cva({
  base: {
    height: '1.2rem',
    width: 'auto',
    color: 'white',
    fontSize: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.25rem',
    px: 'tiny',
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

const TagBox = ({ tagName, color }: ITagBox) => {
  return <div className={tagBox({ color })}>{tagName}</div>;
};

export default TagBox;
